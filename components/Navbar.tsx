"use client";

import React, { useState, useRef, useEffect } from "react"; import { cn } from "@/lib/utils"; import { FaSearch } from "react-icons/fa";

const Navbar = () => { const [isModalOpen, setIsModalOpen] = useState(false); const [searchTerm, setSearchTerm] = useState(""); const [searchResults, setSearchResults] = useState<any[]>([]); const [searchIndex, setSearchIndex] = useState(0); const searchInputRef = useRef<HTMLTextAreaElement>(null);

const fetchSearchResults = (query: string) => { if (!query.trim()) return; // Mock results (replace with your API call) const mockResults = [ { id: 1, title: "First Example", url: "#", image: null }, { id: 2, title: "Second Example", url: "#", image: null }, ]; setSearchResults(mockResults); };

useEffect(() => { if (isModalOpen && searchInputRef.current) { searchInputRef.current.focus(); } }, [isModalOpen]);

const SearchInput = () => ( <div className="relative w-full h-full flex flex-col"> <div className="relative mb-4 flex gap-2 w-full"> <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" /> <textarea ref={searchInputRef} value={searchTerm} placeholder="Write something..." onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border rounded-md text-black dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[100px]" /> <button onClick={() => fetchSearchResults(searchTerm)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow" > Send </button> </div>

{!searchTerm && (
    <p className="text-center text-gray-500 dark:text-gray-400 my-auto flex-grow flex items-center justify-center">
      Type something...
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
</div>

);

return ( <> <nav className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-900 shadow"> <h1 className="text-xl font-bold text-gray-900 dark:text-white"> My Blog </h1> <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700" > Open Input </button> </nav>

{isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl h-[500px] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Write & Send
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <SearchInput />
      </div>
    </div>
  )}
</>

); };

export default Navbar;

