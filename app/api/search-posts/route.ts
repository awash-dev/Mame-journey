import { NextResponse } from "next/server";
import { searchBlogs } from "@/lib/action"; // your search function

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    const res = NextResponse.json(
      { data: [], error: "Query parameter is missing" },
      { status: 400 }
    );
    res.headers.set("Access-Control-Allow-Origin", "*"); // allow RN fetch
    return res;
  }

  try {
    const { data: results, error } = await searchBlogs(query);

    if (error) {
      console.error("Error from searchBlogs:", error);
      const res = NextResponse.json({ data: [], error }, { status: 500 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }

    const res = NextResponse.json({ data: results, error: null });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  } catch (err: any) {
    console.error("Unexpected API error:", err);
    const res = NextResponse.json(
      { data: [], error: "Unexpected server error" },
      { status: 500 }
    );
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }
}