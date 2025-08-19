"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { BsSun, BsMoonStarsFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  url: string;
  image?: string | null;
}

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [searchIndex, setSearchIndex] = useState(-1);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const fetchSearchResults = useCallback(async (term: string) => {
    if (!term.trim()) return setSearchResults([]);
    try {
      const res = await fetch(`/api/search-posts?query=${encodeURIComponent(term)}`);
      const { data, error } = await res.json();
      if (error || !res.ok) throw new Error(error || "Search failed");
      const results = data.map((post: any) => ({
        id: post.id,
        title: post.title,
        url: `/post/${post.id}`,
        image: post.image,
      }));
      setSearchResults(results);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearchIndex(-1);
    }
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(() => fetchSearchResults(term), 300);
    },
    [fetchSearchResults]
  );

  useEffect(() => {
    if (searchBoxOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setSearchIndex(-1);
      searchInputRef.current?.focus();
    } else {
      setSearchTerm("");
      setSearchResults([]);
      setSearchIndex(-1);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    }
  }, [searchBoxOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!searchBoxOpen) return;
      if (e.key === "Escape") return setSearchBoxOpen(false);
      if (!searchResults.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSearchIndex(i => Math.min(i + 1, searchResults.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSearchIndex(i => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && searchIndex > -1) {
        window.location.href = searchResults[searchIndex].url;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchBoxOpen, searchResults, searchIndex]);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className="text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
    >
      {label}
    </Link>
  );

  const SearchInput = () => (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative mb-4">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        <input
          ref={searchInputRef}
          type="text"
          value={searchTerm}
          placeholder="Search Post ..."
          onChange={handleSearchChange}
          className="w-full pl-10 pr-3 py-2 border rounded-md text-black dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      {!searchTerm && (
        <p className="text-center text-gray-500 dark:text-gray-400 my-auto flex-grow flex items-center justify-center">
          Type something to search..
        </p>
      )}
      {searchTerm && !searchResults.length && (
        <p className="text-center text-gray-500 dark:text-gray-400 my-auto flex-grow flex items-center justify-center">
          No results found.
        </p>
      )}
      {searchTerm && searchResults.length > 0 && (
        <div className="flex-grow overflow-y-auto border-t border-gray-200 dark:border-gray-700 pt-4">
          <ul className="space-y-3">
            {searchResults.map((result, index) => (
              <li
                key={result.id}
                onClick={() => (window.location.href = result.url)}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                  searchIndex === index && "bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100"
                )}
              >
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    onError={e => e.currentTarget.src = "https://placehold.co/64x64/E0E0E0/666666?text=No+Image"}
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs flex-shrink-0">
                    No Img
                  </div>
                )}
                <span className="text-black dark:text-white font-medium">{result.title}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
        <span>↑↓ to navigate • Enter to select</span>
        <span>ESC to close</span>
      </div>
    </div>
  );

  const DarkModeToggle = () => (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      aria-pressed={isDark}
      whileTap={{ scale: 0.9 }}
      className="relative w-12 h-6 rounded-full flex items-center bg-gray-200 dark:bg-gray-700"
    >
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white dark:bg-gray-200 shadow-md flex items-center justify-center"
        animate={{ x: isDark ? "calc(100% + 0.5rem)" : "0.25rem" }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <BsMoonStarsFill className="w-3 h-3 text-gray-700" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <BsSun className="w-3 h-3 text-yellow-500" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex items-center justify-between relative z-50">
      <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        Mohammed's Blog
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-6">
        <NavLink href="/" label="Home" />
        <NavLink href="/About" label="About" />
        <NavLink href="/Blog" label="Blog" />
        <NavLink href="/Contact" label="Contact" />
        <DarkModeToggle />
        <button onClick={() => setSearchBoxOpen(true)} className="ml-4 text-gray-700 dark:text-gray-200">
          <FaSearch size={20} />
        </button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-4">
        <DarkModeToggle />
        <button onClick={() => setSearchBoxOpen(true)} className="text-gray-700 dark:text-gray-200">
          <FaSearch size={20} />
        </button>
        <button onClick={() => setMobileMenuOpen(prev => !prev)} className="text-gray-700 dark:text-gray-200">
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md flex flex-col items-center py-6 md:hidden gap-4"
          >
            <NavLink href="/" label="Home" />
            <NavLink href="/about" label="About" />
            <NavLink href="/blog" label="Blog" />
            <NavLink href="/contact" label="Contact" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchBoxOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl h-4/5 p-6 flex flex-col"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black dark:text-white">Search</h2>
                <button onClick={() => setSearchBoxOpen(false)} className="text-gray-700 dark:text-gray-200">
                  <FaTimes size={20} />
                </button>
              </div>
              <SearchInput />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;