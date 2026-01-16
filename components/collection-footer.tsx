"use client";

interface CollectionFooterProps {
  filteredCount: number;
  totalCount: number;
  collection: string;
  isFiltered?: boolean;
}

export function CollectionFooter({
  filteredCount,
  totalCount,
  collection,
  isFiltered = false,
}: CollectionFooterProps) {
  return (
    <div className="border-t bg-muted/30 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="font-medium font-mono">{filteredCount} documents</span>

        {isFiltered && (
          <span className="text-primary font-mono">
            (filtered from {totalCount} total)
          </span>
        )}
      </div>

      <span className="font-mono">collection: {collection}</span>
    </div>
  );
}
