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
  const res = await fetch(  
    `/api/search-posts?query=${encodeURIComponent(term)}`  
  );  
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

  debounceTimeoutRef.current = setTimeout(() => {  
    fetchSearchResults(term);  
  }, 300);  
},  
[fetchSearchResults]

);

useEffect(() => {
if (searchBoxOpen) {
setSearchTerm("");
setSearchResults([]);
setSearchIndex(-1);
if (searchInputRef.current) {
searchInputRef.current.focus();
}
} else {
setSearchTerm("");
setSearchResults([]);
setSearchIndex(-1);
if (debounceTimeoutRef.current) {
clearTimeout(debounceTimeoutRef.current);
}
}
}, [searchBoxOpen]);

useEffect(() => {
const handleKey = (e: KeyboardEvent) => {
if (!searchBoxOpen) return;

if (e.key === "Escape") return setSearchBoxOpen(false);  
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
              "flex items-center gap-4 p-3 rounded-md cursor-pointer",  
              "hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",  
              searchIndex === index &&  
                "bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100"  
            )}  
          >  
            {result.image ? (  
              <img  
                src={result.image}  
                alt={result.title}  
                className="w-16 h-16 object-cover rounded-md flex-shrink-0"  
                onError={(e) => {  
                  e.currentTarget.src = `https://placehold.co/64x64/E0E0E0/666666?text=No+Image`;  
                }}  
              />  
            ) : (  
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs flex-shrink-0">  
                No Img  
              </div>  
            )}  
            <span className="text-black dark:text-white font-medium">  
              {result.title}  
            </span>  
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

// Modified MobileDarkModeSwitch to directly show sun/moon icons
const MobileDarkModeSwitch: React.FC = () => (
<motion.button
onClick={() => setTheme(isDark ? "light" : "dark")}
aria-label="Toggle Dark Mode"
aria-pressed={isDark}
whileTap={{ scale: 0.9 }}
transition={{ type: "spring", stiffness: 400, damping: 17 }}
className="flex items-center justify-center w-8 h-8 rounded-full" // Added styling for better visual
>
<AnimatePresence mode="wait">
{isDark ? (
<motion.span
key="moon-mobile"
initial={{ opacity: 0, scale: 0.5 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.5 }}
transition={{ duration: 0.2 }}
>
<BsMoonStarsFill className="w-5 h-5 text-gray-300" /> {/* Adjusted size and color /}
</motion.span>
) : (
<motion.span
key="sun-mobile"
initial={{ opacity: 0, scale: 0.5 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.5 }}
transition={{ duration: 0.2 }}
>
<BsSun className="w-5 h-5 text-yellow-500" /> {/ Adjusted size and color */}
</motion.span>
)}
</AnimatePresence>
</motion.button>
);

return (
<>
<motion.nav
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3 }}
className="bg-white dark:bg-gray-900 fixed top-0 z-50 w-full px-4 md:px-6 lg:px-8 py-3 h-[80px] items-center"
>
<div className="container mx-auto flex items-center justify-between">
<Link  
href="/"  
className="font-bold text-[20px] md:text-2xl font-serif"  
>
Mohammed's
<span className="text-indigo-600 dark:text-indigo-400"> Blog</span>
</Link>

<div className="hidden md:flex items-center space-x-6">  
        <NavLink href="/" label="Home" />  
        <NavLink href="/About" label="About" />  
        <NavLink href="/Blog" label="Blog" />  
        <button  
          onClick={() => setSearchBoxOpen(!searchBoxOpen)}  
          aria-label="Search"  
        >  
          <FaSearch className="w-5 h-5 text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition" />  
        </button>  
        <span className="text-gray-500 dark:text-gray-400"> | </span>  
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
          onClick={() => setSearchBoxOpen(!searchBoxOpen)}  
          aria-label="Search"  
        >  
          <FaSearch className="w-5 h-5 text-gray-600 dark:text-gray-300" />  
        </button>  
        <span className="text-gray-500 dark:text-gray-400"> | </span>  
        {/* Using the modified MobileDarkModeSwitch */}  
        <MobileDarkModeSwitch />  
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

  <AnimatePresence>  
    {searchBoxOpen && (  
      <>  
        <motion.div  
          initial={{ opacity: 0 }}  
          animate={{ opacity: 0.5 }}  
          exit={{ opacity: 0 }}  
          className="fixed inset-0 bg-black z-40"  
          onClick={() => setSearchBoxOpen(false)}  
        />  
        <motion.div  
          initial={{ opacity: 0, scale: 0.8 }}  
          animate={{ opacity: 1, scale: 1 }}  
          exit={{ opacity: 0, scale: 0.8 }}  
          transition={{ duration: 0.2 }}  
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 w-full max-w-md h-[400px] flex flex-col"  
        >  
          <SearchInput />  
        </motion.div>  
      </>  
    )}  
  </AnimatePresence>  

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

);
};

export default Navbar;

