"use client";

import { MediaFormData } from "@/types/media-form";
import { Plus, Trash2 } from "lucide-react";

interface MediaFormProps {
  formData: MediaFormData;
  onUpdate: (data: MediaFormData) => void;
  readOnlyFields?: string[];
}

export function MediaForm({
  formData,
  onUpdate,
  readOnlyFields = [],
}: MediaFormProps) {
  const isReadOnly = (field: string) => readOnlyFields.includes(field);

  const addGenre = () => {
    onUpdate({
      ...formData,
      genres: [...formData.genres, { genre_id: Date.now(), name: "" }],
    });
  };

  const removeGenre = (index: number) => {
    onUpdate({
      ...formData,
      genres: formData.genres.filter((_, i) => i !== index),
    });
  };

  const updateGenre = (index: number, value: string) => {
    const genres = [...formData.genres];
    genres[index] = { ...genres[index], name: value };
    onUpdate({ ...formData, genres });
  };

  const addActor = () => {
    onUpdate({
      ...formData,
      actors: [
        ...formData.actors,
        { actor_id: Date.now(), name: "", date_of_birth: "" },
      ],
    });
  };

  const removeActor = (index: number) => {
    onUpdate({
      ...formData,
      actors: formData.actors.filter((_, i) => i !== index),
    });
  };

  const updateActor = (index: number, field: string, value: string) => {
    const actors = [...formData.actors];
    actors[index] = { ...actors[index], [field]: value };
    onUpdate({ ...formData, actors });
  };

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="border-b bg-muted/30 px-4 py-2">
        <span className="text-xs font-mono text-muted-foreground">
          Document Editor
        </span>
      </div>

      <div className="p-6 space-y-6 font-mono text-sm">
        {/* media_id (if present and read-only) */}
        {isReadOnly("media_id") && "media_id" in formData && (
          <div className="flex gap-4 items-start">
            <label className="text-muted-foreground w-40 pt-2">media_id:</label>
            <div className="flex-1 bg-muted/30 rounded px-3 py-2 text-muted-foreground">
              {formData.media_id}
            </div>
          </div>
        )}

        {/* title */}
        <div className="flex gap-4 items-start">
          <label className="text-muted-foreground w-40 pt-2">title:</label>
          <input
            className="flex-1 h-10 rounded border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={formData.title}
            onChange={(e) => onUpdate({ ...formData, title: e.target.value })}
            required
          />
        </div>

        {/* type */}
        <div className="flex gap-4 items-start">
          <label className="text-muted-foreground w-40 pt-2">type:</label>
          <select
            className="flex-1 h-10 rounded border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={formData.type}
            onChange={(e) =>
              onUpdate({
                ...formData,
                type: e.target.value as "movie" | "series",
              })
            }
          >
            <option value="movie">movie</option>
            <option value="series">series</option>
          </select>
        </div>

        {/* release_date */}
        <div className="flex gap-4 items-start">
          <label className="text-muted-foreground w-40 pt-2">
            release_date:
          </label>
          <input
            type="date"
            className="flex-1 h-10 rounded border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={formData.release_date}
            onChange={(e) =>
              onUpdate({ ...formData, release_date: e.target.value })
            }
            required
          />
        </div>

        {/* duration OR number_of_seasons */}
        {formData.type === "movie" ? (
          <div className="flex gap-4 items-start">
            <label className="text-muted-foreground w-40 pt-2">duration:</label>
            <input
              type="number"
              className="flex-1 h-10 rounded border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.duration || ""}
              onChange={(e) =>
                onUpdate({ ...formData, duration: e.target.value })
              }
              placeholder="minutes"
            />
          </div>
        ) : (
          <div className="flex gap-4 items-start">
            <label className="text-muted-foreground w-40 pt-2">
              number_of_seasons:
            </label>
            <input
              type="number"
              className="flex-1 h-10 rounded border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={formData.number_of_seasons || ""}
              onChange={(e) =>
                onUpdate({ ...formData, number_of_seasons: e.target.value })
              }
            />
          </div>
        )}

        {/* language */}
        <div className="flex gap-4 items-start">
          <label className="text-muted-foreground w-40 pt-2">language:</label>
          <input
            className="flex-1 h-10 rounded border border-input bg-background px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={formData.language || ""}
            onChange={(e) =>
              onUpdate({ ...formData, language: e.target.value })
            }
          />
        </div>

        {/* description */}
        <div className="flex gap-4 items-start">
          <label className="text-muted-foreground w-40 pt-2">
            description:
          </label>
          <textarea
            rows={4}
            className="flex-1 rounded border border-input bg-background px-3 py-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={formData.description}
            onChange={(e) =>
              onUpdate({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* genres: Array */}
        <div className="flex gap-4 items-start">
          <label className="text-muted-foreground w-40 pt-2">genres:</label>
          <div className="flex-1 space-y-2">
            <div className="text-xs text-muted-foreground mb-2">
              Array({formData.genres.length})
            </div>
            {formData.genres.map((genre, index) => (
              <div key={index} className="flex gap-2 items-center">
                <span className="text-muted-foreground text-xs w-8">
                  [{index}]
                </span>
                <input
                  className="flex-1 h-9 rounded border border-input bg-background px-3 text-sm"
                  value={genre.name}
                  onChange={(e) => updateGenre(index, e.target.value)}
                  placeholder="Genre name"
                />
                <button
                  type="button"
                  onClick={() => removeGenre(index)}
                  className="h-9 w-9 rounded border border-border text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addGenre}
              className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              <Plus className="h-3 w-3" />
              Add genre
            </button>
          </div>
        </div>

        {/* actors: Array */}
        <div className="flex gap-4 items-start">
          <label className="text-muted-foreground w-40 pt-2">actors:</label>
          <div className="flex-1 space-y-3">
            <div className="text-xs text-muted-foreground mb-2">
              Array({formData.actors.length})
            </div>
            {formData.actors.map((actor, index) => (
              <div
                key={index}
                className="border rounded-md p-3 bg-muted/20 space-y-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    [{index}]
                  </span>
                  <button
                    type="button"
                    onClick={() => removeActor(index)}
                    className="h-7 w-7 rounded hover:bg-destructive/10 flex items-center justify-center"
                  >
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground text-xs w-32">
                      name:
                    </span>
                    <input
                      className="flex-1 h-9 rounded border border-input bg-background px-3 text-sm"
                      value={actor.name}
                      onChange={(e) =>
                        updateActor(index, "name", e.target.value)
                      }
                      placeholder="Actor name"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground text-xs w-32">
                      date_of_birth:
                    </span>
                    <input
                      type="date"
                      className="flex-1 h-9 rounded border border-input bg-background px-3 text-sm"
                      value={actor.date_of_birth}
                      onChange={(e) =>
                        updateActor(index, "date_of_birth", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addActor}
              className="flex items-center gap-2 text-xs text-primary hover:underline"
            >
              <Plus className="h-3 w-3" />
              Add actor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
