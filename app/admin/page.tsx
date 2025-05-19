"use client";

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
import { useRouter } from "next/navigation";
import { createBlog, Post } from "@/lib/action";

// Define the form data type to match your backend
type FormData = {
  title: string;
  category: string;
  image: FileList | null;
  description: string;
};

const CreatePostForm = () => {
  const form = useForm<FormData>({
    defaultValues: {
      title: "",
      category: "",
      image: null,
      description: "",
    },
  });
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      // Prepare the payload to match your backend (Catagory, not category)
      const payload = {
        title: data.title,
        Catagory: data.category,
        description: data.description,
        image:
          data.image && data.image.length > 0
            ? await toBase64(data.image[0])
            : null,
      };
      await createBlog(payload);
      router.push("/Blog");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  // Helper to convert file to base64 string (or handle as needed)
  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  return (
    <Form {...form}>
      <form
        className="space-y-4 flex items-center justify-center flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
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
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
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
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create Post</Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatePostForm;
