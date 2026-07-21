"use client";
import { useState } from "react";
import { X } from "lucide-react";

const colorOptions = [
  { name: "Plum", hex: "#8B6F9E" },
  { name: "Rose", hex: "#D8A7B1" },
  { name: "Sage", hex: "#9CAF88" },
  { name: "Sky", hex: "#A8CDE0" },
  { name: "Coral", hex: "#E8A798" },
  { name: "Butter", hex: "#D9B95C" },
];

export default function EditProfileModal({ profile, onSave, onClose }) {
  const [name, setName] = useState(profile.name);
  const [intro, setIntro] = useState(profile.intro);
  const [currently, setCurrently] = useState(profile.currently);
  const [currentlyBuilding, setCurrentlyBuilding] = useState(profile.currentlyBuilding);
  const [accentColor, setAccentColor] = useState(profile.accentColor);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    let photoUrl = profile.photoUrl;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      photoUrl = data.secure_url;
    }

    await onSave({ name, intro, currently, currentlyBuilding, accentColor, photoUrl });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-6">
      <div className="bg-[#F7F3F9] rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-ink/40 hover:text-ink">
          <X size={20} />
        </button>
        <h2 className="font-display text-2xl mb-6">Edit your space</h2>

        <label className="block text-sm font-semibold text-ink/70 mb-1">Your name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ayushi"
          className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm mb-4"
        />

        <label className="block text-sm font-semibold text-ink/70 mb-1">About you</label>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={5}
          placeholder="Tell your future self who you are..."
          className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm mb-4"
        />

        <label className="block text-sm font-semibold text-ink/70 mb-1">Currently</label>
        <input
          value={currently}
          onChange={(e) => setCurrently(e.target.value)}
          placeholder="e.g. Learning caricatures"
          className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm mb-4"
        />

        <label className="block text-sm font-semibold text-ink/70 mb-1">Currently building</label>
        <input
          value={currentlyBuilding}
          onChange={(e) => setCurrentlyBuilding(e.target.value)}
          placeholder="e.g. My own website"
          className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm mb-4"
        />

        <label className="block text-sm font-semibold text-ink/70 mb-1">Photo</label>
        <label className="flex items-center justify-center border-2 border-dashed border-ink/15 rounded-xl bg-white/60 py-3 text-sm text-ink/50 cursor-pointer mb-4">
          {imageFile ? imageFile.name : "Choose a photo"}
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="hidden" />
        </label>

        <label className="block text-sm font-semibold text-ink/70 mb-2">Accent color</label>
        <div className="flex gap-2 mb-6">
          {colorOptions.map((c) => (
            <button
              key={c.hex}
              onClick={() => setAccentColor(c.hex)}
             className="w-11 h-11 rounded-full border-2 hover:scale-110 transition"
              style={{ backgroundColor: c.hex, borderColor: accentColor === c.hex ? "#3A2E42" : "transparent" }}
              title={c.name}
            />
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="text-white px-6 py-2.5 rounded-full text-sm font-medium disabled:opacity-50"
          style={{ backgroundColor: accentColor }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
}