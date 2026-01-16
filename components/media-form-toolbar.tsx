"use client";

import Link from "next/link";
import { ArrowLeft, Save, X } from "lucide-react";

interface MediaFormToolbarProps {
  documentId?: string | number;
  onSave: () => void;
  isSaving: boolean;
  saveLabel?: string;
}

export function MediaFormToolbar({
  documentId,
  onSave,
  isSaving,
  saveLabel = "Save Document",
}: MediaFormToolbarProps) {
  return (
    <div className="border-b bg-background px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-mono"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          media
        </Link>
        <span className="text-xs text-muted-foreground">/</span>
        <span className="text-xs font-mono text-muted-foreground">
          {documentId || "new"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-mono
           border border-border bg-background text-muted-foreground
           hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </Link>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring px-3 py-1.5 shadow-sm disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" />
          {isSaving ? "Saving..." : saveLabel}
        </button>
      </div>
    </div>
  );
}
