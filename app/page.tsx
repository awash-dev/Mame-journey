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

          {/* Clean SVG Illustration */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 flex justify-center h-[280px]"
          >
            <svg
              viewBox="0 0 800 400"
              xmlns="http://www.w3.org/2000/svg"
              style={{ width: "100%", height: "auto" }}
            >
              {/* Background Circle */}
              <circle cx="400" cy="200" r="180" fill="url(#grad)" opacity="0.15" />

              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>

              {/* Laptop */}
              <g>
                <rect x="280" y="180" width="240" height="140" rx="12" fill="#111" />
                <rect x="295" y="195" width="210" height="110" rx="8" fill="#1E293B" />
                <text
                  x="400"
                  y="250"
                  fontSize="18"
                  textAnchor="middle"
                  fill="#38BDF8"
                  fontFamily="monospace"
                >
                  {"<Code />"}
                </text>
              </g>

              {/* Coffee Cup */}
              <g>
                <circle cx="560" cy="260" r="25" fill="#E5E7EB" />
                <circle cx="560" cy="260" r="15" fill="#6B21A8" />
              </g>

              {/* Plant */}
              <g>
                <rect x="200" y="250" width="40" height="50" rx="6" fill="#8B5CF6" />
                <path
                  d="M220 250 Q200 210 220 190 Q240 210 220 250"
                  fill="#22C55E"
                />
              </g>

              {/* User Avatar */}
              <g>
                <circle cx="400" cy="100" r="35" fill="#FACC15" />
                <circle cx="400" cy="90" r="12" fill="#1E293B" />
              </g>
            </svg>
          </motion.div>
        </div>
      </main>
    </div>
  );
}