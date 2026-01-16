import { useQuery } from "@tanstack/react-query";
import { fetchMediaById } from "@/lib/media/fetch-media-by-id";
import type { MediaFormData } from "@/types/media-form";
import { Media } from "@/lib/types";

function normalizeMediaForForm(media: Media): MediaFormData {
  return {
    ...media,

    release_date: new Date(media.release_date).toISOString().split("T")[0],

    duration: media.duration !== undefined ? String(media.duration) : undefined,

    number_of_seasons:
      media.number_of_seasons !== undefined
        ? String(media.number_of_seasons)
        : undefined,

    actors: media.actors.map((actor) => ({
      ...actor,
      date_of_birth: actor.date_of_birth
        ? new Date(actor.date_of_birth).toISOString().split("T")[0]
        : "",
    })),
  };
}

export function useMediaById(id?: string) {
  return useQuery<MediaFormData>({
    queryKey: ["media", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const media = await fetchMediaById(id!);
      return normalizeMediaForForm(media);
    },
  });
}
