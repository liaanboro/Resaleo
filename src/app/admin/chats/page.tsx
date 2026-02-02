
'use client';

import React, { useEffect, useState } from 'react';
import { getChats, getMessages, deleteChat, deleteMessage } from '@/services/adminService';
import { Search, Trash2, MessageCircle, X } from 'lucide-react';

export default function AdminChats() {
    const [chats, setChats] = useState<any[]>([]);
    const [selectedChat, setSelectedChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadChats();
    }, []);

    const loadChats = async () => {
        try {
            const data = await getChats();
            setChats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectChat = async (chat: any) => {
        setSelectedChat(chat);
        setLoadingMsgs(true);
        try {
            const msgs = await getMessages(chat._id);
            setMessages(msgs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMsgs(false);
        }
    };

    const handleDeleteChat = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Delete this entire conversation?')) return;
        try {
            await deleteChat(id);
            setChats(chats.filter(c => c._id !== id));
            if (selectedChat?._id === id) {
                setSelectedChat(null);
                setMessages([]);
            }
        } catch (error) {
            alert('Failed to delete chat');
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            await deleteMessage(id);
            setMessages(messages.filter(m => m._id !== id));
        } catch (error) {
            alert('Failed to delete message');
        }
    };

    const filteredChats = chats.filter(c => {
        const pNames = c.participants?.map((p: any) => p?.name).join(' ').toLowerCase() || '';
        const title = c.listingId?.title.toLowerCase() || '';
        const query = search.toLowerCase();
        return pNames.includes(query) || title.includes(query);
    });

    if (loading) return <div className="text-center py-10">Loading Chats...</div>;

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Chat List */}
            <div className={`w-full md:w-1/3 border-r border-gray-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search user or item..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.map(chat => (
                        <div
                            key={chat._id}
                            onClick={() => handleSelectChat(chat)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat?._id === chat._id ? 'bg-indigo-50 border-indigo-100' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm truncate max-w-[150px]">
                                    {chat.listingId?.title || 'Unknown Item'}
                                </h4>
                                <span className="text-xs text-gray-400">
                                    {new Date(chat.lastMessageAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mb-2">
                                <span className="truncate">
                                    {chat.participants?.map((p: any) => p?.name || 'User').join(' & ')}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-400 truncate max-w-[180px]">
                                    {chat.lastMessage || 'No messages'}
                                </p>
                                <button
                                    onClick={(e) => handleDeleteChat(e, chat._id)}
                                    className="text-red-400 hover:text-red-600 p-1"
                                    title="Delete Chat"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat View */}
            <div className={`w-full md:w-2/3 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="font-bold text-gray-800">{selectedChat.listingId?.title}</h3>
                                <p className="text-xs text-gray-500">
                                    {selectedChat.participants?.map((p: any) => p?.name).join(' & ')}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedChat(null)}
                                className="md:hidden p-2 text-gray-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {loadingMsgs ? (
                                <div className="text-center text-gray-400 py-10">Loading messages...</div>
                            ) : messages.length > 0 ? (
                                messages.map(msg => (
                                    <div key={msg._id} className={`group flex flex-col ${msg.senderId._id === selectedChat.participants[0]?._id ? 'items-start' : 'items-end'}`}>
                                        <div className="flex items-end gap-2 max-w-[80%]">
                                            <div className={`p-3 rounded-2xl text-sm ${msg.senderId._id === selectedChat.participants[0]?._id ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                                                {msg.messageType === 'image' ? (
                                                    <img src={msg.mediaUrl} alt="sent image" className="max-w-full rounded" />
                                                ) : (
                                                    <p>{msg.content}</p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteMessage(msg._id)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-600 p-1"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1 px-2">
                                            {msg.senderId?.name} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-10">No messages found.</div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <MessageCircle className="h-12 w-12 mb-4 opacity-20" />
                        <p>Select a chat to view conversations</p>
                    </div>
                )}
            </div>
        </div>
    );
}
