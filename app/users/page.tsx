import { getDatabase } from "@/lib/mongodb";
import { User, Media } from "@/lib/types";
import Link from "next/link";
import { Plus, Filter } from "lucide-react";
import UsersTable from "@/components/users-table";

async function getUsersAndMedia(): Promise<{
  users: User[];
  mediaMap: [number, Media][];
}> {
  const db = await getDatabase();

  const [users, media] = await Promise.all([
    db.collection("users").find().sort({ name: 1 }).toArray(),
    db.collection("media").find().toArray(),
  ]);

  const mediaMap = media.map((m: any) => [m.media_id, m] as [number, Media]);

  return {
    users: JSON.parse(JSON.stringify(users)),
    mediaMap: JSON.parse(JSON.stringify(mediaMap)),
  };
}

export default async function UsersPage() {
  const { users, mediaMap } = await getUsersAndMedia();

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold">users</h1>

          <span className="text-xs text-muted-foreground">
            {users.length} documents
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md text-xs font-medium transition-colors hover:bg-muted px-3 py-1.5 border">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>

          <Link
            href="/users/new"
            className="inline-flex items-center gap-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Insert Document
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <UsersTable initialUsers={users} mediaMap={mediaMap} />
      </div>
    </div>
  );
}
