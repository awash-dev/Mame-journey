import BlogPosts from "@/post/BlogPosts";
import React from "react";
import Catagory from "@/post/Catagory";

export default function Blogs() {
  return (
    <div className="">
      {/* <div className="w-full h-[150px] shadow-b-md dark:bg-gray-900 dark:text-white bg-white flex items-center justify-center ">
        <h1 className="text-4xl font-heebo">Blogs Post</h1>
      </div> */}
      <div className="bg-gray-50 dark:bg-black dark:text-white">
        {/* left side blogs  */}
        <BlogPosts />

        {/* riht side Category  */}
        <Catagory/>
      </div>
    </div>
  );
}
