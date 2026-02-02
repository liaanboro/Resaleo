'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { MapPin, Heart, MessageCircle, Share2, ArrowLeft, Calendar } from 'lucide-react';

interface Seller {
    _id: string;
    name: string;
    avatar?: string;
    isVerified: boolean;
    createdAt: string;
}

interface Listing {
    _id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    condition: string;
    images: string[];
    location: {
        address: string;
        coordinates: number[];
    };
    sellerId: Seller;
    createdAt: string;
}

export default function ItemPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeImage, setActiveImage] = useState(0);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/listings/${id}`);
                if (!res.ok) throw new Error('Listing not found');
                const data = await res.json();
                setListing(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchListing();
        }
    }, [id]);

    const handleStartChat = async () => {
        if (!user) {
            alert('Please log in to chat with the seller');
            router.push('/login');
            return;
        }

        if (!listing) return;

        if (user._id === listing.sellerId._id) {
            alert("You cannot chat with yourself!");
            return;
        }

        setChatLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    listingId: listing._id,
                    receiverId: listing.sellerId._id
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to start chat');
            }

            const chat = await res.json();
            // Store chat context or just redirect
            router.push(`/chat?id=${chat._id}`);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <p className="text-xl text-gray-600 mb-4">{error || 'Item not found'}</p>
                <button onClick={() => router.back()} className="text-indigo-600 font-medium hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 max-w-6xl">
                <button onClick={() => router.back()} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to results
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden aspect-[4/3] relative">
                            {listing.images.length > 0 ? (
                                <img
                                    src={listing.images[activeImage]}
                                    alt={listing.title}
                                    className="w-full h-full object-contain bg-gray-100"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                        {listing.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {listing.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 ${activeImage === idx ? 'border-indigo-600' : 'border-transparent'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{listing.description}</p>
                        </div>
                    </div>

                    {/* Right Column - Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {listing.location.address}
                                        <span className="mx-2">•</span>
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {new Date(listing.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                        <Heart className="h-6 w-6" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                                        <Share2 className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-indigo-600">
                                ${listing.price.toLocaleString()}
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Seller Information</h3>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                        {listing.sellerId.avatar ? (
                                            <img src={listing.sellerId.avatar} alt={listing.sellerId.name} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            listing.sellerId.name?.[0].toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-900">{listing.sellerId.name || 'Unknown User'}</div>
                                        <div className="text-sm text-gray-500">Member since {new Date(listing.sellerId.createdAt || Date.now()).getFullYear()}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={handleStartChat}
                                        disabled={chatLoading}
                                        className="col-span-2 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
                                    >
                                        <MessageCircle className="h-5 w-5" />
                                        {chatLoading ? 'Starting Chat...' : 'Chat with Seller'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Safety Tips</h3>
                            <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                                <li>Meet in a safe, public place</li>
                                <li>Don't transfer money before meeting</li>
                                <li>Check the item properly before paying</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
