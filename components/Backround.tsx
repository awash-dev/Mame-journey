'use client';
import Footer from "@/components/Footer";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import AnimatedCursor from "@/components/AnimatedCursor";
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { cn } from "@/lib/utils";

const Background = () => {
  const [isMobile, setIsMobile] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const backgroundX = useTransform(x, (val) => `${val / 20}px`); // Adjust divisor for speed
  const backgroundY = useTransform(y, (val) => `${val / 20}px`);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [x, y]);

    // Don't render animation on mobile
    if (isMobile) return (
      <div className="flex flex-col min-h-screen">
        <style jsx global>{`
          body {
            font-family: "Heebo", sans-serif;
          }
          .main-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-heebo">
          <div className="px-4 sm:px-6 lg:px-8 main-content">
            <div className="mt-8 items-center text-center w-full">
              <h1 className="text-3xl font-bold text-center ">Mohammed’s Blog</h1>
              <p className="mt-4 text-xl leading-relaxed px-56">
                A collection of blogs written by Mohammed, exploring topics
                including finance, marketing, and web devepment & design .
              </p>
              <div className="flex justify-center ">
                <Link
                  href="/blog"
                  className="bg-black py-3 px-12 text-white flex gap-4 rounded-2xl dark:bg-white dark:text-black mt-4"
                >
                  visit Blog <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
              <div className="mt-4 mb-2 flex justify-center">
                <img
                  src="/home.jpg"
                  alt="Mohammed"
                  className="rounded-lg shadow-lg max-w-md w-full h-[300px]"
                />
              </div>
            </div>
          </div>
        </div>
        <Footer />
        
      </div>
    );


  return (
    <motion.div
      style={{
        backgroundPositionX: backgroundX,
        backgroundPositionY: backgroundY,
        backgroundImage: 'url(/spider-web.png)', // Replace with your spider web image
        backgroundRepeat: 'repeat',
        minHeight: '100vh',
        width: '100%',
      }}
      className="flex flex-col"
    >
      <style jsx global>{`
        body {
          font-family: "Heebo", sans-serif;
        }
        .main-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="  px-4 sm:px-6 lg:px-8 main-content">
        <div className="mt-8 items-center text-center w-full">
          <h1 className="text-3xl font-bold text-center ">Mohammed’s Blog</h1>
          <p className="mt-4 text-xl leading-relaxed px-56">
            A collection of blogs written by Mohammed, exploring topics
            including finance, marketing, and web devepment & design .
          </p>
          <div className="flex justify-center ">
            <Link
              href="/blog"
              className="bg-black py-3 px-12 text-white flex gap-4 rounded-2xl dark:bg-white dark:text-black mt-4"
            >
              visit Blog <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-4 mb-2 flex justify-center">
            <img
              src="/home.jpg"
              alt="Mohammed"
              className="rounded-lg shadow-lg max-w-md w-full h-[300px]"
            />
          </div>
        </div>
      </div>
      <Footer />
      <AnimatedCursor />
    </motion.div>
  );
};

export default Background;
