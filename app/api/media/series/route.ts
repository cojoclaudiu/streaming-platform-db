import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDatabase();
    const series = await db
      .collection("media")
      .find({ type: "series" })
      .sort({ title: 1 })
      .toArray();

    return NextResponse.json(series);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch series" },
      { status: 500 }
    );
  }
}
