"use client";
import React, { useState, useEffect } from "react";
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

// Dummy blog post data (replace with your actual data)
const blogPosts = [
  {
    id: 1,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "The Future of AI in Finance",
    description:
      "Explore how AI is transforming the finance industry, from algorithmic trading to personalized financial advice.",
    readMoreLink: "/blog/finance/ai-in-finance",
    category: "Finance",
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "Marketing in the Digital Age",
    description:
      "Discover the latest digital marketing strategies and techniques to reach your target audience and grow your business.",
    readMoreLink: "/blog/marketing/digital-marketing",
    category: "Marketing",
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "Mastering React Hooks",
    description:
      "A deep dive into React Hooks, with practical examples and best practices for managing state and side effects.",
    readMoreLink: "/blog/programming/react-hooks",
    category: "Programming",
  },
  {
    id: 4,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "Financial Planning for Startups",
    description:
      "Learn how to create a solid financial plan for your startup, including budgeting, forecasting, and fundraising.",
    readMoreLink: "/blog/finance/startup-finance",
    category: "Finance",
  },
  {
    id: 5,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "SEO Best Practices 2024",
    description:
      "Stay ahead of the curve with the latest SEO best practices and strategies to improve your website ranking.",
    readMoreLink: "/blog/marketing/seo-2024",
    category: "Marketing",
  },
  {
    id: 6,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "Advanced JavaScript Concepts",
    description:
      "Explore advanced JavaScript concepts such as closures, prototypes, async/await, and more.",
    readMoreLink: "/blog/programming/js-advanced",
    category: "Programming",
  },
  {
    id: 7,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "Algorithmic Trading Strategies",
    description:
      "Explore different algorithmic trading strategies used in the finance industry.",
    readMoreLink: "/blog/finance/algorithmic-trading",
    category: "Finance",
  },
  {
    id: 8,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "Email Marketing Best Practices",
    description: "Learn how to create effective email marketing campaigns.",
    readMoreLink: "/blog/marketing/email-marketing",
    category: "Marketing",
  },
  {
    id: 9,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "Clean Code Principles",
    description:
      "Understand the importance of writing clean and maintainable code.",
    readMoreLink: "/blog/programming/clean-code",
    category: "Programming",
  },
  {
    id: 10,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "10x Your Productivity",
    description: "Tips and tricks to boost your productivity.",
    readMoreLink: "/blog/productivity",
    category: "General",
  },
  {
    id: 11,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "The Art of Negotiation",
    description: "Learn effective negotiation techniques.",
    readMoreLink: "/blog/negotiation",
    category: "Business",
  },
  {
    id: 12,
    imageUrl: "https://placehold.co/400x200/EEE/31343C",
    title: "Understanding Quantum Computing",
    description: "A beginner's guide to quantum computing.",
    readMoreLink: "/blog/quantum-computing",
    category: "Technology",
  },
];

const BlogCard = ({ post }: { post: (typeof blogPosts)[0] }) => {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300",
        "border border-gray-800 shadow-lg hover:shadow-xl",
        "bg-card text-card-foreground",
        " hover:border-indigo-500/50 flex flex-col"
      )}
    >
      <div className="relative">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover rounded-t-lg -mt-10 "
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{post.title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {post.description}
        </CardDescription>
      </CardHeader>
      <CardHeader>
        <CardDescription className="flex items-center gap-4 ">
          <FaFolder className="text-[20px]" /> {post.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <a
          href={post.readMoreLink}
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
  const categories = [
    "Finance",
    "Marketing",
    "Programming",
    "General",
    "Business",
    "Technology",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const [filteredPosts, setFilteredPosts] = useState(blogPosts);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredPosts(
        blogPosts.filter((post) => post.category === selectedCategory)
      );
    } else {
      setFilteredPosts(blogPosts);
    }
    setCurrentPage(1);
  }, [selectedCategory]);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="py-12 bg-background">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
        {/* Category Sidebar */}
        <aside className="w-full lg:w-64 lg:sticky lg:top-20 h-fit">
          <Card className="  shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8",
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
              No posts found in this category.
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
