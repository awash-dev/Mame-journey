"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FaFolder } from "react-icons/fa";

import { getBlogs, Post } from "@/lib/action"; // Assuming getBlogs is in "@/lib/actions"

// Helper function to strip Markdown and truncate for card description by WORD count
const getExcerpt = (markdown: string | undefined, wordLimit: number = 25) => {
  if (!markdown) return "";
  // A very basic way to strip markdown for an excerpt.
  // For production, consider a more robust markdown-to-plain-text utility.
  const plainText = markdown.replace(/[`*#_~]/g, "").replace(/\n/g, " ");

  const words = plainText.split(/\s+/); // Split by one or more spaces
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return plainText;
};

const BlogCard = ({ post }: { post: Post }) => {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 ",
        "border border-gray-800 shadow-lg hover:shadow-xl",
        "bg-card text-card-foreground",
        " hover:border-indigo-500/50 flex flex-col"
      )}
    >
      <div className="relative">
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg -mt-10 "
          />
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{getExcerpt(post.title, 15)}</CardTitle>
        
                {/*   <CardDescription className="text-muted-foreground">
 Display a plain text excerpt of the description with a 25-word limit
          {getExcerpt(post.description, 15)} 
        </CardDescription> */}
        
      </CardHeader>
    
       <CardHeader>
        <CardDescription className="flex items-center gap-4 ">
          <FaFolder className="text-[20px]" /> {post.Catagory}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-end">
        <a
          href={`/post/${post.id}`} // Ensure this path matches your dynamic route
          className={cn(
            "w-full bg-indigo-500/90 text-white hover:bg-indigo-500",
            "transition-colors duration-200",
            "border-0 shadow-md hover:shadow-lg",
            "inline-flex items-center justify-center py-2 px-4 rounded"
          )}
        >
          Read More
        </a>
      </CardContent>
    </Card>
  );
};

const BlogsPage = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const categories = [
    ...new Set(allPosts.map((post) => post.Catagory).filter(Boolean)), // Extract categories from fetched data
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // Adjust as needed

  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.Catagory === selectedCategory)
    : allPosts;

  // Re-fetch blogs function (moved from useEffect for reusability)
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const { data, error } = await getBlogs();
      if (data) {
        setAllPosts(data);
      }
      if (error) {
        setError(error);
      }
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]); // Now depends on fetchBlogs

  useEffect(() => {
    setCurrentPage(1); // Reset page when category changes
  }, [selectedCategory]);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="relative">
          {/* Spinner circle */}
          <div className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          {/* Centered text inside spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-bold text-indigo-600">Loading</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State with Refresh Button
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <p className="text-lg mb-4">Error loading blogs: {error}</p>
        <button
          onClick={fetchBlogs} // Call fetchBlogs again on click
          className="px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* Category Sidebar */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-20 h-fit">
          <Card className=" shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "w-full justify-start text-foreground hover:text-white",
                    "hover:bg-indigo-500/20 transition-colors duration-200",
                    selectedCategory === null
                      ? "bg-indigo-500/90 text-white font-semibold"
                      : "hover:bg-indigo-500/20"
                  )}
                >
                  <FaFolder className="mr-2 h-4 w-4" />
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "ghost"
                    }
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "w-full justify-start text-foreground hover:text-white",
                      "hover:bg-indigo-500/20 transition-colors duration-200",
                      selectedCategory === category
                        ? "bg-indigo-500/90 text-white font-semibold"
                        : "hover:bg-indigo-500/20"
                    )}
                  >
                    <FaFolder className="mr-2 h-4 w-4" />
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Blog Post Grid */}
        <main className="flex-1 w-full">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
            Latest Blogs
          </h1>
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8",
              "w-full"
            )}
          >
            {currentPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <BlogCard post={post} />
              </motion.div>
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <div className="text-center text-muted-foreground py-8 col-span-full">
              No posts found{" "}
              {selectedCategory
                ? `in the "${selectedCategory}" category`
                : "yet"}
              .
            </div>
          )}

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    {currentPage > 1 && (
                      <PaginationPrevious
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      />
                    )}
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={() => paginate(pageNumber)}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    {currentPage < totalPages && (
                      <PaginationNext
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                      />
                    )}
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BlogsPage;
