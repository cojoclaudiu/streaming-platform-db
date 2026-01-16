import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDatabase();
    const topRated = await db
      .collection("users")
      .aggregate([
        { $unwind: "$ratings" },
        {
          $group: {
            _id: "$ratings.media_id",
            avg_rating: { $avg: "$ratings.rating" },
            review_count: { $sum: 1 },
          },
        },
        { $match: { avg_rating: { $gte: 9 } } },
        {
          $lookup: {
            from: "media",
            localField: "_id",
            foreignField: "media_id",
            as: "media_info",
          },
        },
        { $unwind: "$media_info" },
        {
          $project: {
            _id: 0,
            media_id: "$_id",
            title: "$media_info.title",
            type: "$media_info.type",
            avg_rating: { $round: ["$avg_rating", 2] },
            review_count: 1,
          },
        },
        { $sort: { avg_rating: -1 } },
      ])
      .toArray();

    return NextResponse.json(topRated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch top rated media" },
      { status: 500 }
    );
  }
}
