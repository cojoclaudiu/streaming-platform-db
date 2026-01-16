import { updateMedia } from "@/lib/media/update-media";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MediaFormData } from "@/types/media-form";
import type { Media } from "@/lib/types";

export function useUpdateMedia(mediaId: string) {
  const queryClient = useQueryClient();

  return useMutation<Media, Error, MediaFormData>({
    mutationFn: async (formData) => {
      return updateMedia(mediaId, {
        ...formData,

        release_date: new Date(formData.release_date),

        duration:
          formData.duration !== undefined && formData.duration !== ""
            ? Number(formData.duration)
            : undefined,

        number_of_seasons:
          formData.number_of_seasons !== undefined &&
          formData.number_of_seasons !== ""
            ? Number(formData.number_of_seasons)
            : undefined,

        actors: formData.actors.map((actor) => ({
          ...actor,
          date_of_birth: new Date(actor.date_of_birth),
        })),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["media", mediaId] });
    },
  });
}
