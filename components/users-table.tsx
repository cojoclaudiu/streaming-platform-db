"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Star, Heart, Eye } from "lucide-react";
import { User, Media } from "@/lib/types";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ExpandedState,
  type SortingState,
} from "@tanstack/react-table";

interface UsersTableProps {
  initialUsers: User[];
  mediaMap: [number, Media][];
}

const columnHelper = createColumnHelper<User>();

export default function UsersTable({
  initialUsers,
  mediaMap,
}: UsersTableProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const mediaLookup = useMemo(
    () => new Map<number, Media>(mediaMap),
    [mediaMap]
  );

  const columns = [
    columnHelper.display({
      id: "expander",
      size: 40,
      cell: ({ row }) =>
        row.getCanExpand() ? (
          <button onClick={row.getToggleExpandedHandler()}>
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                row.getIsExpanded() ? "rotate-90" : ""
              }`}
            />
          </button>
        ) : null,
    }),

    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),

    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => (
        <span className="text-muted-foreground">{info.getValue()}</span>
      ),
    }),

    columnHelper.display({
      id: "ratings",
      header: () => (
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          Ratings
        </div>
      ),
      cell: ({ row }) => row.original.ratings?.length ?? 0,
      size: 100,
    }),

    columnHelper.display({
      id: "watchlist",
      header: () => (
        <div className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" />
          Watchlist
        </div>
      ),
      cell: ({ row }) => row.original.watchlist?.length ?? 0,
      size: 120,
    }),

    columnHelper.display({
      id: "watched",
      header: () => (
        <div className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          Watched
        </div>
      ),
      cell: ({ row }) => row.original.watched_media?.length ?? 0,
      size: 120,
    }),
  ];

  const table = useReactTable({
    data: initialUsers,
    columns,
    state: { expanded, sorting },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowCanExpand: (row) =>
      !!(
        row.original.ratings?.length ||
        row.original.watchlist?.length ||
        row.original.watched_media?.length
      ),
  });

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b bg-muted/30">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y">
          {table.getRowModel().rows.map((row) => (
            <>
              {/* Main row */}
              <tr key={row.id} className="hover:bg-accent/30 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>

              {/* Expanded content */}
              {row.getIsExpanded() && (
                <tr>
                  <td colSpan={row.getVisibleCells().length}>
                    <div className="px-8 py-4 space-y-4 bg-background">
                      {/* Ratings */}
                      {row.original.ratings?.length > 0 && (
                        <section>
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            Ratings
                          </h4>

                          <div className="space-y-1">
                            {row.original.ratings.map((r, i) => {
                              const media = mediaLookup.get(r.media_id);

                              return (
                                <div
                                  key={i}
                                  className="flex justify-between items-center rounded bg-muted/40 px-3 py-1.5 text-xs"
                                >
                                  <span className="truncate">
                                    {media?.title ?? `Media ${r.media_id}`}
                                  </span>

                                  <div className="flex items-center gap-1">
                                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">
                                      {r.rating}/10
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      {/* Watchlist */}
                      {row.original.watchlist?.length > 0 && (
                        <section>
                          <h4 className="text-sm font-semibold mb-2">
                            Watchlist
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {row.original.watchlist.map((w, i) => {
                              const media = mediaLookup.get(w.media_id);
                              return (
                                <span
                                  key={i}
                                  className="rounded bg-secondary px-2 py-1 text-xs"
                                >
                                  {media?.title ?? w.media_id}
                                </span>
                              );
                            })}
                          </div>
                        </section>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
