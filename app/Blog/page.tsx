"use client"

import BlogsPage from "@/post/BlogPost";
import React from "react";

export default function Blogs() {
  return (
    <div className="mt-14">
      <div className="w-full  z-50 mt-20 md:mt-0 h-[150px] bg-[url('/blog.jpg')] shadow-b-md dark:bg-gray-900 dark:text-white bg-white flex items-center justify-center bg-cover bg-center">
        <h1 className="text-4xl font-heebo  font-extrabold text-black rounded-xl px-4 bg-amber-50 ">Blogs Post</h1>
      </div>
      <div className="bg-gray-50 dark:bg-black dark:text-white ">
        {/* BlogsPage component, which now includes the sidebar */}
        <BlogsPage />
      </div>
    </div>
  );
}
