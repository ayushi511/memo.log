"use client";
import { useDailyWidget } from "@/hooks/useDailyWidget";

const moodOptions = [
  { emoji: "🤩", label: "amazing" },
  { emoji: "🙂", label: "good" },
  { emoji: "😊", label: "content" },
  { emoji: "😴", label: "tired" },
  { emoji: "😖", label: "stressed" },
  { emoji: "😕", label: "meh" },
  { emoji: "😢", label: "sad" },
  { emoji: "😰", label: "anxious" },
  { emoji: "😆", label: "excited" },
  { emoji: "🎨", label: "creative" },
];

export default function MoodTrackerCard() {
  const { data: widgets, updateField } = useDailyWidget();
  return (
    <div className="bg-white/50 rounded-2xl p-4 h-full">
      <h3 className="font-display text-sm mb-3">🙂 Mood tracker</h3>
      <div className="grid grid-cols-5 gap-2">
        {moodOptions.map(({ emoji, label }) => (
          <button key={emoji} onClick={() => updateField("mood", emoji)} className="flex flex-col items-center gap-0.5">
            <span className={`text-lg transition ${widgets.mood === emoji ? "scale-125" : "opacity-50 hover:opacity-90"}`}>
              {emoji}
            </span>
            <span className="text-[8px] text-ink/50">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}