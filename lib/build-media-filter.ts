import { Filter, Document } from "mongodb";

export function buildMediaFilter({
  type,
  q,
}: {
  type?: "movie" | "series";
  q?: string;
}): Filter<Document> {
  const filter: Filter<Document> = {};

  if (type) {
    filter.type = type;
  }

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { language: { $regex: q, $options: "i" } },
    ];
  }

  return filter;
}
