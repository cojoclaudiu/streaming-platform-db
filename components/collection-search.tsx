"use client";

import { usePathname } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";

export function CollectionSearch({
  placeholder = "Search documents...",
}: {
  placeholder?: string;
}) {
  const pathname = usePathname();
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({
      history: "replace",
      shallow: false,
    })
  );

  return (
    <div className="border-b bg-muted/30 px-4 py-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value || null)}
        placeholder={placeholder}
        className="h-8 w-64 rounded-md border bg-background px-3 text-sm font-mono"
        key={pathname}
      />
    </div>
  );
}
