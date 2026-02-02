'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    unreadCount: number;
    resetUnreadCount: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        let newSocket: Socket | null = null;

        if (user) {
            newSocket = io('http://localhost:5000');
            setSocket(newSocket);

            newSocket.on('connect', () => {
                // Join user-specific room for notifications
                newSocket?.emit('join_user', user._id);
            });

            newSocket.on('receive_notification', (data: any) => {
                if (data.type === 'message') {
                    // Increment unread count
                    // Only if we are NOT currently on the chat page checking that specific chat?
                    // For simplicity, just increment. The Chat page can reset it.
                    setUnreadCount(prev => prev + 1);

                    // Optional: Play sound or show toast
                    // const audio = new Audio('/notification.mp3');
                    // audio.play().catch(e => console.log(e));
                }
            });
        }

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, [user]);

    const resetUnreadCount = () => {
        setUnreadCount(0);
    };

    return (
        <SocketContext.Provider value={{ socket, unreadCount, resetUnreadCount }}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}
