"use client";
import React, { useState, useEffect } from "react";
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
import { getBlogs, Post, deleteBlogById } from "@/lib/action";
import { FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";

const BlogsPage = () => {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await getBlogs();
        if (data) setAllPosts(data);
        if (fetchError) setError(fetchError);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogById(Number(postId));
        setAllPosts(allPosts.filter((post) => String(post.id) !== postId));
      } catch {
        setError("Failed to delete the blog post.");
      }
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(allPosts.length / postsPerPage);

  if (loading) return <div className="py-12 text-center">Loading blogs...</div>;
  if (error)
    return (
      <div className="py-12 text-center text-red-500">
        Error loading blogs: {error}
      </div>
    );

  return (
    <div className="py-2 bg-background mt-24">
      <div className="container mx-auto px-4 gap-8">
        <main className="w-full ">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentPosts.map((post) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {post.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-20 h-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(String(post.id))}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash size={16} />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {allPosts.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No posts found.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={cn(currentPage === 1 && "opacity-50 pointer-events-none")}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, index) => {
                    const page = index + 1;
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={cn(currentPage === totalPages && "opacity-50 pointer-events-none")}
                    />
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
