
'use client';

import React, { useEffect, useState } from 'react';
import { getListings, deleteListing, updateListingStatus } from '@/services/adminService';
import { Search, Trash2, Check, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function AdminListings() {
    const [listings, setListings] = useState<any[]>([]);
    const [filteredListings, setFilteredListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        loadListings();
    }, []);

    useEffect(() => {
        let result = listings;
        if (filterStatus !== 'All') {
            result = result.filter(l => l.status === filterStatus);
        }
        if (search) {
            result = result.filter(l =>
                l.title.toLowerCase().includes(search.toLowerCase()) ||
                l.category.toLowerCase().includes(search.toLowerCase())
            );
        }
        setFilteredListings(result);
    }, [search, filterStatus, listings]);

    const loadListings = async () => {
        try {
            const data = await getListings();
            setListings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this listing?')) return;
        try {
            await deleteListing(id);
            setListings(listings.filter(l => l._id !== id));
        } catch (error) {
            alert('Failed to delete listing');
        }
    };

    const handleStatusChange = async (id: string, status: string) => {
        try {
            const updated = await updateListingStatus(id, status);
            setListings(listings.map(l => l._id === id ? updated : l));
        } catch (error) {
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="text-center py-10">Loading Listings...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Listing Moderation</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="Active">Active</option>
                        <option value="Sold">Sold</option>
                        <option value="Banned">Banned</option>
                    </select>
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search listings..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Item</th>
                            <th className="px-6 py-4">Seller</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredListings.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        {item.images && item.images[0] ? (
                                            <img src={item.images[0]} alt="" className="h-10 w-10 rounded object-cover mr-3 bg-gray-100" />
                                        ) : (
                                            <div className="h-10 w-10 rounded bg-gray-100 mr-3"></div>
                                        )}
                                        <div>
                                            <div className="font-semibold text-gray-900 truncate max-w-[200px]">{item.title}</div>
                                            <div className="text-gray-500 text-xs">{item.category}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {item.sellerId?.email || 'Unknown'}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">
                                    Rs {item.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Active' ? 'bg-green-100 text-green-700' :
                                            item.status === 'Banned' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/item/${item._id}`} target="_blank" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg">
                                            <ExternalLink className="h-4 w-4" />
                                        </Link>
                                        {item.status !== 'Active' && (
                                            <button
                                                onClick={() => handleStatusChange(item._id, 'Active')}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                                title="Activate"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                        {item.status !== 'Banned' && (
                                            <button
                                                onClick={() => handleStatusChange(item._id, 'Banned')}
                                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg"
                                                title="Ban/Reject"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
