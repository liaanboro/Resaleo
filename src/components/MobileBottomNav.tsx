'use client';

import Link from 'next/link';
import { Home, MessageCircle, PlusCircle, User, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useSocket } from '@/context/SocketContext';
import { cn } from '@/lib/utils';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { unreadCount } = useSocket();

    // Hide on chat detail page to allow full screen chat? 
    // Or keep it. Let's keep it for easy navigation unless strictly requested otherwise.

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:hidden z-50 px-6 py-2 pb-safe">
            <div className="flex items-center justify-between">
                <Link href="/" className={cn("flex flex-col items-center gap-1 p-2", pathname === '/' ? "text-indigo-600" : "text-gray-500")}>
                    <Home className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Home</span>
                </Link>

                <Link href="/search" className={cn("flex flex-col items-center gap-1 p-2", pathname === '/search' ? "text-indigo-600" : "text-gray-500")}>
                    <Search className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Browse</span>
                </Link>

                <Link href="/sell" className="group -mt-8">
                    <div className="bg-indigo-600 text-white p-4 rounded-full shadow-lg border-4 border-gray-50 group-active:scale-95 transition-transform">
                        <PlusCircle className="h-7 w-7" />
                    </div>
                </Link>

                <Link href="/chat" className={cn("flex flex-col items-center gap-1 p-2 relative", pathname.startsWith('/chat') ? "text-indigo-600" : "text-gray-500")}>
                    <div className="relative">
                        <MessageCircle className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">Chat</span>
                </Link>

                <Link href="/profile" className={cn("flex flex-col items-center gap-1 p-2", pathname === '/profile' ? "text-indigo-600" : "text-gray-500")}>
                    <User className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
}
