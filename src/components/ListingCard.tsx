'use client';

import Link from 'next/link';
import { MapPin, Heart } from 'lucide-react';

interface ListingProps {
    listing: {
        _id: string;
        title: string;
        price: number;
        currency?: string;
        location: {
            address: string;
            city?: string;
        };
        images: string[];
        createdAt: string;
    }
}

export default function ListingCard({ listing }: ListingProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Link href={`/item/${listing._id}`} className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                    src={listing.images[0] || '/placeholder-image.png'}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                </button>
                {/* Featured Badge (Optional) */}
            </div>

            <div className="p-3">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 text-lg truncate pr-2" title={listing.title}>
                        {formatPrice(listing.price)}
                    </h3>
                </div>

                <p className="text-gray-700 text-sm truncate mb-2">{listing.title}</p>

                <div className="flex justify-between items-end text-xs text-gray-500 mt-2">
                    <div className="flex items-center gap-1 truncate max-w-[70%]">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{listing.location.address}</span>
                    </div>
                    <span className="shrink-0">{formatDate(listing.createdAt)}</span>
                </div>
            </div>
        </Link>
    );
}
