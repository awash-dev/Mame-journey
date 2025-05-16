import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.string().optional(),
  description: z.string().optional(),
  imgUrl: z.string().optional(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Request Method:", req.method);
  console.log("Request Body:", req.body);

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const validatedData = formSchema.parse(req.body);
    const { title, tags, description, imgUrl } = validatedData;

    const newEntry = await prisma.entry.create({
      data: {
        title,
        tags,
        description,
        imgUrl,
      },
    });

    res.status(201).json({
      message: "Data saved successfully!",
      data: newEntry,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid data provided.",
        details: error.errors,
      });
    } else if (error.code === "P2002") {
      return res.status(409).json({
        error: "Title must be unique",
      });
    }
    console.error("Error saving data:", error);
    res.status(500).json({
      error: "Failed to save data.",
      details: error.message || "An unexpected error occurred.",
    });
  } finally {
    await prisma.$disconnect();
  }
}
