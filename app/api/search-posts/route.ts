// app/api/search-posts/route.ts
import { NextResponse } from "next/server";
import { searchBlogs } from "@/lib/action"; // Import the searchBlogs action

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { data: [], error: "Query parameter is missing" },
      { status: 400 }
    );
  }

  try {
    // Call the searchBlogs action from "@/lib/action"
    const { data: results, error } = await searchBlogs(query);

    if (error) {
      console.error("Error from searchBlogs action:", error);
      return NextResponse.json({ data: [], error: error }, { status: 500 });
    }

    // The searchBlogs action already returns Post[], so no further mapping is needed
    // unless you specifically want to transform the data for the API response.
    // Assuming 'results' is already an array of Post objects or null.
    return NextResponse.json({ data: results, error: null });
  } catch (error: any) {
    console.error("API route unexpected error:", error);
    return NextResponse.json(
      { data: [], error: "An unexpected error occurred during search" },
      { status: 500 }
    );
  }
}
