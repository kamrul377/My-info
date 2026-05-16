// src/components/FAQ.tsx
"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqData } from "@/data/portfolioData";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 px-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="max-w-4xl mx-auto">

                {/* Header section */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase font-heading">
                        Technical Insights
                    </h2>
                    <p className="text-3xl font-extrabold font-heading text-slate-950 dark:text-white">
                        Questions & Answers
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-body">
                        A quick deep-dive into my engineering principles, architectural patterns, and automation methodologies.
                    </p>
                </div>

                {/* Accordion Stack */}
                <div className="space-y-4">
                    {faqData.map((item, index) => {
                        const isOpen = activeIndex === index;
                        return (
                            <div
                                key={index}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-sm transition-all duration-200"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none group select-none"
                                >
                                    <div className="flex items-start space-x-3.5 pr-4">
                                        <HelpCircle className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5 transition-transform group-hover:scale-110" size={18} />
                                        <span className="font-bold font-heading text-sm md:text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {item.question}
                                        </span>
                                    </div>
                                    <ChevronDown
                                        size={18}
                                        className={`text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : ""
                                            }`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: "easeInOut" }}
                                        >
                                            <div className="px-5 pb-5 md:px-6 md:pb-6 ml-8 border-t border-slate-100 dark:border-slate-800/50 pt-4">
                                                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-body">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}