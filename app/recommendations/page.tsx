import { getDatabase } from "@/lib/mongodb";
import { ArrowRight, GitCompare } from "lucide-react";

interface Recommendation {
  _id: string;
  from_media_id: number;
  to_media_id: number;
  source_title: string;
  source_type: string;
  recommended_title: string;
  recommended_type: string;
}

async function getRecommendations(): Promise<Recommendation[]> {
  const db = await getDatabase();

  const recommendations = await db
    .collection("recommendations")
    .aggregate([
      {
        $lookup: {
          from: "media",
          localField: "from_media_id",
          foreignField: "media_id",
          as: "source_media",
        },
      },
      {
        $lookup: {
          from: "media",
          localField: "to_media_id",
          foreignField: "media_id",
          as: "recommended_media",
        },
      },
      { $unwind: "$source_media" },
      { $unwind: "$recommended_media" },
      {
        $project: {
          _id: 1,
          from_media_id: 1,
          to_media_id: 1,
          source_title: "$source_media.title",
          source_type: "$source_media.type",
          recommended_title: "$recommended_media.title",
          recommended_type: "$recommended_media.type",
        },
      },
    ])
    .toArray();

  return JSON.parse(JSON.stringify(recommendations));
}

export default async function RecommendationsPage() {
  const recommendations = await getRecommendations();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="border-b px-4 py-3 bg-background">
        <div className="flex items-center gap-2">
          <GitCompare className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-sm font-semibold">recommendations</h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Relations between media documents
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="rounded-lg border bg-card overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground">
                <th className="px-4 py-2 text-left">from_title</th>
                <th className="px-4 py-2 text-left">from_type</th>
                <th className="px-4 py-2 text-center w-10"></th>
                <th className="px-4 py-2 text-left">to_title</th>
                <th className="px-4 py-2 text-left">to_type</th>
              </tr>
            </thead>

            <tbody className="divide-y text-sm">
              {recommendations.map((rec) => (
                <tr
                  key={rec._id}
                  className="hover:bg-accent/30 transition-colors"
                >
                  <td className="px-4 py-2 font-medium">{rec.source_title}</td>

                  <td className="px-4 py-2 text-muted-foreground">
                    {rec.source_type}
                  </td>

                  <td className="px-4 py-2 text-center text-muted-foreground">
                    <ArrowRight className="h-4 w-4 inline" />
                  </td>

                  <td className="px-4 py-2 font-medium text-primary">
                    {rec.recommended_title}
                  </td>

                  <td className="px-4 py-2 text-muted-foreground">
                    {rec.recommended_type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recommendations.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No recommendation documents found
          </div>
        )}
      </div>
    </div>
  );
}
