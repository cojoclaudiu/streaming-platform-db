"use client";

import { ArrowUpDown } from "lucide-react";
import type { Column } from "@tanstack/react-table";

type Props<T> = {
  column: Column<T, unknown>;
  label: string;
};

export function ColumnSortButton<T>({ column, label }: Props<T>) {
  const isSorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting(isSorted === "asc")}
      className={`
        group inline-flex items-center gap-1.5
        rounded-sm px-1 py-0.5
        font-mono text-xs
        cursor-pointer
        transition-colors
        hover:bg-muted/50
        ${
          isSorted
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }
      `}
      aria-label={`Sort by ${label}`}
    >
      {label}

      <ArrowUpDown
        className={`
          h-3.5 w-3.5 transition-transform
          ${
            isSorted
              ? "text-primary"
              : "text-muted-foreground group-hover:text-foreground"
          }
        `}
      />
    </button>
  );
}
