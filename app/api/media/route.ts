import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { buildMediaFilter } from "@/lib/build-media-filter";

// GET all media (with search & filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get("q") ?? undefined;
    const type = searchParams.get("type") as "movie" | "series" | undefined;

    const db = await getDatabase();

    const filter = buildMediaFilter({ type, q });

    const media = await db
      .collection("media")
      .find(filter)
      .sort({ release_date: -1 })
      .toArray();

    return NextResponse.json(media);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// POST new media
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    // Get the next media_id
    const lastMedia = await db
      .collection("media")
      .find()
      .sort({ media_id: -1 })
      .limit(1)
      .toArray();

    const nextMediaId = lastMedia.length > 0 ? lastMedia[0].media_id + 1 : 1;

    const newMedia = {
      media_id: nextMediaId,
      ...body,
      release_date: new Date(body.release_date),
    };

    await db.collection("media").insertOne(newMedia);

    return NextResponse.json(newMedia, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create media" },
      { status: 500 }
    );
  }
}
