"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { uploadImageToCloudinary, createBlog } from "@/lib/action"; // Ensure correct import path

// Define your form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  Catagory: z.string().optional(),
  image: z.any().optional(), // Will hold the File object
  description: z.string().optional(),
});

interface FormData extends z.infer<typeof formSchema> {}

const CreatePostForm = () => {
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadingImage, setUploadingImage] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      Catagory: "",
      image: null,
      description: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (values: FormData) => {
    setSubmissionStatus("idle");
    setUploadingImage(true);
    let imageUrl: string | null = null;

    if (values.image && values.image.length > 0) {
      imageUrl = await uploadImageToCloudinary(values.image[0]);
      setUploadingImage(false);
      if (!imageUrl) {
        setSubmissionStatus("error");
        return;
      }
    } else {
      setUploadingImage(false); // No image selected
    }

    try {
      const { error } = await createBlog({
        title: values.title,
        description: values.description,
        image: imageUrl, // This will be the Cloudinary URL (or null if no image)
        Catagory: values.Catagory || "",
      });

      if (error) {
        console.error("Failed to create blog:", error);
        setSubmissionStatus("error");
      } else {
        console.log("Blog post created successfully!");
        form.reset();
        setSubmissionStatus("success");
        router.push("/blogs");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setSubmissionStatus("error");
    } finally {
      setTimeout(() => setSubmissionStatus("idle"), 3000);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex items-center justify-center flex-col"
      >
        <div className="flex flex-col w-[350px] gap-y-4 bg-gray-50 p-4 rounded-md dark:bg-gray-900 mb-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="Catagory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={submissionStatus !== "idle" || uploadingImage}
          >
            {uploadingImage
              ? "Uploading Image..."
              : submissionStatus === "idle"
              ? "Submit"
              : submissionStatus === "success"
              ? "Success!"
              : "Submitting..."}
          </Button>

          {submissionStatus === "error" && (
            <p className="text-red-500 text-sm">
              Failed to create blog post. Please try again.
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CreatePostForm;
