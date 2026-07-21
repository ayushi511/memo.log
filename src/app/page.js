"use client";
import { useState } from "react";
import { useRecentEntries } from "@/hooks/useEntries";
import { categoryStyles } from "@/lib/categoryStyles";
import { PenLine, Settings } from "lucide-react";
import { useDailyWidget } from "@/hooks/useDailyWidget";
import { useProfile } from "@/hooks/useProfile";
import EditProfileModal from "@/components/EditProfileModal";

const moodOptions = [
  { emoji: "😄", label: "Happy" },
  { emoji: "🙂", label: "Good" },
  { emoji: "😌", label: "Peaceful" },
  { emoji: "😐", label: "Meh" },
  { emoji: "😴", label: "Tired" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😢", label: "Sad" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "🥳", label: "Excited" },
];

export default function Home() {
  const { entries, loading } = useRecentEntries(6);
  const today = new Date();
  const { data: widgets, updateField } = useDailyWidget();
  const { profile, saveProfile } = useProfile();
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex gap-8">
      <div className="flex-1 max-w-3xl">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display text-5xl -ml-1">
            Hi, I'm {profile.name || "..."} <span className="text-rose"></span>
          </h1>
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-ink transition"
          >
            <Settings size={14} /> Edit
          </button>
        </div>

        {profile.intro ? (
          profile.intro.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm text-ink/70 mb-3 leading-relaxed">{para}</p>
          ))
        ) : (
          <p className="text-sm text-ink/50 mb-3 italic">
            Click "Edit" above to introduce yourself and personalize your space.
          </p>
        )}

        <div className="bg-rose/15 rounded-3xl p-6 mb-12 mt-8 flex items-center gap-8">
          <div className="bg-butter/60 rounded-lg p-4 w-28 text-center shadow-sm -rotate-2">
            <p className="text-xs text-ink/50 uppercase">{today.toLocaleDateString("en-IN", { weekday: "long" })}</p>
            <p className="font-display text-3xl">{today.getDate()}</p>
            <p className="text-xs text-ink/50">{today.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
          </div>
          <div>
            <p className="font-display text-xl mb-3">How do you want to remember today?</p>
            
              <a href="/journal"
              className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
              style={{ backgroundColor: profile.accentColor }}
            >
              <PenLine size={16} /> Write today's entry
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl">Recent entries</h2>
          <span className="text-sm" style={{ color: profile.accentColor }}>View all →</span>
        </div>

        {loading && <p className="text-ink/40 text-sm">Loading...</p>}
        {!loading && entries.length === 0 && (
          <p className="text-ink/50 text-sm">Nothing here yet — your entries will show up as you write them.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {entries.map((entry) => {
            const style = categoryStyles[entry.category] || { label: entry.category, emoji: "✨", bg: "bg-white/50" };
            const preview = Object.values(entry.fields || {}).filter(Boolean)[0];
            return (
              <div key={entry.id} className={`${style.bg} rounded-2xl p-4 flex flex-col justify-between min-h-[120px]`}>
                <div>
                  <div className="mb-1">
                    <span className="text-xs font-bold text-ink/70 uppercase tracking-wide block">{style.emoji} {style.label}</span>
                    <span className="text-xs text-ink/40">{entry.date}</span>
                  </div>
                  {preview && <p className="text-sm text-ink/80 mt-2">{preview}</p>}
                </div>
                <div className="text-right text-ink/30 text-sm mt-2">→</div>
              </div>
            );
          })}
        </div>
      </div>

      <aside className="w-72 shrink-0 space-y-4">
        <div className="bg-butter/30 rounded-2xl p-5">
          {profile.photoUrl && (
            <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden shadow-sm rotate-[-2deg] bg-white p-1.5 mb-3">
              <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover rounded-lg" />
            </div>
          )}
          <p className="font-semibold text-sm mb-1">💗 About me</p>
          <p className="text-sm text-ink/70">{profile.name ? `just ${profile.name}, collecting little moments` : "Add your photo and intro"}</p>
        </div>

        {profile.currently && (
          <div className="bg-rose/20 rounded-2xl p-5">
            <p className="font-semibold text-sm mb-1">📖 currently</p>
            <p className="text-sm text-ink/70">{profile.currently}</p>
          </div>
        )}

        {profile.currentlyBuilding && (
          <div className="bg-sky/25 rounded-2xl p-5">
            <p className="font-semibold text-sm mb-1">🚀 currently building</p>
            <p className="text-sm text-ink/70">{profile.currentlyBuilding}</p>
          </div>
        )}

        <div className="bg-coral/20 rounded-2xl p-5">
          <p className="font-semibold text-sm mb-1">🧡 today's little joy</p>
          <p className="text-sm text-ink/70">{widgets.gratitude || "Little things that made me smile today."}</p>
        </div>

        <div className="bg-sage/25 rounded-2xl p-5">
          <p className="font-semibold text-sm mb-3">🙂 mood today</p>
          <div className="grid grid-cols-5 gap-1.5 text-lg">
            {moodOptions.map(({ emoji }) => (
              <button
                key={emoji}
                onClick={() => updateField("mood", emoji)}
                className={`transition p-1 rounded-lg ${widgets.mood === emoji ? "bg-white scale-110" : "opacity-50 hover:opacity-100"}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {editing && (
        <EditProfileModal profile={profile} onSave={saveProfile} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}