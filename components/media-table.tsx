"use client";

import { Media } from "@/lib/types";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";

import { CollectionFooter } from "./collection-footer";
import CollectionEmpty from "./collection-empty";
import { CollectionSearch } from "./collection-search";
import { ColumnSortButton } from "./collumn-sort-button";
import { useMediaQuery } from "@/hooks/media/use-media-query";

interface MediaTableProps {
  initialMedia: Media[];
  type?: "movie" | "series";
}

const columnHelper = createColumnHelper<Media>();

export default function MediaTable({ initialMedia, type }: MediaTableProps) {
  const { data, isFetching, refetch } = useMediaQuery(type);
  console.log("data", data);
  const media = data ?? initialMedia;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  async function handleDelete(mediaId: number) {
    if (!confirm("Delete this document?")) return;

    setIsDeleting(mediaId);
    try {
      const res = await fetch(`/api/media/${mediaId}`, { method: "DELETE" });
      if (!res.ok) {
        alert("Failed to delete");
        return;
      }

      await refetch();
    } finally {
      setIsDeleting(null);
    }
  }

  const columns = [
    columnHelper.accessor("media_id", {
      header: "media_id",
      cell: (info) => (
        <span className="font-mono text-xs text-muted-foreground">
          {info.getValue()}
        </span>
      ),
      size: 100,
    }),

    columnHelper.accessor("title", {
      header: ({ column }) => (
        <ColumnSortButton column={column} label="title" />
      ),
      cell: (info) => (
        <div className="font-medium truncate max-w-md">{info.getValue()}</div>
      ),
    }),

    columnHelper.accessor("type", {
      header: "type",
      cell: (info) => (
        <span className="font-mono text-sm text-muted-foreground">
          {info.getValue()}
        </span>
      ),
      size: 100,
    }),

    columnHelper.accessor("release_date", {
      header: ({ column }) => (
        <ColumnSortButton column={column} label="release_date" />
      ),
      cell: (info) => (
        <span className="font-mono text-sm text-muted-foreground">
          {new Date(info.getValue()).toISOString().split("T")[0]}
        </span>
      ),
      size: 130,
    }),

    columnHelper.display({
      id: "duration",
      header: "duration / seasons",
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          {row.original.type === "movie"
            ? row.original.duration
              ? `${row.original.duration}m`
              : "null"
            : row.original.number_of_seasons
            ? `${row.original.number_of_seasons} seasons`
            : "null"}
        </span>
      ),
      size: 150,
    }),

    columnHelper.accessor("language", {
      header: "language",
      cell: (info) => (
        <span className="font-mono text-sm text-muted-foreground">
          {info.getValue() || "null"}
        </span>
      ),
      size: 100,
    }),

    columnHelper.accessor("genres", {
      header: "genres",
      cell: (info) => (
        <span className="font-mono text-sm text-muted-foreground">
          Array({info.getValue().length})
        </span>
      ),
      size: 100,
    }),

    columnHelper.accessor("actors", {
      header: "actors",
      cell: (info) => (
        <span className="font-mono text-sm text-muted-foreground">
          Array({info.getValue().length})
        </span>
      ),
      size: 100,
    }),

    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right font-mono">actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/media/${row.original.media_id}/edit`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </Link>

          <button
            onClick={() => handleDelete(row.original.media_id)}
            disabled={isDeleting === row.original.media_id}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-destructive/10 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      ),
      size: 100,
    }),
  ];

  const table = useReactTable({
    data: media, // ✅ FIX 3
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      {/* Search */}
      <CollectionSearch />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-muted/30">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground font-mono"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody
            className={`divide-y transition-opacity ${
              isFetching ? "opacity-50" : "opacity-100"
            }`}
          >
            {rows.map((row) => (
              <tr
                key={row.id}
                className="group hover:bg-accent/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2.5 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty */}
      {!isFetching && rows.length === 0 && <CollectionEmpty />}

      {/* Footer */}
      <CollectionFooter
        filteredCount={rows.length}
        totalCount={media.length}
        collection="media"
        isFiltered={false}
      />
    </div>
  );
}
