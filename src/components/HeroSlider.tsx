'use client';

import { useState, useEffect } from 'react';

const slides = [
    {
        id: 1,
        // Gen-Z Fashion / Streetwear / Urban - "Cop the Latest Drops"
        image: "https://images.unsplash.com/photo-1523396879056-324338316dfa?w=1600&q=80",
        label: "Cop the Latest Drops",
    },
    {
        id: 2,
        // Retro Tech / Y2K Aesthetic / Gaming - "Retro Tech & Gaming"
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80",
        label: "Retro Tech & Gaming",
    },
    {
        id: 3,
        // Vibrant / Neon / Night Life / Community - "Vibe with Locals"
        image: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=1600&q=80",
        label: "Vibe with Locals",
    },
    {
        id: 4,
        // Sneakers / Hypebeast - "Grail Sneakers"
        image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1600&q=80",
        label: "Grail Sneakers",
    }
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.label}
                        className="h-full w-full object-cover scale-105"
                    />
                    {/* Neutral Dark Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                </div>
            ))}
        </div>
    );
}
