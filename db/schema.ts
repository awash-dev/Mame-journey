import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { InferModel } from "drizzle-orm";

export const post = pgTable("post", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 5000 }).notNull(),
  image: varchar({ length: 5000 }),
  Catagory: varchar({ length: 255 }).notNull(),
  createdAt: integer(),
  updatedAt: integer(),
  authorId: integer(),
});

// Define types for your schema
export type Post = InferModel<typeof post>;
export type NewPost = InferModel<typeof post, "insert">;