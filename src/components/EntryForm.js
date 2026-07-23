"use client";
import { useState } from "react";
import { categoryStyles } from "@/lib/categoryStyles";

function StarPicker({ value, onChange }) {
  const rating = parseInt(value) || 0;
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(String(n))}
          className={`text-xl transition ${n <= rating ? "text-butter" : "text-ink/20"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ChoicePicker({ value, options, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
            value === opt ? "bg-plum text-white" : "bg-white/70 text-ink/60 hover:bg-white"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function EntryForm({ onSubmit, fields, category, initialValues = null }) {
  const style = categoryStyles[category] || { bg: "bg-plum/20" };
  const [values, setValues] = useState(
    initialValues || Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ values, imageFile });
      if (!initialValues) {
        setValues(Object.fromEntries(fields.map((f) => [f.name, ""])));
        setImageFile(null);
      }
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`${style.bg} rounded-2xl p-6 space-y-4`}>
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-ink/70 mb-1.5">{field.label}</label>
          {field.type === "rating" ? (
            <StarPicker value={values[field.name]} onChange={(v) => handleChange(field.name, v)} />
          ) : field.type === "choice" ? (
            <ChoicePicker value={values[field.name]} options={field.options} onChange={(v) => handleChange(field.name, v)} />
          ) : (
            <textarea
              value={values[field.name]}
              onChange={(e) => handleChange(field.name, e.target.value)}
              rows={field.rows || 2}
              className="w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/30 resize-none"
              placeholder={field.placeholder || ""}
            />
          )}
        </div>
      ))}

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
        {saving ? "Saving..." : initialValues ? "Update entry ✨" : "Save entry ✨"}
      </button>
    </form>
  );
}