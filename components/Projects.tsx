"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { demoProjects } from "@/data/portfolioData";
import { Shield, Network, Server, CheckCircle2, Layers, Cpu, Activity, ChevronDown } from "lucide-react";

export default function Projects() {
    // State to track how many projects are currently visible
    const [visibleCount, setVisibleCount] = useState(4);

    // Get the subset of projects to display
    const visibleProjects = demoProjects.slice(0, visibleCount);
    const hasMore = visibleCount < demoProjects.length;

    const handleLoadMore = () => {
        // Increases visible count by 4. Change this number to 6 or 8 if you prefer.
        setVisibleCount((prevCount) => Math.min(prevCount + 4, demoProjects.length));
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "MikroTik Core Operations":
                return <Activity className="text-teal-500" size={20} />;
            case "Cyber Security":
                return <Shield className="text-emerald-500" size={20} />;
            case "Network Infrastructure":
                return <Network className="text-purple-500" size={20} />;
            case "Routing & Switching":
                return <Server className="text-blue-500" size={20} />;
            case "L2 Data Link Layer":
                return <Layers className="text-amber-500" size={20} />;
            case "L3 Network Layer":
                return <Cpu className="text-orange-500" size={20} />;
            case "L4 Transport Layer":
                return <Activity className="text-rose-500" size={20} />;
            default:
                return <Network className="text-indigo-500" size={20} />;
        }
    };

    return (
        <section id="projects" className="py-24 px-6 bg-white dark:bg-slate-950 font-body transition-colors duration-300">
            <div className="max-w-6xl mx-auto">

                {/* Header Elements */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-widest uppercase font-heading">
                        Technical Case Studies
                    </h2>
                    <p className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
                        Production-Grade Implementations
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">
                        Detailed configurations, security patterns, and architecture topologies engineered for scale, high availability, and network resiliency.
                    </p>
                </div>

                {/* Projects Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    <AnimatePresence mode="popLayout">
                        {visibleProjects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layout // Ensures existing cards move smoothly when new ones appear
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                                className="group flex flex-col justify-between bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 p-6 lg:p-8 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300"
                            >
                                <div className="space-y-5">
                                    {/* Meta Layout Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2.5 bg-white dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-medium text-slate-700 dark:text-slate-300">
                                            {getCategoryIcon(project.category)}
                                            <span>{project.category}</span>
                                        </div>
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-900/40 font-heading">
                                            {project.metrics}
                                        </span>
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-heading flex items-center">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Sub features Bullet Block */}
                                    <ul className="space-y-2 pt-2">
                                        {project.features.map((feature, i) => (
                                            <li key={i} className="flex items-start text-xs text-slate-600 dark:text-slate-400">
                                                <CheckCircle2 size={14} className="mr-2 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Technologies Array Footer Layout */}
                                <div className="mt-8 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 space-y-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border border-slate-200/50 dark:border-slate-700/50 uppercase"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Load More Button Wrapper */}
                {hasMore && (
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={handleLoadMore}
                            className="flex items-center space-x-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 select-none group"
                        >
                            <span>Load More Projects</span>
                            <ChevronDown size={16} className="text-slate-400 group-hover:text-blue-500 transition-transform duration-200 group-hover:translate-y-0.5" />
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}