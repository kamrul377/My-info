// src/components/Hero.tsx
"use client"
import { motion } from "framer-motion";
import { personalInfo } from "@/data/portfolioData";
import { Mail } from "lucide-react";

export default function Hero() {
    return (
        <section className="min-h-screen flex flex-col justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 py-20 lg:py-32 font-body transition-colors duration-300">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">

                {/* Left Column: Bio and Text Details */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="lg:col-span-7 space-y-6 text-center lg:text-left"
                >
                    <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide font-body">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span>Available for Core Operations & Engineering</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-400">{personalInfo.name}</span>
                    </h1>

                    <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-400 font-heading">{personalInfo.role}</p>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl text-base md:text-lg">{personalInfo.bio}</p>

                    {/* Action / Social Interface */}
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-4">
                        <a
                            href={`mailto:${personalInfo.email}`}
                            className="flex items-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-5 py-3 rounded-lg shadow-sm hover:shadow transition-all group font-body text-sm"
                        >
                            <Mail size={18} className="mr-2 group-hover:scale-110 transition-transform" /> Contact Me
                        </a>

                        <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-slate-800 pl-4 h-10">
                            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" aria-label="GitHub">
                                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                            </a>
                            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Profile Image Wrapper */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-5 flex justify-center relative"
                >
                    <div className="relative group w-64 h-64 md:w-80 md:h-80">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-300 to-indigo-300 dark:from-blue-900 dark:to-indigo-900 blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                        <div className="relative w-full h-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 p-3 rounded-2xl overflow-hidden shadow-md transform group-hover:rotate-1 group-hover:scale-[1.01] transition-transform duration-300">
                            <img
                                src={personalInfo.avatar}
                                alt={personalInfo.name}
                                className="w-full h-full object-cover object-center rounded-xl bg-slate-100 dark:bg-slate-800 grayscale hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Grid Categorized Core Skills Layer */}
            <div className="mt-20 w-full max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {personalInfo.skillCategories.map((category, catIndex) => (
                    <motion.div
                        key={category.title}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIndex * 0.1 }}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                        <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase mb-3 font-heading">{category.title}</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {category.skills.map((skill) => (
                                <span key={skill} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md text-xs font-medium border border-slate-200/60 dark:border-slate-700/60 font-body">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}