"use client";
import { useEntries } from "@/hooks/useEntries";
import EntryForm from "@/components/EntryForm";
import { BookOpen } from "lucide-react";
import { fieldsConfig } from "@/lib/fieldsConfig";

export default function Journal() {
  const { addEntry } = useEntries("journal");
  async function handleSubmit({ values, imageFile }) {
    await addEntry({ text: "", fields: values, imageFile });
  }
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl mb-6 flex items-center gap-2">
        <BookOpen size={26} strokeWidth={1.75} className="text-rose" /> Today I...
      </h1>
      <EntryForm fields={fieldsConfig.journal} onSubmit={handleSubmit} category="journal" />
    </div>
  );
}