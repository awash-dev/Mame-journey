"use client";

import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeInOut", delay: 0.3 },
    },
    hover: { scale: 1.05 },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeInOut", delay: 0.5 },
    },
  };

  const arrowVariants = {
    initial: { opacity: 0.8 },
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity },
    },
  };

  return (
    <div className="flex flex-col min-h-screen font-heebo mt-10">
      {/* Google Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700;800&display=swap"
        rel="stylesheet"
      />

      <main className="flex-1 flex items-center justify-center px-4 py-16 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <div className="max-w-3xl w-full text-center">
          <motion.h1
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4"
          >
            Mohammed’s Blog
          </motion.h1>

          <motion.p
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl font-bold text-gray-700 dark:text-gray-300 mb-6 leading-relaxed"
          >
            A collection of bold insights written by Mohammed—covering finance,
            marketing, and full-stack web development & design.
          </motion.p>

          <motion.div
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <Link
              href="/Blog"
              className="inline-flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all"
            >
              Visit Blog
              <motion.span
                variants={arrowVariants}
                initial="initial"
                animate="animate"
              >
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Link>
          </motion.div>

          {/* SVG Illustration - Enhanced for realism */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 flex justify-center h-[300px]"
          >
            <svg
              viewBox="0 0 800 400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              style={{ width: "100%", height: "auto" }}
            >
              {/* Desk */}
              <g id="desk">
                <rect x="100" y="250" width="600" height="20" rx="5" fill="#A0522D" /> {/* Desk top */}
                <rect x="120" y="270" width="20" height="100" rx="5" fill="#8B4513" /> {/* Left leg */}
                <rect x="660" y="270" width="20" height="100" rx="5" fill="#8B4513" /> {/* Right leg */}
                <rect x="120" y="360" width="560" height="10" rx="3" fill="#8B4513" /> {/* Crossbar */}
              </g>

              {/* Laptop */}
              <g id="laptop">
                {/* Laptop base */}
                <rect x="300" y="230" width="200" height="15" rx="5" fill="#333" />
                {/* Laptop screen (back) */}
                <rect x="305" y="100" width="190" height="130" rx="5" fill="#222" />
                {/* Laptop screen (display area) */}
                <rect x="315" y="110" width="170" height="110" fill="#4CAF50" /> {/* Green screen for "code" */}
                {/* Keyboard details */}
                <rect x="310" y="235" width="180" height="5" fill="#555" rx="2" />
                <rect x="310" y="242" width="180" height="5" fill="#555" rx="2" />
              </g>

              {/* Human */}
              <g id="human">
                {/* Head */}
                <circle cx="400" cy="90" r="30" fill="#FFDAB9" stroke="#A0522D" strokeWidth="2" />
                {/* Body */}
                <rect x="370" y="120" width="60" height="80" rx="10" fill="#6A5ACD" /> {/* Shirt/Sweater */}
                {/* Arms */}
                <path d="M370 130 Q350 150 360 200" stroke="#FFDAB9" strokeWidth="10" fill="none" strokeLinecap="round" /> {/* Left arm */}
                <path d="M430 130 Q450 150 440 200" stroke="#FFDAB9" strokeWidth="10" fill="none" strokeLinecap="round" /> {/* Right arm */}
                {/* Hands (simplified) */}
                <circle cx="360" cy="200" r="8" fill="#FFDAB9" />
                <circle cx="440" cy="200" r="8" fill="#FFDAB9" />
              </g>

              {/* Chair */}
              <g id="chair">
                <rect x="360" y="200" width="80" height="10" rx="5" fill="#555" /> {/* Seat */}
                <rect x="370" y="130" width="60" height="70" rx="5" fill="#555" /> {/* Backrest */}
                <rect x="375" y="210" width="10" height="60" fill="#444" /> {/* Left leg */}
                <rect x="415" y="210" width="10" height="60" fill="#444" /> {/* Right leg */}
              </g>

              {/* Accessories */}
              <g id="accessories">
                {/* Lamp */}
                <circle cx="200" cy="240" r="10" fill="#888" /> {/* Base */}
                <rect x="195" y="180" width="10" height="60" fill="#888" /> {/* Stand */}
                <polygon points="180,180 220,180 230,160 170,160" fill="#FFD700" /> {/* Shade */}
                <circle cx="200" cy="170" r="5" fill="#FFF" /> {/* Light source */}

                {/* Coffee Mug */}
                <rect x="550" y="230" width="40" height="20" rx="5" fill="#A0522D" /> {/* Mug body */}
                <path d="M590 235 A10 10 0 1 1 590 245" stroke="#A0522D" strokeWidth="3" fill="none" /> {/* Handle */}
                <circle cx="570" cy="230" r="10" fill="#6F4E37" /> {/* Coffee */}

                {/* Plant */}
                <rect x="620" y="230" width="30" height="20" rx="5" fill="#8B4513" /> {/* Pot */}
                <path d="M635 230 Q625 200 645 200 Q655 230 635 230 Z" fill="#228B22" /> {/* Leaves */}
                <path d="M635 230 Q640 205 620 205 Q610 230 635 230 Z" fill="#228B22" /> {/* Leaves */}

                {/* Mouse */}
                <rect x="510" y="240" width="20" height="15" rx="5" fill="#444" />
                <circle cx="520" cy="245" r="3" fill="#888" /> {/* Scroll wheel */}
              </g>
            </svg>
          </motion.div>
        </div>
      </main>
    </div>
  );
}