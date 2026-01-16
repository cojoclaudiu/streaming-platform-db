import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDatabase();
    const movies = await db
      .collection("media")
      .find({ type: "movie" })
      .sort({ release_date: -1 })
      .toArray();

    return NextResponse.json(movies);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
}
