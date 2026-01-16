export interface Media {
  _id?: string;
  media_id: number;
  title: string;
  release_date: Date;
  description: string;
  type: "movie" | "series";
  language: string;
  duration?: number;
  number_of_seasons?: number;
  genres: Genre[];
  actors: Actor[];
  seasons?: Season[];
}

export interface Genre {
  genre_id: number;
  name: string;
}

export interface Actor {
  actor_id: number;
  name: string;
  date_of_birth: Date;
}

export interface Season {
  season_id: number;
  season_number: number;
  episodes: Episode[];
}

export interface Episode {
  episode_id: number;
  episode_number: number;
  title: string;
  duration: number;
  created_at: Date;
}

export interface User {
  _id?: string;
  user_id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  watchlist: WatchlistItem[];
  ratings: Rating[];
  watched_media: WatchedMedia[];
}

export interface WatchlistItem {
  media_id: number;
  status: "favorite" | "to_watch" | "unfinished";
  created_at: Date;
}

export interface Rating {
  media_id: number;
  rating: number;
  review_text: string;
  created_at: Date;
}

export interface WatchedMedia {
  media_id: number;
  view_at: Date;
}

export interface Recommendation {
  _id: string;
  from_media_id: number;
  to_media_id: number;
}
