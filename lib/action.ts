"use server";

import { v2 as cloudinary } from "cloudinary";
import { db } from "@/db/drizzle";
import { post, Post } from "@/db/schema"; // Import schema and types
import { eq } from "drizzle-orm";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

export async function uploadImageToCloudinary(
  file: File
): Promise<string | null> {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const base64Image = Buffer.from(bytes).toString("base64");
    const dataURI = `data:${file.type};base64,${base64Image}`;

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(dataURI, (error, uploadResult) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        }
        resolve(uploadResult?.secure_url);
      });
    });

    return result as string | null;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}

export async function createBlog(newPostData: {
  title: string;
  description?: string;
  image?: string | null; // This will be the Cloudinary URL
  Catagory: string;
}): Promise<{ data: Post | null; error: string | null }> {
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
