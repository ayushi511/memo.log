"use client";
import { useEntries } from "@/hooks/useEntries";
import EntryForm from "@/components/EntryForm";
import { UtensilsCrossed } from "lucide-react";
import { fieldsConfig } from "@/lib/fieldsConfig";

export default function Kitchen() {
  const { addEntry } = useEntries("kitchen");
  async function handleSubmit({ values, imageFile }) {
    await addEntry({ text: "", fields: values, imageFile });
  }
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl mb-6 flex items-center gap-2">
        <UtensilsCrossed size={26} strokeWidth={1.75} className="text-butter" /> Kitchen Diaries
      </h1>
      <EntryForm fields={fieldsConfig.kitchen} onSubmit={handleSubmit} category="kitchen" />
    </div>
  );
}