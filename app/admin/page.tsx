"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { uploadImageToCloudinary, createBlog } from "@/lib/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaX } from "react-icons/fa6";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.string().optional(),
  image: z.instanceof(FileList).optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type SubmissionStatus = "idle" | "success" | "error";

const CreatePostForm = () => {
  const router = useRouter();
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      description: "",
    },
  });
 
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    form.setValue("image", e.target.files as FileList);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (values: FormValues) => {
    setStatus("idle");
    setUploading(true);

    try {
      let imageUrl: string | null = null;

      if (values.image?.length) {
        imageUrl = await uploadImageToCloudinary(values.image[0]);
        if (!imageUrl) {
          toast.error("Failed to upload image");
          setStatus("error");
          return;
        }
      }

      const { error } = await createBlog({
        title: values.title,
        description: values.description,
        image: imageUrl,
        Catagory: values.category || "",
      });

      if (error) {
        throw new Error(error);
      }

      toast.success("Blog post created successfully!");
      form.reset();
      setImagePreview(null);
      setStatus("success");
      router.push("/Blog");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      setStatus("error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-24 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
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
                name="category"
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
                render={() => (
                  <FormItem>
                    <FormLabel>Featured Image</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {imagePreview && (
                          <div className="mt-2 relative group">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="rounded-md max-h-[80px] object-cover w-[80px]"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 cursor-pointer opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault();
                                setImagePreview(null);
                                form.setValue("image", undefined);
                              }}
                            >
                              <FaX />
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Description</FormLabel>
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="h-full">
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Write your blog post content here..."
                        className="w-full p-4 border rounded-md bg-card min-h-[240px] focus:outline-none focus:ring-2 focus:ring-primary resize-y h-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={status !== "idle" || uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : status === "success" ? (
                "Success!"
              ) : (
                "Publish Post"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreatePostForm;
