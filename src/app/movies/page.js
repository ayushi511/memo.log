"use client";
import { useEntries } from "@/hooks/useEntries";
import EntryForm from "@/components/EntryForm";
import { Clapperboard } from "lucide-react";
import { fieldsConfig } from "@/lib/fieldsConfig";

export default function Movies() {
  const { addEntry } = useEntries("movies");
  async function handleSubmit({ values, imageFile }) {
    await addEntry({ text: "", fields: values, imageFile });
  }
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl mb-6 flex items-center gap-2">
        <Clapperboard size={26} strokeWidth={1.75} className="text-sage" /> Screen Time
      </h1>
      <p className="text-sm text-ink/50 italic mb-6">Stories stay long after the credits.</p>
      <EntryForm fields={fieldsConfig.movies} onSubmit={handleSubmit} category="movies" />
    </div>
  );
}