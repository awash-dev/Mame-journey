"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getBlogById, getBlogs, Post } from "@/lib/action"; 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FaFolder, FaUserCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BlogPostPage() {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      if (id) {
        setLoading(true);
        const postId = parseInt(id as string, 10);
        const { data, error } = await getBlogById(postId);

        if (data) {
          setBlogPost(data);
          setLoading(false);
        }

        if (error) {
          setError(error);
          setLoading(false);
        }
      }
    };

    fetchBlogPost();
  }, [id]);

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-500">
        <p className="text-lg font-medium mb-4">⚠️ Error loading blog: {error}</p>
        <button
          onClick={getBlogs}
          className="px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="py-12 text-center text-gray-500">
        Blog post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Link
          href="/Blog"
          className="flex items-center text-sm font-medium text-indigo-600 hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Link>
      </div>

      {/* Hero Image */}
      {blogPost.image && (
        <div className="relative w-full max-h-[450px] overflow-hidden">
          <img
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full h-[450px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {blogPost.title}
            </h1>
          </div>
        </div>
      )}

      {/* Blog Content */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto px-6 py-10"
      >
        <Card className="shadow-xl border-0">
          <CardContent className="space-y-6">
            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-gray-500 text-sm">
              <span className="flex items-center gap-2">
                <FaFolder /> {blogPost.Catagory}
              </span>
              {blogPost.createdAt && (
                <span>
                  {new Date(blogPost.createdAt * 1000).toLocaleDateString()}
                </span>
              )}
              {blogPost.authorId && (
                <span className="flex items-center gap-2">
                  <FaUserCircle /> {blogPost.authorId}
                </span>
              )}
            </div>

            {/* Description / Body */}
            <CardDescription className="text-gray-700 leading-relaxed text-lg">
              {blogPost.description}
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}