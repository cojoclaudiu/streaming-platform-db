"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaFormToolbar } from "@/components/media-form-toolbar";
import { MediaForm } from "@/components/media-form";
import { MediaFormData } from "@/types/media-form";

export default function NewMediaPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MediaFormData>({
    title: "",
    release_date: "",
    description: "",
    type: "movie",
    language: "English",
    duration: "",
    number_of_seasons: "",
    genres: [{ genre_id: Date.now(), name: "" }],
    actors: [{ actor_id: Date.now(), name: "", date_of_birth: "" }],
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : undefined,
          number_of_seasons: formData.number_of_seasons
            ? parseInt(formData.number_of_seasons)
            : undefined,
        }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        alert("Failed to save document");
      }
    } catch (error) {
      alert("Failed to save document");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <MediaFormToolbar onSave={handleSubmit} isSaving={isSubmitting} />

      <div className="flex-1 overflow-auto p-6 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <MediaForm formData={formData} onUpdate={setFormData} />
        </div>
      </div>
    </div>
  );
}
