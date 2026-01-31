'use client';

import Link from 'next/link';
import { Search, Plus, User, Menu, X, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const isLoggedIn = false; // TODO: Connect to Auth Store

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed top-0 z-50 w-full bg-white border-b border-gray-200 transition-all duration-300 py-2",
            scrolled ? "shadow-sm" : ""
        )}>
            <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
                {/* Logo - Minimalist */}
                <Link href="/" className="flex items-center gap-1 group shrink-0">
                    <span className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent tracking-tighter hover:opacity-80 transition-opacity">
                        Resaleo
                    </span>
                    <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse mb-3"></div>
                </Link>

                {/* Navbar Search Bar */}
                <div className="hidden md:flex flex-1 max-w-4xl mx-8 relative">
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="w-full h-11 pl-12 pr-4 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-sm text-gray-700 placeholder:text-gray-400"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary text-white rounded-full px-4 text-xs font-bold hover:bg-primary/90 transition-colors">
                        Search
                    </button>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/search" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                        Browse
                    </Link>
                    <Link href="/how-it-works" className="text-sm font-semibold text-gray-600 hover:text-primary transition-colors">
                        How It Works
                    </Link>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                <Bell className="h-5 w-5" />
                            </button>
                            <Link href="/profile" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <User className="h-5 w-5 text-gray-700" />
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">
                            Log in
                        </Link>
                    )}

                    {/* Sell Action - Minimalist Text/Icon */}
                    <Link href="/sell" className="group flex items-center gap-2 text-primary font-bold uppercase tracking-wide hover:tracking-widest transition-all text-sm border-2 border-primary/20 hover:border-primary px-6 py-2 rounded-full">
                        <Plus className="h-4 w-4 stroke-[3]" />
                        <span>Sell</span>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-foreground"
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Search Bar - Mobile First */}
            <div className="md:hidden px-4 pb-3">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium text-sm text-gray-700 placeholder:text-gray-400"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 shadow-2xl animate-in slide-in-from-top-5 z-[60]">
                    <div className="space-y-4">
                        <Link href="/" className="block py-2 text-lg font-medium text-foreground border-b border-border" onClick={() => setIsMenuOpen(false)}>
                            Home
                        </Link>
                        <Link href="/search" className="block py-2 text-lg font-medium text-foreground border-b border-border" onClick={() => setIsMenuOpen(false)}>
                            Browse
                        </Link>
                        <Link href="/login" className="block w-full text-center py-3 font-semibold text-foreground bg-secondary rounded-xl" onClick={() => setIsMenuOpen(false)}>
                            Log In
                        </Link>
                        <Link href="/sell" className="block w-full text-center py-3 font-semibold bg-primary text-primary-foreground rounded-xl shadow-lg" onClick={() => setIsMenuOpen(false)}>
                            Sell Now
                        </Link>
                    </div>
                </div>
            )}
            {/* Horizontal Category Links */}
            <div className="border-t border-gray-100 bg-white hidden md:block">
                <div className="container mx-auto px-4 md:px-6">
                    <ul className="flex items-center gap-6 py-2 overflow-x-auto text-xs font-medium text-gray-600 scrollbar-hide">
                        {['Saved', 'Motors', 'Electronics', 'Collectibles', 'Home & Garden', 'Fashion', 'Toys', 'Sporting Goods', 'Business & Industrial', 'Jewelry & Watches', 'eBay Refurbished'].map((item) => (
                            <li key={item} className="shrink-0 hover:text-primary cursor-pointer transition-colors whitespace-nowrap">
                                <Link href={`/search?q=${item}`}>{item}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
