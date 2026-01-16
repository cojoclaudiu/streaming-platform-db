"use client";

import { fetchMedia } from "@/lib/media/fetch-media";
import { useQuery } from "@tanstack/react-query";
import { parseAsString, useQueryState } from "nuqs";

export function useMediaQuery(type?: "movie" | "series") {
  const [q] = useQueryState("q", parseAsString.withDefault(""));

  return useQuery({
    queryKey: ["media", { type, q }],
    queryFn: () => fetchMedia({ type, q }),
  });
}
