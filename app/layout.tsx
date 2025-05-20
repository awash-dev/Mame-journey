"use client"
import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnimatedCursor from "@/components/AnimatedCursor";
import { ThemeProvider } from "next-themes";

// Define Heebo font
const heebo = Heebo({
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <AnimatedCursor />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
