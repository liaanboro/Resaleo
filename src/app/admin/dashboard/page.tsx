
'use client';

import React, { useEffect, useState } from 'react';
import { getStats } from '@/services/adminService';
import { Users, ShoppingBag, MessageSquare, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading Stats...</div>;

    const cards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Total Listings', value: stats?.totalListings || 0, icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-100' },
        { label: 'Active Chats', value: stats?.activeChats || 0, icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Pending Reports', value: stats?.reportedItems || 0, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
                        <div className={`p-4 rounded-full ${card.bg} mr-4`}>
                            <card.icon className={`h-8 w-8 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{card.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-blue-700">
                        <strong>Welcome Admin!</strong> Use the sidebar to manage users, listings, and moderate chats.
                    </p>
                </div>
            </div>
        </div>
    );
}
