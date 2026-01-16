import { Media } from "@/lib/types";

interface FetchMediaArgs {
  type?: "movie" | "series";
  q?: string;
}

export async function fetchMedia({
  type,
  q,
}: FetchMediaArgs): Promise<Media[]> {
  const params = new URLSearchParams();

  if (type) params.set("type", type);
  if (q) params.set("q", q);

  const res = await fetch(`/api/media?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Failed to fetch media");
  }

  return res.json();
}
