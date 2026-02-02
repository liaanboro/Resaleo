'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import { Search } from 'lucide-react';

interface Listing {
    _id: string;
    title: string;
    price: number;
    description: string;
    images: string[];
    category: string;
    condition: string;
    location: {
        address: string;
        city?: string;
    };
    createdAt: string;
    sellerId: {
        name: string;
        avatar?: string;
    };
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('search') || '';

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                // Fetch listings with the search query
                const res = await fetch(`http://localhost:5000/api/listings?search=${encodeURIComponent(query)}`);
                if (!res.ok) throw new Error('Failed to fetch results');
                const data = await res.json();
                setListings(data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchListings();
        } else {
            setListings([]);
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar />
            <div className="container mx-auto px-4 pt-24">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                        <Search className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {query ? `Results for "${query}"` : 'Search Listings'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {listings.length} items found
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div key={n} className="bg-white rounded-lg aspect-[3/4] animate-pulse">
                                <div className="h-[200px] bg-gray-200 rounded-t-lg"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : listings.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {listings.map((listing) => (
                            <ListingCard key={listing._id} listing={listing} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No results found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            We couldn't find any items matching "{query}". Try checking your spelling or using different keywords.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
