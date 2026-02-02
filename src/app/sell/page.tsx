'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function SellPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [images, setImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setImages([...images, ...files]);

            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviewUrls([...previewUrls, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);

        const newPreviews = [...previewUrls];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewUrls(newPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to sell an item");
            router.push('/login');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);

            // Backend expects location as a stringified JSON or object with coordinates
            // For simplicity, we'll construct a basic object with the address text
            // In a real app, you'd use a geocoding API to get coords
            const locationData = JSON.stringify({
                address: location,
                coordinates: [0, 0] // Default dummy coords
            });
            formData.append('location', locationData);
            formData.append('condition', 'Used'); // Default condition

            images.forEach((image) => {
                formData.append('images', image);
            });

            const res = await fetch('http://localhost:5000/api/listings', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create listing');
            }

            // Success
            router.push('/');
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 max-w-3xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">Sell your Item</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                                        <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-500">Add Photo</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. iPhone 14 Pro Max 256GB"
                                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                            >
                                <option value="">Select a category</option>
                                <option value="Vehicles">Vehicles</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Fashion">Fashion</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <input
                                    type="number"
                                    required
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full rounded-lg border border-gray-300 p-3 pl-8 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                placeholder="Describe what you are selling..."
                                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                            ></textarea>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Enter city or zip code"
                                    className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Posting...' : 'Post Now'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
