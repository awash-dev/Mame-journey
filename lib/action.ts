"use server";

import { db } from "@/db/drizzle";
import { post, Post } from "@/db/schema"; // Import schema and types
import { eq } from "drizzle-orm";

export async function getBlogs(): Promise<{
  data: Post[] | null;
  error: string | null;
}> {
  try {
    const blogs = await db.select().from(post);
    return { data: blogs, error: null };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { data: null, error: "Failed to fetch blogs" };
  }
}

export async function createBlog(
  newPostData: {
    title: string;
    description?: string;
    image?: string | null;
    Catagory: string;
  }
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const now = Math.floor(Date.now() / 1000); // Get current timestamp in seconds

    const insertData: any = {
      title: newPostData.title,
      Catagory: newPostData.Catagory,
      createdAt: now, // Set default createdAt
      updatedAt: now, // Set default updatedAt
    };
    if (typeof newPostData.description !== "undefined") {
      insertData.description = newPostData.description;
    }
    if (typeof newPostData.image !== "undefined") {
      insertData.image = newPostData.image;
    }

    const [createdBlog] = await db.insert(post).values(insertData).returning();

    return { data: createdBlog, error: null };
  } catch (error) {
    console.error("Error creating blog:", error);
    return { data: null, error: "Failed to create blog" };
  }
}

export async function getBlogById(
  id: number
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const blog = await db
      .select()
      .from(post)
      .where(eq(post.id, id))
      .limit(1)
      .execute();

    if (blog.length === 0) {
      return { data: null, error: "Blog not found" };
    }

    return { data: blog[0], error: null };
  } catch (error) {
    console.error(`Error fetching blog with id ${id}:`, error);
    return { data: null, error: `Failed to fetch blog with id ${id}` };
  }
}

export async function updateBlogById(
  id: number,
  updatedPost: Partial<Post>
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const now = Math.floor(Date.now() / 1000); // Update timestamp
    const [updatedBlog] = await db
      .update(post)
      .set({ ...updatedPost, updatedAt: now })
      .where(eq(post.id, id))
      .returning();

    if (!updatedBlog) {
      return { data: null, error: "Blog not found for update" };
    }

    return { data: updatedBlog, error: null };
  } catch (error) {
    console.error(`Error updating blog with id ${id}:`, error);
    return { data: null, error: `Failed to update blog with id ${id}` };
  }
}

export async function deleteBlogById(
  id: number
): Promise<{ data: Post | null; error: string | null }> {
  try {
    const [deletedBlog] = await db
      .delete(post)
      .where(eq(post.id, id))
      .returning();

    if (!deletedBlog) {
      return { data: null, error: "Blog not found for deletion" };
    }

    return { data: deletedBlog, error: null };
  } catch (error) {
    console.error(`Error deleting blog with id ${id}:`, error);
    return { data: null, error: `Failed to delete blog with id ${id}` };
  }
}

export type { Post };