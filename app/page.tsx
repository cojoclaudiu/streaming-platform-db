import { getDatabase } from "@/lib/mongodb";
import MediaTable from "@/components/media-table";
import { buildMediaFilter } from "@/lib/build-media-filter";

interface PageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function Home({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const db = await getDatabase();

  const filter = buildMediaFilter({ q });

  const media = await db
    .collection("media")
    .find(filter)
    .sort({ release_date: -1 })
    .toArray();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-auto p-4">
        <MediaTable initialMedia={JSON.parse(JSON.stringify(media))} />{" "}
      </div>
    </div>
  );
}
