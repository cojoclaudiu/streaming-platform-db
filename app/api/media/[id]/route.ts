import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// GET single media
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const mediaId = parseInt(id);

    if (isNaN(mediaId)) {
      return NextResponse.json({ error: "Invalid media id" }, { status: 400 });
    }

    const media = await db.collection("media").findOne({ media_id: mediaId });

    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error("Error fetching media:", error);
    return NextResponse.json(
      { error: "Failed to fetch media" },
      { status: 500 }
    );
  }
}

// PUT update media
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();
    const mediaId = parseInt(id);

    if (isNaN(mediaId)) {
      return NextResponse.json({ error: "Invalid media id" }, { status: 400 });
    }

    const updateData = {
      ...body,
      release_date: new Date(body.release_date),
    };

    delete updateData._id;
    delete updateData.media_id;

    const result = await db
      .collection("media")
      .updateOne({ media_id: mediaId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating media:", error);
    return NextResponse.json(
      { error: "Failed to update media" },
      { status: 500 }
    );
  }
}

// DELETE media
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const mediaId = parseInt(id);

    if (isNaN(mediaId)) {
      return NextResponse.json({ error: "Invalid media id" }, { status: 400 });
    }

    const result = await db
      .collection("media")
      .deleteOne({ media_id: mediaId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    return NextResponse.json(
      { error: "Failed to delete media" },
      { status: 500 }
    );
  }
}
