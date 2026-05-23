
// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider"; // 👈 ১. প্রোভাইডারটি এখানে ইম্পোর্ট করুন
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kamrul Islam | System Engineer & Full-Stack Developer",
  description: "Core Network Specialist & Full-Stack Web Developer Portfolio highlighting carrier-grade routing, security, and network automation case studies.",
  keywords: ["Kamrul Islam", "Kamrul info", "System Engineer", "Network Engineer", "Portfolio"],
  verification: {
    google: "q03IFXAPSZ1Nm6DLWCk8-jRYLjZuooEJvzgtYsLAoW4",
  },
  icons: {
    icon: "./man.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        {/* 🌓 থিম প্রোভাইডার */}
        <ThemeProvider>
          {/* 🔐 ২. অথেনটিকেশন প্রোভাইডার দিয়ে children-কে র্যাপ করুন */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}