"use client";
import { useState } from "react";
import { useEntries } from "@/hooks/useEntries";
import { BookOpen, Flower2, CloudRain, Sprout, Sun } from "lucide-react";

export default function Journal() {
  const { addEntry } = useEntries("journal");
  const [values, setValues] = useState({ happened: "", smile: "", frustrated: "", learned: "", tomorrow: "" });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await addEntry({ text: "", fields: values, imageFile });
      setValues({ happened: "", smile: "", frustrated: "", learned: "", tomorrow: "" });
      setImageFile(null);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-2xl mb-1 flex items-center gap-2">
        <BookOpen size={22} strokeWidth={1.75} className="text-rose" /> Today I...
      </h1>
      <p className="text-sm text-ink/50 italic mb-4">Write like nobody's grading you.</p>

      <form onSubmit={handleSubmit} className="bg-rose/15 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink/80 mb-1">Tell me about today.</label>
          <p className="text-xs text-ink/40 mb-1.5">What's the story you'll want to remember?</p>
          <textarea
            value={values.happened}
            onChange={(e) => handleChange("happened", e.target.value)}
            rows={3}
            placeholder="Start writing..."
            className="w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/30 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-xs font-semibold text-ink/70 flex items-center gap-1 mb-0.5">
              <Flower2 size={13} className="text-plum" /> Tiny joy
            </p>
            <p className="text-[11px] text-ink/40 mb-1.5">What made today feel lighter?</p>
            <textarea
              value={values.smile}
              onChange={(e) => handleChange("smile", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-plum/30 resize-none"
            />
          </div>

          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-xs font-semibold text-ink/70 flex items-center gap-1 mb-0.5">
              <CloudRain size={13} className="text-sky" /> Heavy moment
            </p>
            <p className="text-[11px] text-ink/40 mb-1.5">What felt heavy or frustrating?</p>
            <textarea
              value={values.frustrated}
              onChange={(e) => handleChange("frustrated", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-plum/30 resize-none"
            />
          </div>

          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-xs font-semibold text-ink/70 flex items-center gap-1 mb-0.5">
              <Sprout size={13} className="text-sage" /> Lesson learned
            </p>
            <p className="text-[11px] text-ink/40 mb-1.5">What did today teach you?</p>
            <textarea
              value={values.learned}
              onChange={(e) => handleChange("learned", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-plum/30 resize-none"
            />
          </div>

          <div className="bg-white/60 rounded-xl p-3">
            <p className="text-xs font-semibold text-ink/70 flex items-center gap-1 mb-0.5">
              <Sun size={13} className="text-butter" /> Looking ahead
            </p>
            <p className="text-[11px] text-ink/40 mb-1.5">A tiny promise for tomorrow.</p>
            <textarea
              value={values.tomorrow}
              onChange={(e) => handleChange("tomorrow", e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-ink/10 bg-white px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-plum/30 resize-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1.5">Add a photo (optional)</label>
          <label className="flex items-center justify-center border-2 border-dashed border-ink/15 rounded-xl bg-white/60 py-2.5 text-xs text-ink/50 cursor-pointer hover:bg-white/90 transition">
            {imageFile ? imageFile.name : "Choose a file or drag & drop"}
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-plum text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save entry ✨"}
        </button>
      </form>
    </div>
  );
}