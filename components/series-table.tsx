"use client";

import { Media } from "@/lib/types";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type ExpandedState,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronRight, Pencil, ArrowUpDown } from "lucide-react";
import { Fragment, useState } from "react";
import Link from "next/link";
import { CollectionSearch } from "./collection-search";
import CollectionEmpty from "./collection-empty";
import { CollectionFooter } from "./collection-footer";
import { ColumnSortButton } from "./collumn-sort-button";

interface SeriesTableProps {
  initialSeries: Media[];
}

const columnHelper = createColumnHelper<Media>();

export default function SeriesTable({ initialSeries }: SeriesTableProps) {
  const [data] = useState(initialSeries);
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    columnHelper.display({
      id: "expander",
      size: 40,
      cell: ({ row }) =>
        row.original.seasons?.length ? (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="flex items-center justify-center"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                row.getIsExpanded() ? "rotate-90" : ""
              }`}
            />
          </button>
        ) : null,
    }),

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
        <span className="font-medium truncate max-w-md">{info.getValue()}</span>
      ),
    }),

    columnHelper.accessor("release_date", {
      header: "release_date",
      cell: (info) => (
        <span className="font-mono text-muted-foreground">
          {new Date(info.getValue()).getFullYear()}
        </span>
      ),
      size: 130,
    }),

    columnHelper.accessor("number_of_seasons", {
      header: "number_of_seasons",
      cell: (info) => (
        <span className="font-mono text-muted-foreground">
          {info.getValue() ?? "null"}
        </span>
      ),
      size: 150,
    }),

    columnHelper.accessor("genres", {
      header: "genres",
      cell: (info) => (
        <span className="font-mono text-muted-foreground">
          Array({info.getValue()?.length ?? 0})
        </span>
      ),
      size: 120,
    }),

    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right font-mono">actions</div>,
      size: 80,
      cell: ({ row }) => (
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/media/${row.original.media_id}/edit`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
            title="Edit"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </Link>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: { expanded, sorting, globalFilter },
    onExpandedChange: setExpanded,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowCanExpand: (row) => !!row.original.seasons?.length,
  });

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      {/* Search */}
      <CollectionSearch placeholder="Search series..." />

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
              <Fragment key={row.id}>
                <tr
                  key={row.id}
                  className="group transition-colors hover:bg-accent/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2.5 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>

                {row.getIsExpanded() && (
                  <tr className="bg-background">
                    <td colSpan={row.getVisibleCells().length}>
                      <div className="px-8 py-4 space-y-3">
                        {row.original.seasons?.map((season) => (
                          <div
                            key={season.season_id}
                            className="rounded-md border bg-muted/40 p-3"
                          >
                            <div className="flex justify-between mb-2 text-sm font-medium font-mono">
                              <span>season {season.season_number}</span>
                              <span className="text-xs text-muted-foreground">
                                {season.episodes?.length ?? 0} episodes
                              </span>
                            </div>

                            {season.episodes?.length > 0 && (
                              <div className="space-y-1">
                                {season.episodes.map((ep) => (
                                  <div
                                    key={ep.episode_id}
                                    className="flex justify-between rounded bg-background px-3 py-1.5 text-xs font-mono"
                                  >
                                    <span>
                                      {ep.episode_number}. {ep.title}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {ep.duration}m
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty */}
      {table.getRowModel().rows.length === 0 && <CollectionEmpty />}

      {/* Footer */}
      <CollectionFooter
        filteredCount={table.getFilteredRowModel().rows.length}
        totalCount={data.length}
        collection="media"
        isFiltered={!!globalFilter}
      />
    </div>
  );
}
