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

import { getBlogs, Post } from "@/lib/action";

// Strip Markdown + make excerpt
const getExcerpt = (markdown: string | undefined, wordLimit: number = 25) => {
  if (!markdown) return "";
  const plainText = markdown.replace(/[`*#_~]/g, "").replace(/\n/g, " ");
  const words = plainText.split(/\s+/);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : plainText;
};

// Blog Card
const BlogCard = ({ post }: { post: Post }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="h-full"
    >
      <Card
        className={cn(
          "overflow-hidden rounded-2xl flex flex-col h-full shadow-md",
          "transition-all duration-300 border hover:border-indigo-500/50 hover:shadow-xl"
        )}
      >
        {/* Image with overlay */}
        {post.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent"></div>
          </div>
        )}

        <CardHeader className="space-y-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {post.title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 line-clamp-2">
            {getExcerpt(post.description, 18)}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-auto flex flex-col gap-3">
          <p className="flex items-center gap-2 text-xs text-gray-400">
            <FaFolder /> {post.Catagory}
          </p>
          <a
            href={`/post/${post.id}`}
            className={cn(
              "w-full bg-indigo-500/90 text-white hover:bg-indigo-600",
              "transition-colors duration-200 shadow-md hover:shadow-lg",
              "inline-flex items-center justify-center py-2 px-4 rounded-lg text-sm font-medium"
            )}
          >
            Read More
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const BlogsPage = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 6;

  // Extract unique categories
  const categories = [
    ...new Set(allPosts.map((post) => post.Catagory).filter(Boolean)),
  ];

  const filteredPosts = selectedCategory
    ? allPosts.filter((post) => post.Catagory === selectedCategory)
    : allPosts;

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await getBlogs();
      if (data) setAllPosts(data);
      if (error) setError(error);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = filteredPosts.slice(
    indexOfLastPost - postsPerPage,
    indexOfLastPost
  );
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="h-16 w-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-600 font-medium">Loading Blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <p className="text-lg mb-4">⚠️ Error loading blogs: {error}</p>
        <Button onClick={fetchBlogs} className="bg-red-600 hover:bg-red-700">
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-10">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-20 h-fit">
          <Card className="shadow-md rounded-xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Categories</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="rounded-full"
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Blog Grid */}
        <main className="flex-1 w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground">Latest Blogs</h1>
            <p className="text-muted-foreground mt-2">
              Discover articles, tutorials, and stories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No posts found{" "}
              {selectedCategory ? `in "${selectedCategory}"` : "yet"}.
            </div>
          )}

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <div className="flex justify-center mt-10">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      />
                    </PaginationItem>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                        }
                      />
                    </PaginationItem>
                  )}
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