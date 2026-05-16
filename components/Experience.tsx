"use client"
import { motion } from "framer-motion";
import { experiences, education } from "@/data/portfolioData";

export default function Experience() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 px-6 border-t border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
            <div className="max-w-5xl mx-auto grid md:grid-cols-12 gap-12 lg:gap-20">

                {/* Experience Timeline */}
                <div className="md:col-span-7">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-heading">
                        Professional History
                    </h2>
                    <div className="space-y-8 border-l-2 border-slate-200 dark:border-slate-800 pl-6 ml-2">
                        {experiences.map((exp, i) => (
                            <motion.div
                                key={`exp-${i}`}
                                initial={{ opacity: 0, x: -15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="relative"
                            >
                                {/* Custom timeline point nodes */}
                                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-blue-600 dark:border-blue-500 shadow-sm" />

                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 px-2 py-0.5 rounded-md font-body">
                                    {exp.period}
                                </span>

                                <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50 mt-2 font-heading">
                                    {exp.role}
                                </h3>

                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3 font-body">
                                    {exp.company}
                                </p>

                                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-body">
                                    {exp.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Education Timeline */}
                <div className="md:col-span-5">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-10 font-heading">
                        Education
                    </h2>
                    <div className="space-y-8 border-l-2 border-slate-200 dark:border-slate-800 pl-6 ml-2">
                        {education.map((edu, i) => (
                            <motion.div
                                key={`edu-${i}`}
                                initial={{ opacity: 0, x: 15 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative"
                            >
                                {/* Custom timeline point nodes */}
                                <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-400 dark:border-slate-600 shadow-sm" />

                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 rounded-md font-body">
                                    {edu.period}
                                </span>

                                <h3 className="text-lg font-bold text-slate-950 dark:text-slate-50 mt-2 font-heading">
                                    {edu.degree}
                                </h3>

                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 font-body">
                                    {edu.institution}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}