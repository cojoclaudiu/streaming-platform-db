"use client";

import Link from "next/link";
import { Filter, Plus } from "lucide-react";

interface CollectionToolbarProps {
  collection: string; // "media", "users", etc.
  query?: string; // `{ type: "movie" }`
  count: number; // documents count
  insertHref?: string; // "/media/new"
  insertLabel?: string; // "Insert Document"
}

export function CollectionToolbar({
  collection,
  query,
  count,
  insertHref,
  insertLabel = "Insert Document",
}: CollectionToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
      {/* Left */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold">{collection}</h1>

        {query && (
          <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-mono border border-primary/20">
            {query}
          </span>
        )}

        <span className="text-xs text-muted-foreground">{count} documents</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-md text-xs font-medium transition-colors hover:bg-muted px-3 py-1.5 border"
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
        </button>

        {insertHref && (
          <Link
            href={insertHref}
            className="inline-flex items-center gap-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            {insertLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
