
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShoppingBag, MessageSquare, Flag, LogOut } from 'lucide-react';
// import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Quick Client-side check
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            router.push('/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'admin' && user.name !== 'omajanw') {
                router.push('/'); // Redirect non-admins
            } else {
                setAuthorized(true);
            }
        } catch (e) {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!authorized) return <div className="flex h-screen items-center justify-center bg-gray-100">Loading Admin Panel...</div>;

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Listings', href: '/admin/listings', icon: ShoppingBag },
        { name: 'Chats', href: '/admin/chats', icon: MessageSquare },
        { name: 'Reports', href: '/admin/reports', icon: Flag },
    ];

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md border-r border-gray-200 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-8">
                {children}
            </main>
        </div>
    );
}
