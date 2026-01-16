import { Media } from "@/lib/types";

export async function fetchMediaById(id: string): Promise<Media> {
  const res = await fetch(`/api/media/${id}`);

  if (!res.ok) {
    throw new Error("Media not found");
  }

  return res.json();
}
