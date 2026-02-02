'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MobileSellButton() {
    const pathname = usePathname();

    // Don't show on the actual sell page to avoid redundancy? Or keep it for consistency.
    // Usually keep it, or hide if it obstructs forms. Let's keep it for now.

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden animate-in slide-in-from-bottom-10 fade-in duration-700">
            <Link href="/sell" className="group relative flex items-center justify-center">
                {/* Gradient Border Container */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-teal-400 to-blue-500 blur-[2px] opacity-80 group-hover:opacity-100 transition-opacity"></div>

                {/* Button Content */}
                <div className="relative bg-white text-gray-900 font-extrabold text-lg px-8 py-3 rounded-full flex items-center gap-2 shadow-2xl m-[3px] hover:bg-gray-50 transition-colors">
                    <Plus className="w-6 h-6 stroke-[4]" />
                    <span>SELL</span>
                </div>
            </Link>
        </div>
    );
}
