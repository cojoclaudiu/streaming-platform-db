import { getDatabase } from "@/lib/mongodb";
import { CollectionToolbar } from "@/components/collection-toolbar";
import MediaTable from "@/components/media-table";
import { buildMediaFilter } from "@/lib/build-media-filter";
import type { Media } from "@/lib/types";

const TYPE = "movie";

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function MoviesPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  const db = await getDatabase();

  const filter = buildMediaFilter({
    type: TYPE,
    q,
  });

  const movies = await db
    .collection("media")
    .find(filter)
    .sort({ release_date: -1 })
    .toArray();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <CollectionToolbar
        collection="media"
        query={`{ type: "${TYPE}" }`}
        count={movies.length}
        insertHref="/media/new"
      />

      <div className="flex-1 overflow-auto p-4">
        <MediaTable
          initialMedia={JSON.parse(JSON.stringify(movies)) as Media[]}
          type={TYPE}
        />
      </div>
    </div>
  );
}
