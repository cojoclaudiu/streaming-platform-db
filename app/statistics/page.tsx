import { getDatabase } from "@/lib/mongodb";
import { BarChart3, TrendingUp, Star } from "lucide-react";

interface GenreStats {
  genre: string;
  total_productions: number;
  movies_count: number;
  series_count: number;
  avg_movie_duration: number | null;
}

interface TopRated {
  media_id: number;
  title: string;
  type: string;
  avg_rating: number;
  review_count: number;
}

async function getStatistics(): Promise<{
  genreStats: GenreStats[];
  topRated: TopRated[];
}> {
  const db = await getDatabase();

  const [genreStats, topRated] = await Promise.all([
    db
      .collection("media")
      .aggregate([
        { $unwind: "$genres" },
        {
          $group: {
            _id: "$genres.name",
            total_productions: { $sum: 1 },
            movies_count: {
              $sum: { $cond: [{ $eq: ["$type", "movie"] }, 1, 0] },
            },
            series_count: {
              $sum: { $cond: [{ $eq: ["$type", "series"] }, 1, 0] },
            },
            avg_movie_duration: {
              $avg: {
                $cond: [{ $eq: ["$type", "movie"] }, "$duration", null],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            genre: "$_id",
            total_productions: 1,
            movies_count: 1,
            series_count: 1,
            avg_movie_duration: { $round: ["$avg_movie_duration", 0] },
          },
        },
        { $sort: { total_productions: -1 } },
      ])
      .toArray(),

    db
      .collection("users")
      .aggregate([
        { $unwind: "$ratings" },
        {
          $group: {
            _id: "$ratings.media_id",
            avg_rating: { $avg: "$ratings.rating" },
            review_count: { $sum: 1 },
          },
        },
        { $match: { avg_rating: { $gte: 9 } } },
        {
          $lookup: {
            from: "media",
            localField: "_id",
            foreignField: "media_id",
            as: "media_info",
          },
        },
        { $unwind: "$media_info" },
        {
          $project: {
            _id: 0,
            media_id: "$_id",
            title: "$media_info.title",
            type: "$media_info.type",
            avg_rating: { $round: ["$avg_rating", 2] },
            review_count: 1,
          },
        },
        { $sort: { avg_rating: -1 } },
      ])
      .toArray(),
  ]);

  return {
    genreStats: JSON.parse(JSON.stringify(genreStats)),
    topRated: JSON.parse(JSON.stringify(topRated)),
  };
}

export default async function StatisticsPage() {
  const { genreStats, topRated } = await getStatistics();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b px-4 py-3 bg-background">
        <h1 className="text-sm font-semibold">statistics</h1>
        <p className="text-xs text-muted-foreground">
          Aggregated platform insights
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-8">
        {/* ================= GENRE STATS ================= */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">genre_distribution</h2>
          </div>

          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="px-4 py-2 text-left">genre</th>
                  <th className="px-4 py-2 text-right">total</th>
                  <th className="px-4 py-2 text-right">movies</th>
                  <th className="px-4 py-2 text-right">series</th>
                  <th className="px-4 py-2 text-right">avg_duration</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {genreStats.map((g) => (
                  <tr key={g.genre} className="hover:bg-accent/30">
                    <td className="px-4 py-2 font-medium">{g.genre}</td>
                    <td className="px-4 py-2 text-right font-mono">
                      {g.total_productions}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {g.movies_count}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {g.series_count}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {g.avg_movie_duration ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ================= TOP RATED ================= */}
        <section>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">top_rated_media</h2>
          </div>

          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                  <th className="px-4 py-2 text-left">title</th>
                  <th className="px-4 py-2 text-left">type</th>
                  <th className="px-4 py-2 text-right">rating</th>
                  <th className="px-4 py-2 text-right">reviews</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {topRated.map((m) => (
                  <tr key={m.media_id} className="hover:bg-accent/30">
                    <td className="px-4 py-2 font-medium">{m.title}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {m.type}
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      <div className="inline-flex items-center gap-1 justify-end">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {m.avg_rating}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-right font-mono">
                      {m.review_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
