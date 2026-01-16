import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDatabase();
    const stats = await db
      .collection("media")
      .aggregate([
        { $unwind: "$genres" },
        {
          $group: {
            _id: "$genres.name",
            total_productions: { $sum: 1 },
            movies_count: {
              $sum: { $cond: [{ $eq: ["$type", "movie"] }, 1, 0] },
            },
            series_count: {
              $sum: { $cond: [{ $eq: ["$type", "series"] }, 1, 0] },
            },
            avg_movie_duration: {
              $avg: { $cond: [{ $eq: ["$type", "movie"] }, "$duration", null] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            genre: "$_id",
            total_productions: 1,
            movies_count: 1,
            series_count: 1,
            avg_movie_duration: { $round: ["$avg_movie_duration", 0] },
          },
        },
        { $sort: { total_productions: -1 } },
      ])
      .toArray();

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch genre statistics" },
      { status: 500 }
    );
  }
}
