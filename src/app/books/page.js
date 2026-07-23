"use client";
import { useEntries } from "@/hooks/useEntries";
import EntryForm from "@/components/EntryForm";
import { Library } from "lucide-react";
import { fieldsConfig } from "@/lib/fieldsConfig";

export default function Books() {
  const { addEntry } = useEntries("books");
  async function handleSubmit({ values, imageFile }) {
    await addEntry({ text: "", fields: values, imageFile });
  }
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl mb-6 flex items-center gap-2">
        <Library size={26} strokeWidth={1.75} className="text-plum" /> Bookshelf
      </h1>
      <p className="text-sm text-ink/50 italic mb-6">Books change us in quiet ways.</p>
      <EntryForm fields={fieldsConfig.books} onSubmit={handleSubmit} category="books" />
    </div>
  );
}