// src/app/page.tsx
"use client"
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import ThemeToggle from "@/components/ThemeToggle"; // <-- Import Button

export default function Home() {
  return (
    <main className="bg-white dark:bg-slate-950 min-h-screen antialiased overflow-x-hidden selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-300">
      <Hero />
      <Projects />
      <Experience />
      <ThemeToggle /> {/* <-- Mount Button Here */}
    </main>
  );
}