import { getDatabase } from "@/lib/mongodb";
import SeriesTable from "@/components/series-table";
import { CollectionToolbar } from "@/components/collection-toolbar";
import { buildMediaFilter } from "@/lib/build-media-filter";

interface PageProps {
  searchParams: {
    q?: string;
  };
}

export default async function SeriesPage({ searchParams }: PageProps) {
  const db = await getDatabase();

  const filter = buildMediaFilter({
    type: "series",
    q: searchParams.q,
  });

  const series = await db
    .collection("media")
    .find(filter)
    .sort({ release_date: -1 })
    .toArray();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <CollectionToolbar
        collection="media"
        query={`{ type: "series" }`}
        count={series.length}
        insertHref="/media/new"
      />

      <div className="flex-1 overflow-auto p-4">
        <SeriesTable initialSeries={JSON.parse(JSON.stringify(series))} />
      </div>
    </div>
  );
}
