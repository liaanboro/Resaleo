'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function EditListingPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const { id } = useParams();

    // States
    const [existingImages, setExistingImages] = useState<string[]>([]); // URLs of images already on server
    const [newImages, setNewImages] = useState<File[]>([]); // New files to upload
    const [newPreviews, setNewPreviews] = useState<string[]>([]); // Previews for new files
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form States
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
            return;
        }

        if (id) {
            fetchListing();
        }
    }, [id, user, isLoading]);

    const fetchListing = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/listings/${id}`);
            if (!res.ok) throw new Error('Failed to fetch listing');
            const data = await res.json();

            // Populate form
            setTitle(data.title);
            setCategory(data.category);
            setPrice(data.price);
            setDescription(data.description);
            // Handle location object
            setLocation(data.location?.address || '');
            setExistingImages(data.images || []);
        } catch (error) {
            console.error(error);
            alert('Error loading listing');
            router.push('/profile');
        } finally {
            setFetching(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setNewImages([...newImages, ...files]);

            const previews = files.map(file => URL.createObjectURL(file));
            setNewPreviews([...newPreviews, ...previews]);
        }
    };

    const removeExistingImage = (index: number) => {
        const updated = [...existingImages];
        updated.splice(index, 1);
        setExistingImages(updated);
    };

    const removeNewImage = (index: number) => {
        const updatedImages = [...newImages];
        updatedImages.splice(index, 1);
        setNewImages(updatedImages);

        const updatedPreviews = [...newPreviews];
        URL.revokeObjectURL(updatedPreviews[index]);
        updatedPreviews.splice(index, 1);
        setNewPreviews(updatedPreviews);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);

            const locationData = JSON.stringify({
                address: location,
                coordinates: [0, 0]
            });
            formData.append('location', locationData);

            // Send updated list of existing images to keep
            // Pass as JSON string or individual fields? Controller checked for req.body.imagesToKeep
            // FormData appends as string by default, let's stringify properly
            formData.append('imagesToKeep', JSON.stringify(existingImages));

            // Append new images
            newImages.forEach((image) => {
                formData.append('images', image);
            });

            const res = await fetch(`http://localhost:5000/api/listings/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                },
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update listing');
            }

            router.push('/profile');
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 max-w-3xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Listing</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Exisiting Images */}
                                {existingImages.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-indigo-200">
                                        <img src={url} alt="Existing" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-600/80 text-white rounded-full p-1 hover:bg-red-700 transition-colors">
                                            <X className="h-4 w-4" />
                                        </button>
                                        <span className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1 rounded">Saved</span>
                                    </div>
                                ))}

                                {/* New Previews */}
                                {newPreviews.map((url, index) => (
                                    <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-green-200">
                                        <img src={url} alt="New Preview" className="w-full h-full object-cover" />
                                        <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                                            <X className="h-4 w-4" />
                                        </button>
                                        <span className="absolute bottom-1 left-1 bg-green-600/80 text-white text-[10px] px-1 rounded">New</span>
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
                                    className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-1/3 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-2/3 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
