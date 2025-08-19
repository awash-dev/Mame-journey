"use client";

import Link from "next/link"; import React, { useState, useEffect, useRef } from "react"; import { FaBars, FaTimes } from "react-icons/fa"; import { BsSun, BsMoonStarsFill } from "react-icons/bs"; import { motion, AnimatePresence } from "framer-motion"; import { useTheme } from "next-themes"; import { cn } from "@/lib/utils";

const Navbar: React.FC = () => { const [mobileMenuOpen, setMobileMenuOpen] = useState(false); const [textBoxOpen, setTextBoxOpen] = useState(false); const [message, setMessage] = useState(""); const [charCount, setCharCount] = useState(0); const textAreaRef = useRef<HTMLTextAreaElement | null>(null); const { theme, setTheme } = useTheme(); const isDark = theme === "dark";

// Auto expand textarea height useEffect(() => { if (textAreaRef.current) { textAreaRef.current.style.height = "auto"; textAreaRef.current.style.height = ${textAreaRef.current.scrollHeight}px; } }, [message]);

const NavLink = ({ href, label }: { href: string; label: string }) => ( <Link href={href} onClick={() => setMobileMenuOpen(false)} className="text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" > {label} </Link> );

const DarkModeToggle = () => ( <motion.button onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle Dark Mode" aria-pressed={isDark} whileTap={{ scale: 0.9 }} className="relative w-12 h-6 rounded-full flex items-center bg-gray-200 dark:bg-gray-700" > <motion.div className="absolute w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow-md flex items-center justify-center" animate={{ x: isDark ? "calc(100% + 0.5rem)" : "0.25rem" }} transition={{ type: "spring", stiffness: 700, damping: 30 }} > <AnimatePresence mode="wait"> {isDark ? ( <motion.span key="moon" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} > <BsMoonStarsFill className="w-3 h-3 text-gray-700" /> </motion.span> ) : ( <motion.span key="sun" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} > <BsSun className="w-3 h-3 text-yellow-500" /> </motion.span> )} </AnimatePresence> </motion.div> </motion.button> );

return ( <> {/* Navbar */} <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="bg-white dark:bg-gray-900 fixed top-0 z-50 w-full px-4 md:px-6 lg:px-8 py-3 h-[80px] items-center shadow" > <div className="container mx-auto flex items-center justify-between"> <Link
href="/"
className="font-bold text-[20px] md:text-2xl font-serif"
> Mohammed's <span className="text-indigo-600 dark:text-indigo-400"> Blog</span> </Link>

<div className="hidden md:flex items-center space-x-6">
        <NavLink href="/" label="Home" />
        <NavLink href="/About" label="About" />
        <NavLink href="/Blog" label="Blog" />
        <button
          onClick={() => setTextBoxOpen(!textBoxOpen)}
          aria-label="Open Text Box"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          Write
        </button>
        <DarkModeToggle />
        <Link
          href="/Contact"
          className={cn(
            "ml-4 px-4 py-2 border-2 rounded-lg transition font-mono shadow",
            "hover:text-white hover:bg-black dark:hover:text-black dark:hover:bg-white",
            "text-black dark:text-white border-black dark:border-white"
          )}
        >
          Contact
        </Link>
      </div>

      <div className="md:hidden flex items-center space-x-4">
        <button
          onClick={() => setTextBoxOpen(!textBoxOpen)}
          aria-label="Open Text Box"
          className="px-3 py-1 bg-indigo-600 text-white rounded-md shadow"
        >
          Write
        </button>
        <DarkModeToggle />
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <FaTimes className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          ) : (
            <FaBars className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
    </div>
  </motion.nav>

  {/* Text Box Modal */}
  <AnimatePresence>
    {textBoxOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setTextBoxOpen(false)}
        />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 w-full max-w-lg flex flex-col"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Write your message
          </h2>
          <textarea
            ref={textAreaRef}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setCharCount(e.target.value.length);
            }}
            placeholder="Type here..."
            className="w-full resize-none border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-black dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            rows={3}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {charCount} characters
            </span>
            <button
              onClick={() => {
                console.log("Message sent:", message);
                setMessage("");
                setCharCount(0);
                setTextBoxOpen(false);
              }}
              className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>

  {/* Mobile Menu */}
  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="md:hidden fixed top-[80px] left-0 w-full bg-white dark:bg-gray-900 z-40 py-4 shadow-md"
      >
        <div className="flex flex-col items-center space-y-6 px-4">
          <NavLink href="/" label="Home" />
          <NavLink href="/About" label="About" />
          <NavLink href="/Blog" label="Blog" />
          <NavLink href="/Contact" label="Contact" />
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</>

); };

export default Navbar;

