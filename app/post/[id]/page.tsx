"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getBlogById, Post } from "@/lib/action"; // Adjust import path as needed
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; 
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

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

  if (loading) {
    return <div className="py-12 text-center">Loading blog post...</div>;
  }

  if (error) {
    return (
      <div className="py-12 text-center text-red-500">
        Error loading blog post: {error}
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
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <Link
          href="/Blog"
          className="inline-flex items-center mb-4 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Link>
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              {blogPost.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blogPost.image && (
              <div className="relative w-full overflow-hidden rounded-md aspect-video">
                <img
                  src={blogPost.image}
                  alt={blogPost.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <CardDescription className="text-gray-600">
              {blogPost.description}
            </CardDescription>
            <p className="text-sm text-gray-500">
              Category: {blogPost.Catagory}
            </p>
            {blogPost.createdAt && (
              <p className="text-sm text-gray-500">
                Created At:{" "}
                {new Date(blogPost.createdAt * 1000).toLocaleDateString()}
              </p>
            )}
            {blogPost.updatedAt && (
              <p className="text-sm text-gray-500">
                Updated At:{" "}
                {new Date(blogPost.updatedAt * 1000).toLocaleDateString()}
              </p>
            )}
            {blogPost.authorId && (
              <p className="text-sm text-gray-500">
                Author ID: {blogPost.authorId}
              </p>
            )}
            {/* Add more details here as needed */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
