"use client";
import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-50 text-black dark:bg-gray-900 dark:text-white">
      <div className="flex items-center">
        <Link href="/" className="font-mono text-3xl font-[600]">
          Mohammed <span className="font-Heebo  text-2xl">Blog</span>
        </Link>
      </div>

      {/* link section */}
      <div className="flex space-x-4 justify-between items-center text-[18px]">
        <Link href="/">Home</Link>
        <Link href="/About">About</Link>
        <Link href="/Blog">Blog</Link>
      </div>

      {/* search and light toggle button */}
      <div className="flex space-x-4 justify-between items-center">
        <div className="">
          <FaSearch className="text-[20px] text-black-500 dark:text-white" />
        </div>
        <div>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-moon"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7.5 7.5 0 0 0 21 12.79z"></path>
            </svg>
          </button>
        </div>
      </div>
      {/* contsact part */}
      <div className="flex space-x-4 justify-between items-center px-4  py-2 border-2 border-b-black text-black hover:bg-black hover:text-white transition-all shadow-accent-foreground  rounded-lg">
        <Link href="/Contact" className="text-lg font-mono">
          {" "}
          contact me
        </Link>
      </div>
    </div>
  );
}
