'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit, LogOut, X, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    const [myListings, setMyListings] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchMyListings();
        }
    }, [user, isLoading, router]);

    const fetchMyListings = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/listings?sellerId=${user!._id}`);
            const data = await res.json();
            setMyListings(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user!.token}`
                }
            });

            if (res.ok) {
                setMyListings(myListings.filter(item => item._id !== id));
            } else {
                alert('Failed to delete item');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting item');
        }
    };

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="flex items-end">
                                <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-md">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12 text-gray-400" />
                                    )}
                                </div>
                                <div className="ml-6 mb-2">
                                    <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                    <p className="text-gray-500 text-sm">Member since {new Date().getFullYear()}</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                                <Edit className="h-4 w-4" />
                                Edit Profile
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="h-5 w-5 mr-3 text-gray-400" />
                                        <span>+91 98765 43210</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>Mumbai, Maharashtra</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex gap-4">
                    <button
                        onClick={() => router.push('/chat')}
                        className="flex-1 bg-indigo-50 text-indigo-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors"
                    >
                        <MessageCircle className="h-5 w-5" />
                        My Messages
                    </button>
                    <button className="flex-1 bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                        Edit Profile
                    </button>
                </div>

                {/* My Listings */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">My Listings</h2>
                        <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-medium">
                            {myListings.length} Active
                        </span>
                    </div>

                    {myListings.length === 0 ? (
                        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                <Calendar className="h-full w-full" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No listings yet</h3>
                            <p className="mt-2 text-gray-500">Start selling your items today!</p>
                            <button onClick={() => router.push('/sell')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                Post an Item
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myListings.map((item) => (
                                <div key={item._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="relative aspect-video bg-gray-100">
                                        <img src={item.images[0] || '/placeholder.png'} alt={item.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                onClick={() => router.push(`/edit/${item._id}`)}
                                                className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-white transition-colors"
                                                title="Edit Listing"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-red-600 hover:bg-white transition-colors"
                                                title="Delete Listing"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-bold">
                                            ${item.price.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mb-3 truncate">{item.category}</p>
                                        <div className="flex items-center text-xs text-gray-400">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <div className="flex justify-end">
                    <button
                        onClick={logout}
                        className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}
