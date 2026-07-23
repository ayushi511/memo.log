"use client";
import { useWeekStats } from "@/hooks/useWeekStats";
import { Eye, BookOpen, Brain, Palette, UtensilsCrossed, Clapperboard, Library } from "lucide-react";

const categoryMeta = {
  journal: { label: "Journal entries", icon: BookOpen },
  psychology: { label: "Mind notes", icon: Brain },
  creative: { label: "Paintings", icon: Palette },
  kitchen: { label: "Recipes tried", icon: UtensilsCrossed },
  books: { label: "Books read", icon: Library },
  movies: { label: "Movies watched", icon: Clapperboard },
};

export default function AtAGlanceCard() {
  const { lifetimeCounts } = useWeekStats();

  return (
    <div className="bg-white/50 rounded-3xl p-6">
      <h3 className="font-display text-xl flex items-center gap-2 mb-5">
        <Eye size={20} className="text-plum" /> At a glance
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(categoryMeta).map(([cat, meta]) => {
          const Icon = meta.icon;
          return (
            <div key={cat} className="bg-plum/10 rounded-xl p-3">
              <p className="text-xs text-ink/50 flex items-center gap-1 mb-1">
                <Icon size={13} /> {meta.label}
              </p>
              <p className="font-display text-xl">{lifetimeCounts[cat] || 0}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}