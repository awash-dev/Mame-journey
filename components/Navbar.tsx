"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
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
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [searchIndex, setSearchIndex] = useState(-1);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  /** Fetch search results */
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
      setSearchIndex(-1);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
    }
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchSearchResults(term), 300);
    },
    [fetchSearchResults]
  );

  /** Handle keyboard navigation inside modal */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!searchModalOpen) return;
      if (e.key === "Escape") return setSearchModalOpen(false);
      if (!searchResults.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSearchIndex((i) => Math.min(i + 1, searchResults.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSearchIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && searchIndex > -1) {
        window.location.href = searchResults[searchIndex].url;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchModalOpen, searchResults, searchIndex]);

  /** Auto-focus input when modal opens */
  useEffect(() => {
    if (searchModalOpen) {
      setSearchTerm("");
      setSearchResults([]);
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchModalOpen]);

  /** Search modal content */
  const SearchModal = () => (
    <AnimatePresence>
      {searchModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setSearchModalOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6 relative"
            onClick={(e) => e.stopPropagation()} // prevent modal close on inner click
          >
            <button
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400"
              onClick={() => setSearchModalOpen(false)}
            >
              <FaTimes size={20} />
            </button>
            <div className="flex flex-col">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search posts..."
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="mt-4 max-h-64 overflow-y-auto">
                {searchTerm && searchResults.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center">No results found.</p>
                )}
                {searchResults.map((post, index) => (
                  <div
                    key={post.id}
                    onClick={() => (window.location.href = post.url)}
                    className={cn(
                      "p-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3",
                      searchIndex === index && "bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100"
                    )}
                  >
                    {post.image ? (
                      <img
                        src={post.image}
                        className="w-12 h-12 object-cover rounded"
                        alt={post.title}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/64x64/E0E0E0/666666?text=No+Image`;
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                        No Img
                      </div>
                    )}
                    <span className="text-black dark:text-white">{post.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-black dark:text-white">
            MyBlog
          </Link>
          <div className="hidden md:flex gap-4">
            <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Home</Link>
            <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search icon opens modal */}
          <button onClick={() => setSearchModalOpen(true)} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
            <FaSearch size={18} />
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <Link href="/" className="block px-4 py-2 text-gray-700 dark:text-gray-200">Home</Link>
          <Link href="/about" className="block px-4 py-2 text-gray-700 dark:text-gray-200">About</Link>
        </div>
      )}

      {/* Search modal */}
      <SearchModal />
    </nav>
  );
};

export default Navbar;