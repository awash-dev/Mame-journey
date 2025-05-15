"use client";
import Link from "next/link";
import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hpme() {
  // Variants for text animation
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  // Variants for button animation
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut", delay: 0.2 },
    },
    hover: { scale: 1.1 },
  };

  // Variants for image animation
  const imageVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut", delay: 0.4 },
    },
  };

  // Variants for the arrow icon animation (light pulsation)
  const arrowVariants = {
    initial: { opacity: 0.8 },
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  return (
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

      <div className="bg-white w-full dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-heebo">
        <div className="px-4 sm:px-6 lg:px-8 main-content">
          <div className="mt-8 items-center text-center w-full">
            <motion.h1
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="md:text-3xl text-[20px] sm:text-4xl font-bold text-center " // Increased font size on larger screens
            >
              Mohammed’s Blog
            </motion.h1>
            <motion.p
              variants={textVariants}
              initial="hidden"
              animate="visible"
              className="mt-4 text-lg sm:text-xl leading-relaxed px-4 sm:px-8 md:px-16 lg:px-32" // Adjusted padding for responsiveness
            >
              A collection of blogs written by Mohammed, exploring topics
              including finance, marketing, and web devepment& design .
            </motion.p>
            <motion.div
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center "
            >
              <Link
                href="/Blog"
                className="bg-black py-3 px-8 sm:px-12 text-white flex gap-4 rounded-2xl dark:bg-white dark:text-black mt-4" // Adjusted padding
              >
                visit Blog
                <motion.div
                  variants={arrowVariants}
                  initial="initial"
                  animate="animate"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 flex justify-center" // Increased margin-top
            >
              <img
                src="/home.jpg"
                alt="Mohammed"
                className="rounded-lg shadow-lg max-w-full sm:max-w-md w-full h-auto sm:h-[300px]" //Made image responsive
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
