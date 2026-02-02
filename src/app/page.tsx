'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, MapPin, Tag, ShieldCheck, Zap, Search } from 'lucide-react';


export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero Section - Dynamic Slider */}
      <HeroSlider />

      {/* Featured Categories - Circular Style */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900">The future in your hands</h2>
            <p className="text-gray-500 mt-2 text-lg">Detailed categories for your specific needs</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
            {[
              { name: 'Laptops', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&q=80' },
              { name: 'Smartphones', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80' },
              { name: 'Cameras', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80' },
              { name: 'Fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&q=80' },
              { name: 'Sneakers', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=300&q=80' },
              { name: 'Watches', img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&q=80' },
              { name: 'Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
              { name: 'Furniture', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&q=80' },
              { name: 'Gaming', img: 'https://images.unsplash.com/photo-1598550476439-cce8e6f06600?w=300&q=80' },
              { name: 'Drones', img: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=300&q=80' },
              { name: 'Collectibles', img: 'https://images.unsplash.com/photo-1622359253406-6997ff2d9178?w=300&q=80' },
              { name: 'Sports', img: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=80' }
            ].map((cat) => (
              <Link key={cat.name} href={`/search?q=${cat.name}`} className="group flex flex-col items-center cursor-pointer">
                <div className="h-40 w-40 md:h-48 md:w-48 rounded-full overflow-hidden shadow-lg border-4 border-transparent group-hover:border-primary transition-all duration-300 relative bg-gray-100">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h3 className="mt-4 font-bold text-gray-900 group-hover:text-primary transition-colors text-lg text-center">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-gray-50 border-t">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Resaleo?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">We prioritize your safety and experience. Here is why millions of people trust us for their daily buying and selling.</p>
        </div>
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          {[
            { icon: MapPin, title: "Hyper-Local", desc: "Our intelligent geo-location system connects you with neighbors, making transactions fast and easy without shipping hassles." },
            { icon: ShieldCheck, title: "Identity Verified", desc: "We use advanced verification including phone and optional ID checks to ensure you are dealing with real people." },
            { icon: Zap, title: "Fast & Simple", desc: "Post an ad in under 30 seconds. Chat securely within the app. No complicated forms or hidden fees for basic users." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-secondary/50 transition-colors">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="bg-primary rounded-[2.5rem] p-12 text-center text-primary-foreground relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to clear your clutter?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8">Join the community today and turn your unused items into cash. It's free to get started!</p>
            <Link href="/sell" className="inline-flex h-14 items-center justify-center rounded-full bg-background text-primary px-10 text-lg font-bold shadow-lg transition-transform hover:scale-105">
              Start Selling Now
            </Link>
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
      </section>

    </div>
  );
}

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2000&auto=format&fit=crop',
      title: 'BUY & SELL',
      subtitle: 'USED GOODS',
      tag: 'Laptops • Mobiles • Furniture',
      accent: 'text-yellow-300',
      overlay: 'from-pink-900/80 via-pink-900/40 to-pink-900/80'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop',
      title: 'REFRESH YOUR',
      subtitle: 'WARDROBE',
      tag: 'Fashion • Accessories • Style',
      accent: 'text-pink-300',
      overlay: 'from-purple-900/70 via-purple-900/30 to-purple-900/70'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2000&auto=format&fit=crop',
      title: 'UPGRADE YOUR',
      subtitle: 'LIVING SPACE',
      tag: 'Sofas • Tables • Decor',
      accent: 'text-teal-300',
      overlay: 'from-blue-900/70 via-blue-900/30 to-blue-900/70'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative pt-32 md:pt-40 pb-12 overflow-hidden bg-gradient-to-r from-[#FFF0F5] via-[#FFE4E1] to-[#FFF0F5]">
      <div className="container mx-auto px-4">
        <div className="relative rounded-[2rem] overflow-hidden min-h-[450px] shadow-2xl group">

          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear scale-100"
                style={{
                  backgroundImage: `url("${slide.image}")`,
                  transform: index === currentSlide ? 'scale(1.1)' : 'scale(1.0)'
                }}
              ></div>

              {/* Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay} mix-blend-multiply transition-all duration-1000`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-between px-6 md:px-16">
                {/* Left Content */}
                <div className={`relative z-20 text-white drop-shadow-lg max-w-lg transition-all duration-1000 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <div className="text-xl font-bold uppercase tracking-widest mb-2 bg-pink-600 inline-block px-3 py-1 rounded shadow-lg">{slide.tag}</div>
                  <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4" style={{ fontFamily: 'Arial, sans-serif' }}>
                    {slide.title} <br />
                    <span className={slide.accent}>{slide.subtitle}</span>
                  </h1>
                  <Link href="/search" className="inline-flex items-center gap-2 bg-white text-gray-900 text-lg font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                    Explore Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Controls */}
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
            <ArrowRight className="w-6 h-6 rotate-180" />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-all opacity-0 group-hover:opacity-100">
            <ArrowRight className="w-6 h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
