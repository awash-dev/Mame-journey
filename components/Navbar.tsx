"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaBars, FaTimes, FaSun, FaMoon } from "react-icons/fa";
import { BsSun, BsMoonStarsFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: number;
  title: string;
  url: string;
}

const blogPosts: BlogPost[] = [
  { id: 1, title: "The Future of AI", url: "/blog/ai" },
  { id: 2, title: "Web Development Trends", url: "/blog/webdev" },
  { id: 3, title: "Data Science Explained", url: "/blog/datascience" },
];

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchBoxOpen, setSearchBoxOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [searchIndex, setSearchIndex] = useState<number>(-1);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      setSearchResults([]);
      setSearchIndex(-1);
      return;
    }
    const filtered = blogPosts.filter((post) =>
      post.title.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
    setSearchIndex(-1);
  }, []);

  useEffect(() => {
    if (searchBoxOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!searchBoxOpen) {
      setSearchTerm("");
      setSearchResults([]);
    }
  }, [searchBoxOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!searchBoxOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSearchIndex((prevIndex) =>
          Math.min(prevIndex + 1, searchResults.length - 1)
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSearchIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      } else if (e.key === "Enter" && searchIndex > -1) {
        e.preventDefault();
        const selectedResult = searchResults[searchIndex];
        if (selectedResult) {
          window.location.href = selectedResult.url;
          setSearchBoxOpen(false);
        }
      } else if (e.key === "Escape") {
        setSearchBoxOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchBoxOpen, searchIndex, searchResults]);

  const NavLink: React.FC<{ href: string; label: string }> = ({
    href,
    label,
  }) => (
    <Link
      href={href}
      className="text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      {label}
    </Link>
  );

  const SearchInput: React.FC = () => (
    <div className="relative w-full">
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-black dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {searchResults.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((result, index) => (
            <li
              key={result.id}
              className={cn(
                "px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
                searchIndex === index &&
                  "bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100"
              )}
              onClick={() => {
                window.location.href = result.url;
                setSearchBoxOpen(false);
              }}
            >
              {result.title}
            </li>
          ))}
        </ul>
      )}
      {searchTerm && (
        <div className="absolute bottom-full mb-1 text-xs text-gray-500 dark:text-gray-400">
          {searchResults.length > 0
            ? `${searchIndex + 1}/${searchResults.length}  ↑↓  Enter`
            : "No results found."}
        </div>
      )}
      <div className="absolute top-full mt-1 text-xs text-gray-500 dark:text-gray-400">
        Esc to close
      </div>
    </div>
  );

  const DarkModeSwitch: React.FC = () => (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      aria-pressed={isDark}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="relative w-12 h-6 rounded-full flex items-center bg-gray-200 dark:bg-gray-700"
    >
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? "calc(100% + 0.5rem)" : "0.25rem",
        }}
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30,
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <BsMoonStarsFill className="w-3 h-3 text-gray-700" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <BsSun className="w-3 h-3 text-yellow-500" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );

  const MobileDarkModeSwitch: React.FC = () => (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      aria-pressed={isDark}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="flex items-center gap-2" // Added gap for spacing
    >
      {isDark ? (
        <span className="text-gray-700 text-[20px]  dark:text-gray-300"><FaSun/></span>
      ) : (
        <span className="text-yellow-500 text-[20px] dark:text-yellow-400"> <FaMoon/> </span>
      )}
    </motion.button>
  );

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-gray-900 h-[80px] items-center dark:text-white text-black sticky top-0 z-50 px-4 md:px-6 lg:px-8 py-3"
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-2xl font-serif">
            Mohammed's
            <span className="text-indigo-600 dark:text-indigo-400"> Blog</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/" label="Home" />
            <NavLink href="/About" label="About" />
            <NavLink href="/Blog" label="Blog" />

            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchBoxOpen(!searchBoxOpen)}
                aria-label="Search"
                aria-expanded={searchBoxOpen}
              >
                <FaSearch className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition" />
              </button>
            </div>

            <span className="text-gray-500 dark:text-gray-400"> | </span>
            <DarkModeSwitch />

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

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setSearchBoxOpen(!searchBoxOpen)}
              aria-label="Search"
              aria-expanded={searchBoxOpen}
            >
              <FaSearch className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <span className="text-gray-500 dark:text-gray-400"> | </span>
            <MobileDarkModeSwitch />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
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

      {/* Search Box Overlay */}
      <AnimatePresence>
        {searchBoxOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSearchBoxOpen(false)} // Close on backdrop click
            />
            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 w-full max-w-md"
            >
              <SearchInput />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute left-0 w-full bg-white dark:bg-gray-900 z-40 py-4 shadow-md rounded-b-lg max-h-[80vh] overflow-y-auto">
          <div className="flex flex-col items-center space-y-4 px-4">
            <NavLink href="/" label="Home" />
            <NavLink href="/About" label="About" />
            <NavLink href="/Blog" label="Blog" />
            <Link
              href="/Contact"
              className="mt-2 px-4 py-2 border-2 border-black dark:border-white text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded-lg transition font-mono text-lg"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
