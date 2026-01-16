"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaById } from "@/hooks/media/use-media-by-id";
import { useUpdateMedia } from "@/hooks/media/use-update-media";
import { MediaFormData } from "@/types/media-form";
import { MediaFormToolbar } from "@/components/media-form-toolbar";
import { MediaForm } from "@/components/media-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditMediaPage({ params }: Props) {
  const router = useRouter();
  const { id: mediaId } = use(params);

  const [formData, setFormData] = useState<MediaFormData | null>(null);

  const { data, isLoading, isError } = useMediaById(mediaId);
  const updateMutation = useUpdateMedia(mediaId);

  if (data && !formData) {
    setFormData(data);
  }

  function handleSubmit() {
    if (!mediaId || !formData) return;

    updateMutation.mutate(formData, {
      onSuccess: () => {
        router.push("/");
        router.refresh();
      },
      onError: () => {
        alert("Failed to save document");
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="text-sm font-mono text-muted-foreground">
          Loading document...
        </span>
      </div>
    );
  }

  if (isError || !formData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-sm font-mono text-muted-foreground mb-4">
            Document not found
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <MediaFormToolbar
        documentId={mediaId}
        onSave={handleSubmit}
        isSaving={updateMutation.isPending}
      />

      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <MediaForm
            formData={formData}
            onUpdate={(data) => setFormData(data)}
            readOnlyFields={["media_id"]}
          />
        </div>
      </div>
    </div>
  );
}
