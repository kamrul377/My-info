// // src/app/layout.tsx
// import type { Metadata } from "next";
// import { Inter, Plus_Jakarta_Sans } from "next/font/google";
// import { ThemeProvider } from "@/components/ThemeProvider";
// import "./globals.css";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter", // <-- Must match the CSS variable exactly
//   display: "swap",
// });

// const plusJakarta = Plus_Jakarta_Sans({
//   subsets: ["latin"],
//   variable: "--font-jakarta", // <-- Must match the CSS variable exactly
//   display: "swap",
// });

// export const metadata: Metadata = {
//   title: "Kamrul Islam | Portfolio",
//   description: "System Engineer & Full-Stack Developer Portfolio",
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
//       <body className="antialiased">
//         <ThemeProvider>
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  title: "Kamrul Islam | System Engineer & Full-Stack Developer", // 👈 ব্রাউজার ট্যাবের সুন্দর টাইটেল
  description: "Core Network Specialist & Full-Stack MERN Developer Portfolio highlighting carrier-grade routing, security, and network automation case studies.",
  icons: {
    icon: "./man.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}