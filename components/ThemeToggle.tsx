// src/components/ThemeToggle.tsx
"use client"
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevents hydration mismatch bugs by waiting until the client renders
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 text-slate-700 dark:text-slate-300 group"
            aria-label="Toggle dark mode"
        >
            {theme === "dark" ? (
                <Sun size={22} className="group-hover:rotate-45 transition-transform duration-300 text-amber-500" />
            ) : (
                <Moon size={22} className="group-hover:-rotate-12 transition-transform duration-300 text-indigo-600" />
            )}
        </button>
    );
}