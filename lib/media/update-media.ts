import type { Media } from "@/lib/types";

export async function updateMedia(
  id: string,
  payload: Partial<Media>
): Promise<Media> {
  const res = await fetch(`/api/media/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to update media");
  }

  return res.json();
}
