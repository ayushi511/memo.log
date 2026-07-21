"use client";
import { useEntries } from "@/hooks/useEntries";
import EntryForm from "@/components/EntryForm";
import { Brain } from "lucide-react";
import { fieldsConfig } from "@/lib/fieldsConfig";

export default function Psychology() {
  const { addEntry } = useEntries("psychology");
  async function handleSubmit({ values, imageFile }) {
    await addEntry({ text: "", fields: values, imageFile });
  }
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl mb-6 flex items-center gap-2">
        <Brain size={26} strokeWidth={1.75} className="text-sky" /> Mind Notes
      </h1>
      <EntryForm fields={fieldsConfig.psychology} onSubmit={handleSubmit} category="psychology" />
    </div>
  );
}