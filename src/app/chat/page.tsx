'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Send, Image as ImageIcon, MoreVertical, Search, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { Socket } from 'socket.io-client';
import { useSocket } from '@/context/SocketContext';

interface Participant {
    _id: string;
    name: string;
    avatar?: string;
}

interface Chat {
    _id: string;
    listingId: {
        _id: string;
        title: string;
        price: number;
        images: string[];
    };
    participants: Participant[];
    lastMessage: string;
    lastMessageAt: string;
}

interface Message {
    _id: string;
    chatId: string;
    senderId: {
        _id: string;
        name: string;
        avatar?: string;
    } | string; // Can be string on send before populate
    content: string;
    createdAt: string;
    readBy?: string[];
    messageType?: 'text' | 'image';
    mediaUrl?: string;
}

export default function ChatPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialChatId = searchParams.get('id');
    const { socket } = useSocket(); // Use global socket

    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Fetch Chats List
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchChats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/chats', {
                    headers: { 'Authorization': `Bearer ${user?.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setChats(data);

                    // If initialChatId, set active
                    if (initialChatId) {
                        const target = data.find((c: Chat) => c._id === initialChatId);
                        if (target) setActiveChat(target);
                    } else if (data.length > 0 && !activeChat && window.innerWidth > 768) {
                        // Select first chat on desktop if none selected
                        setActiveChat(data[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching chats:', error);
            } finally {
                setLoadingChats(false);
            }
        };

        if (user) fetchChats();
    }, [user, isLoading, initialChatId]);

    // Fetch Messages & Join Room when Active Chat Changes
    useEffect(() => {
        if (!activeChat || !user) return;

        const fetchMessages = async () => {
            setLoadingMessages(true);
            try {
                const res = await fetch(`http://localhost:5000/api/chats/${activeChat._id}/messages`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();

        if (socket) {
            socket.emit('join_chat', activeChat._id);
            // Mark messages as read when joining/switching to chat
            socket.emit('mark_as_read', { chatId: activeChat._id, userId: user._id });
        }

    }, [activeChat, user, socket]);

    // Listen for incoming messages
    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (message: Message) => {
            // Handle if chatId is populated object or string
            const msgChatId = typeof message.chatId === 'object' ? (message.chatId as any)._id : message.chatId;

            // Only append if it belongs to current chat
            if (activeChat && msgChatId === activeChat._id) {
                setMessages((prev) => {
                    // Simple duplicate check
                    if (prev.some(m => m._id === message._id)) return prev;
                    return [...prev, message];
                });
                scrollToBottom();

                // If chat is open, mark this new message as read immediately
                socket.emit('mark_as_read', { chatId: activeChat._id, userId: user._id });
            }
            // Update last message in sidebar list
            setChats(prev => prev.map(c => {
                const cId = typeof message.chatId === 'object' ? (message.chatId as any)._id : message.chatId;
                if (c._id === cId) {
                    return { ...c, lastMessage: message.content, lastMessageAt: new Date().toISOString() };
                }
                return c;
            }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()));
        };

        const handleMessagesRead = ({ chatId, readerId }: { chatId: string, readerId: string }) => {
            if (activeChat && chatId === activeChat._id) {
                setMessages(prev => prev.map(msg => {
                    // If message was sent by ME, and reader is NOT ME, add reader to readBy
                    // Or generically: add readerId to readBy if not present
                    if (!msg.readBy?.includes(readerId)) {
                        return { ...msg, readBy: [...(msg.readBy || []), readerId] };
                    }
                    return msg;
                }));
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('messages_read', handleMessagesRead);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('messages_read', handleMessagesRead);
        };
    }, [socket, activeChat, user]);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || !user) return;

        const content = newMessage;
        setNewMessage(''); // Clear input early

        try {
            // 1. Save to DB
            const res = await fetch('http://localhost:5000/api/chats/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    chatId: activeChat._id,
                    content
                })
            });

            if (res.ok) {
                const savedMessage = await res.json();

                // 2. Emit to Socket
                if (socket) {
                    const receiverId = getOtherParticipant(activeChat)?._id;
                    socket.emit('send_message', { message: savedMessage, receiverId });
                }

                // Optimistically update UI if duplicate check handles it, 
                // BUT socket echo (broadcast to room) will handle it.
            }
        } catch (error) {
            console.error('Failed to send message', error);
            alert('Failed to send message');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !activeChat || !user) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // 1. Upload Image
            const uploadRes = await fetch('http://localhost:5000/api/chats/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${user.token}` },
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Upload failed');
            const { url } = await uploadRes.json();

            // 2. Send Message with Image
            const res = await fetch('http://localhost:5000/api/chats/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    chatId: activeChat._id,
                    content: 'Sent an image',
                    messageType: 'image',
                    mediaUrl: url
                })
            });

            if (res.ok) {
                const savedMessage = await res.json();
                if (socket) {
                    const receiverId = getOtherParticipant(activeChat)?._id;
                    socket.emit('send_message', { message: savedMessage, receiverId });
                }
            }
        } catch (error) {
            console.error('File upload failed', error);
            alert('Failed to send image');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleBlockUser = async () => {
        if (!activeChat || !user) return;
        const otherUserId = getOtherParticipant(activeChat)?._id;

        if (!confirm('Are you sure you want to block this user?')) return;

        try {
            const res = await fetch('http://localhost:5000/api/users/block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ userIdToBlock: otherUserId })
            });

            if (res.ok) {
                alert('User blocked successfully');
                setActiveChat(null); // Close chat
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to block user');
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsMenuOpen(false);
        }
    };

    const handleReportUser = async () => {
        if (!activeChat || !user) return;
        const otherUserId = getOtherParticipant(activeChat)?._id;

        const reason = prompt('Please provide a reason for reporting this user:');
        if (!reason) return;

        try {
            const res = await fetch('http://localhost:5000/api/users/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    reportedId: otherUserId,
                    reason
                })
            });

            if (res.ok) {
                alert('User reported successfully. We will review this report.');
            } else {
                const data = await res.json();
                throw new Error(data.message || 'Failed to report user');
            }
        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsMenuOpen(false);
        }
    };

    const getOtherParticipant = (chat: Chat) => {
        return chat.participants.find(p => p._id !== user?._id) || chat.participants[0];
    };

    if (isLoading) return null;

    return (
        <div className="min-h-screen bg-white flex flex-col overflow-hidden">
            <Navbar />

            <div className="flex-1 w-full pt-28 h-screen">
                <div className="flex h-full border-t border-gray-200 bg-white">

                    {/* Sidebar / Chat List */}
                    <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-100 bg-gray-50/50`}>
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                        </div>
                        <div className="p-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input type="text" placeholder="Search chats..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            {loadingChats ? (
                                <div className="flex justify-center p-4"><div className="animate-spin h-6 w-6 border-2 border-indigo-600 rounded-full border-t-transparent"></div></div>
                            ) : chats.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No conversations yet. Start chatting from a product page!
                                </div>
                            ) : (
                                chats.map(chat => {
                                    const otherUser = getOtherParticipant(chat);
                                    return (
                                        <div
                                            key={chat._id}
                                            onClick={() => setActiveChat(chat)}
                                            className={`p-4 flex gap-3 hover:bg-white cursor-pointer transition-all border-b border-gray-100 ${activeChat?._id === chat._id ? 'bg-white border-l-4 border-l-indigo-600 shadow-sm' : 'border-l-4 border-l-transparent'}`}
                                        >
                                            <div className="relative h-12 w-12 flex-shrink-0">
                                                <img
                                                    src={otherUser?.avatar || `https://ui-avatars.com/api/?name=${otherUser?.name}&background=random`}
                                                    alt={otherUser?.name}
                                                    className="h-full w-full rounded-full object-cover shadow-sm bg-gray-200"
                                                />
                                                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-semibold text-gray-900 truncate">{otherUser?.name}</h3>
                                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                                        {new Date(chat.lastMessageAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                                {chat.listingId && (
                                                    <div className="mt-1 flex items-center gap-1 text-xs text-gray-500 bg-gray-100 w-fit px-2 py-0.5 rounded-full border border-gray-200">
                                                        <span>Product: {chat.listingId.title}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Window */}
                    {activeChat ? (
                        <div className="flex-1 flex flex-col bg-gray-50 relative">
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm z-10">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setActiveChat(null)} className="md:hidden p-1 text-gray-600">
                                        <ArrowLeft className="h-6 w-6" />
                                    </button>
                                    <div className="relative h-10 w-10">
                                        <img
                                            src={getOtherParticipant(activeChat)?.avatar || `https://ui-avatars.com/api/?name=${getOtherParticipant(activeChat)?.name}&background=random`}
                                            alt=""
                                            className="h-full w-full rounded-full object-cover shadow-sm bg-gray-200"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{getOtherParticipant(activeChat)?.name}</h3>
                                        <div className="flex items-center text-xs text-green-600">
                                            <span className="h-1.5 w-1.5 bg-green-500 rounded-full mr-1"></span>
                                            Online
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 text-gray-400">
                                    <div className="flex gap-2 text-gray-400 relative">
                                        <button
                                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <MoreVertical className="h-5 w-5" />
                                        </button>

                                        {isMenuOpen && (
                                            <div className="absolute right-0 top-10 bg-white shadow-xl rounded-lg border border-gray-100 py-2 w-48 z-50">
                                                <button
                                                    onClick={handleReportUser}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    Report User
                                                </button>
                                                <button
                                                    onClick={handleBlockUser}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    Block User
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Product Context Banner */}
                            {activeChat.listingId && (
                                <div className="p-3 bg-indigo-50/50 border-b border-indigo-100 flex items-center gap-3">
                                    <img src={activeChat.listingId.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover border border-indigo-100 bg-indigo-200" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm text-gray-900">{activeChat.listingId.title}</h4>
                                        <p className="text-sm text-indigo-700 font-bold">${activeChat.listingId.price}</p>
                                    </div>
                                    <button className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-50 transition-colors shadow-sm">
                                        View Item
                                    </button>
                                </div>
                            )}

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#f0f2f5]">
                                {loadingMessages ? (
                                    <div className="flex justify-center p-8"><div className="animate-spin h-6 w-6 border-2 border-indigo-600 rounded-full border-t-transparent"></div></div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                                        <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                            <Send className="h-8 w-8 text-indigo-500" />
                                        </div>
                                        <p className="text-gray-500 font-medium">No messages yet.</p>
                                        <p className="text-sm text-gray-400">Say hello to start the conversation!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = typeof msg.senderId === 'object' ? msg.senderId._id === user?._id : msg.senderId === user?._id;
                                        return (
                                            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                                <div className={`max-w-[75%] px-5 py-3 shadow-sm relative ${isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none'}`}>
                                                    {msg.messageType === 'image' && msg.mediaUrl ? (
                                                        <div className="mb-2">
                                                            <img
                                                                src={msg.mediaUrl}
                                                                alt="Shared image"
                                                                className="rounded-lg max-w-full max-h-[300px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                                onClick={() => window.open(msg.mediaUrl, '_blank')}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    )}
                                                    <span className={`text-[10px] absolute -bottom-5 ${isMe ? 'right-0 text-gray-400 flex items-center gap-1' : 'left-0 text-gray-400'}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        {isMe && (
                                                            <span>
                                                                {msg.readBy && msg.readBy.length > 0 ? (
                                                                    <CheckCheck className="h-3 w-3 text-blue-500" />
                                                                ) : (
                                                                    <CheckCheck className="h-3 w-3 text-gray-300" />
                                                                )}
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} className="h-4" />
                            </div>

                            {/* Input Area */}
                            <div className="p-4 bg-white border-t border-gray-200">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                                        disabled={isUploading}
                                    >
                                        <ImageIcon className="h-5 w-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-gray-50 text-center p-8">
                            <div className="h-32 w-32 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                                <img src="/icon.svg" alt="Resaleo" className="h-16 w-16 opacity-50" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Resaleo Chat</h2>
                            <p className="text-gray-500 max-w-sm">Select a conversation from the left to start chatting with buyers and sellers.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
