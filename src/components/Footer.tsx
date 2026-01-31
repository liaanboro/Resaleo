import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white text-gray-600 py-16 font-sans border-t border-gray-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & About */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                            Resaleo<span className="text-pink-500">.</span>
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The world's fastest growing marketplace for second-hand goods. Buy, sell, and discover amazing deals in your local community.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="#" className="bg-gray-100 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all text-gray-700">
                                <Facebook size={18} />
                            </Link>
                            <Link href="#" className="bg-gray-100 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all text-gray-700">
                                <Twitter size={18} />
                            </Link>
                            <Link href="#" className="bg-gray-100 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all text-gray-700">
                                <Instagram size={18} />
                            </Link>
                            <Link href="#" className="bg-gray-100 p-2 rounded-full hover:bg-pink-600 hover:text-white transition-all text-gray-700">
                                <Linkedin size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 text-lg">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-pink-600 transition-colors">Home</Link></li>
                            <li><Link href="/search" className="hover:text-pink-600 transition-colors">Browse Ads</Link></li>
                            <li><Link href="/sell" className="hover:text-pink-600 transition-colors">Sell an Item</Link></li>
                            <li><Link href="/about" className="hover:text-pink-600 transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-pink-600 transition-colors">Contact Support</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 text-lg">Trending Categories</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/search?c=mobiles" className="hover:text-pink-600 transition-colors">Mobiles & Tablets</Link></li>
                            <li><Link href="/search?c=laptops" className="hover:text-pink-600 transition-colors">Laptops & Computers</Link></li>
                            <li><Link href="/search?c=furniture" className="hover:text-pink-600 transition-colors">Furniture & Decor</Link></li>
                            <li><Link href="/search?c=bikes" className="hover:text-pink-600 transition-colors">Bikes & Scooters</Link></li>
                            <li><Link href="/search?c=fashion" className="hover:text-pink-600 transition-colors">Fashion & Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 text-lg">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-pink-500 mt-0.5 shrink-0" />
                                <span className="text-gray-600">123 Market Street, Tech Hub District, Innovation City, 560001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-pink-500 shrink-0" />
                                <span className="text-gray-600">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-pink-500 shrink-0" />
                                <span className="text-gray-600">support@resaleo.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Resaleo Marketplace. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-pink-600 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-pink-600 transition-colors">Terms of Service</Link>
                        <Link href="/sitemap" className="hover:text-pink-600 transition-colors">Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
