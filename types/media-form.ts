import type { Media, Actor } from "@/lib/types";

export type MediaFormData = Omit<
  Media,
  "release_date" | "duration" | "number_of_seasons" | "actors" | "media_id"
> & {
  media_id?: number;
  release_date: string;
  duration?: string;
  number_of_seasons?: string;
  actors: Array<
    Omit<Actor, "date_of_birth"> & {
      date_of_birth: string;
    }
  >;
};
