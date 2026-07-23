"use client";
import { useEntries } from "@/hooks/useEntries";
import EntryForm from "@/components/EntryForm";
import { Palette } from "lucide-react";
import { fieldsConfig } from "@/lib/fieldsConfig";

export default function Creative() {
  const { addEntry } = useEntries("creative");
  async function handleSubmit({ values, imageFile }) {
    await addEntry({ text: "", fields: values, imageFile });
  }
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl mb-6 flex items-center gap-2">
        <Palette size={26} strokeWidth={1.75} className="text-coral" /> Made This
      </h1>
      <p className="text-sm text-ink/50 italic mb-6">The joy is in making.</p>
      <EntryForm fields={fieldsConfig.creative} onSubmit={handleSubmit} category="creative" />
    </div>
  );
}