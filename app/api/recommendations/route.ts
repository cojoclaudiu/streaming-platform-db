import { getDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDatabase();
    const recommendations = await db
      .collection("recommendations")
      .aggregate([
        {
          $lookup: {
            from: "media",
            localField: "from_media_id",
            foreignField: "media_id",
            as: "source_media",
          },
        },
        {
          $lookup: {
            from: "media",
            localField: "to_media_id",
            foreignField: "media_id",
            as: "recommended_media",
          },
        },
        { $unwind: "$source_media" },
        { $unwind: "$recommended_media" },
        {
          $project: {
            _id: 1,
            from_media_id: 1,
            to_media_id: 1,
            source_title: "$source_media.title",
            source_type: "$source_media.type",
            recommended_title: "$recommended_media.title",
            recommended_type: "$recommended_media.type",
          },
        },
      ])
      .toArray();

    return NextResponse.json(recommendations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
