"use client";

import { useState } from "react";
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

// Define your form schema using Zod
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  tags: z.string().optional(),
  file: z.any().optional(), // Adjust based on how you want to handle files
  description: z.string().optional(),
});

interface FormData extends z.infer<typeof formSchema> {}

const MyForm = () => {
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      tags: "",
      file: null,
      description: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setSubmissionStatus("idle"); // Reset status
    console.log(values);
    try {
      const response = await fetch("/api", { // Corrected URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        console.log("Form submitted successfully!");
        form.reset(); // Reset the form using react-hook-form
        setSubmissionStatus("success");
        setTimeout(() => setSubmissionStatus("idle"), 3000); // Clear success message after 3 seconds
      } else {
        console.error("Failed to submit form.");
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setSubmissionStatus("error");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 flex items-center justify-center  flex-col"
      >
        <div className="flex  flex-col  w-[350px] gap-y-4 bg-gray-50 p-4 rounded-md dark:bg-gray-900 mb-1">
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
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input placeholder="Enter tags " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input type="file" {...field} />
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
                  <Textarea
                    placeholder="Enter description "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={submissionStatus === "idle" ? false : true}
          >
            {submissionStatus === "idle"
              ? "Submit"
              : submissionStatus === "success"
              ? "Success!"
              : "Submitting..."}
          </Button>

          {submissionStatus === "error" && (
            <p className="text-red-500 text-sm">
              Failed to submit form. Please try again.
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default MyForm;