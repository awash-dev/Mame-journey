"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
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
import { uploadImageToCloudinary, createBlog } from "@/lib/action";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "sonner";
import { Loader2, Copy, Check } from "lucide-react";

// Markdown editor and preview
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.string().optional(),
  image: z.any().optional(),
  description: z.string().optional(),
});

interface FormData extends z.infer<typeof formSchema> {}

const CreatePostForm = () => {
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      image: null,
      description: "",
    },
  });

  const router = useRouter();
  const descriptionContent = form.watch("description");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", [file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: FormData) => {
    setSubmissionStatus("idle");
    setUploadingImage(true);
    let imageUrl: string | null = null;

    try {
      if (values.image && values.image.length > 0) {
        imageUrl = await uploadImageToCloudinary(values.image[0]);
        if (!imageUrl) {
          toast.error("Failed to upload image");
          setSubmissionStatus("error");
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
        toast.error("Failed to create blog");
        setSubmissionStatus("error");
      } else {
        toast.success("Blog post created successfully!");
        form.reset();
        setImagePreview(null);
        setSubmissionStatus("success");
        router.push("/blog");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      setSubmissionStatus("error");
    } finally {
      setUploadingImage(false);
      setTimeout(() => setSubmissionStatus("idle"), 3000);
    }
  };

  const mdeOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: "Write your blog post content here using Markdown...",
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "guide",
      ] as const,
      status: false,
    };
  }, []);

  const handleCopy = () => {
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                render={({ field }) => (
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
                              className="rounded-md max-h-60 object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault();
                                setImagePreview(null);
                                form.setValue("image", null);
                              }}
                            >
                              Remove
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

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel>Description</FormLabel>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    {previewMode ? "Edit" : "Preview"}
                  </Button>
                  {descriptionContent && (
                    <CopyToClipboard
                      text={descriptionContent}
                      onCopy={handleCopy}
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </CopyToClipboard>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {previewMode ? (
                        <div className="prose dark:prose-invert max-w-none p-4 border rounded-md bg-card min-h-[300px]">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}
                            components={{
                              code({ node, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return !inline && match ? (
                                  <div className="relative">
                                    <CopyToClipboard
                                      text={String(children).replace(/\n$/, "")}
                                      onCopy={() =>
                                        toast.success("Code copied!")
                                      }
                                    >
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-2 top-2 opacity-80 hover:opacity-100"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </CopyToClipboard>
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  </div>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {field.value || "*Nothing to preview*"}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <SimpleMDE
                          value={field.value || ""}
                          onChange={field.onChange}
                          options={mdeOptions}
                          className="min-h-[300px]"
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submissionStatus !== "idle" || uploadingImage}
            >
              {uploadingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : submissionStatus === "success" ? (
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
