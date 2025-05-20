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
import { FaFolder, FaUserCircle } from "react-icons/fa";

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
    <div className=" py-6 bg-background ">
      <div className=" mx-auto px-14 w-full">
        <Link
          href="/Blog"
          className="fixed items-center  flex text-lg font-medium hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
        </Link>
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
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
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {blogPost.title}
              </CardTitle>
            </CardHeader>

            <div className="flex gap-4">
              <p className="text-sm text-gray-500 flex">
                <FaFolder className="mr-2 h-4 w-4" /> {blogPost.Catagory}
              </p>

              {blogPost.createdAt && (
                <p className="text-sm text-gray-500">
                  {new Date(blogPost.createdAt * 1000).toLocaleDateString()}
                </p>
              )}
              {blogPost.authorId && (
                <p className="text-sm text-gray-500">
                  <FaUserCircle className="text-sm text-gray-500 " />{" "}
                  {blogPost.authorId}
                </p>
              )}
            </div>
            <CardDescription className="text-gray-600">
              {blogPost.description}
            </CardDescription>

            {/* Add more details here as needed */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
