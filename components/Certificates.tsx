// src/components/Certificates.tsx
"use client"
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { certificatesData } from "@/data/portfolioData";
import { ChevronLeft, ChevronRight } from "lucide-react";

// টাইপস্ক্রিপ্টের জন্য ডাটা স্ট্রাকচার ইন্টারফেস
interface CertificateItem {
    id: string;
    title: string;
    issuer: string;
    image: string;
    badgeColor?: string;
}

export default function Certificates() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right

    // Variants টাইপ স্পষ্টভাবে বলে দেওয়ার কারণে প্রোডাকশন বিল্ডে আর Easing এরর আসবে না
    const slideVariants: Variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 150 : -150,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.4, ease: "easeInOut" }
        },
        exit: (direction: number) => ({
            x: direction < 0 ? 150 : -150,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.3, ease: "easeInOut" }
        })
    };

    const handleNext = () => {
        setDirection(1);
        setCurrentIndex((prevIndex) =>
            prevIndex === certificatesData.length - 1 ? 0 : prevIndex + 1
        );
    };

    const handlePrev = () => {
        setDirection(-1);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? certificatesData.length - 1 : prevIndex - 1
        );
    };

    // ডেটা অবজেক্টকে টাইপ কাস্টিং করা হলো সেফটির জন্য
    const currentCert = certificatesData[currentIndex] as CertificateItem;

    if (!currentCert) return null; // সেফটি গার্ড চেক

    return (
        <section id="certificates" className="py-24 px-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="max-w-4xl mx-auto">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase font-heading">
                        Verified Credentials
                    </h2>
                    <p className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                        Professional Certifications
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-body">
                        Use the controls below to swap and view credentials verifying core industry proficiency.
                    </p>
                </div>

                {/* Core Swapper Gallery Module */}
                <div className="relative bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-4 md:p-8 shadow-sm overflow-hidden">

                    <div className="relative min-h-[320px] md:min-h-[460px] flex flex-col justify-between">

                        {/* Animated Canvas */}
                        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-200/50 dark:bg-slate-950/60 border border-slate-200/40 dark:border-slate-800/40">
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.img
                                    key={currentCert.id}
                                    src={currentCert.image}
                                    alt={currentCert.title}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    className="max-w-full max-h-[280px] md:max-h-[400px] object-contain p-2 drop-shadow-md select-none"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800";
                                    }}
                                />
                            </AnimatePresence>
                        </div>

                        {/* Meta Text Display */}
                        <div className="mt-6 text-center space-y-2">
                            <div className="inline-flex items-center justify-center mx-auto">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${currentCert.badgeColor || 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border-blue-100'}`}>
                                    {currentCert.issuer}
                                </span>
                            </div>
                            <h3 className="font-bold text-base md:text-xl text-slate-950 dark:text-white font-heading px-4">
                                {currentCert.title}
                            </h3>
                        </div>

                    </div>

                    {/* Left Arrow Navigation Switch */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 md:p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all select-none z-10 hidden sm:flex"
                        aria-label="Previous Certificate"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Right Arrow Navigation Switch */}
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 md:p-3 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-md hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all select-none z-10 hidden sm:flex"
                        aria-label="Next Certificate"
                    >
                        <ChevronRight size={20} />
                    </button>

                </div>

                {/* Mobile Navigation Controls & Bullet Dots Indicator */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2 gap-4">

                    {/* Mobile Left/Right buttons */}
                    <div className="flex items-center space-x-3 sm:hidden order-2">
                        <button onClick={handlePrev} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 active:scale-95">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={handleNext} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 active:scale-95">
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Bullet Dot Indicators */}
                    <div className="flex items-center space-x-2 mx-auto sm:mx-0 order-1">
                        {certificatesData.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "w-6 bg-blue-600 dark:bg-blue-500"
                                    : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Current Counter Track Indicator */}
                    <div className="text-xs font-bold font-heading tracking-wider text-slate-400 dark:text-slate-500 order-3">
                        {currentIndex + 1} / {certificatesData.length}
                    </div>

                </div>

            </div>
        </section>
    );
}

