"use client";
import { useState } from "react";
import Link from "next/link";
import { useWeekStats } from "@/hooks/useWeekStats";
import { BookOpen, Brain, Palette, UtensilsCrossed, Clapperboard, Library, CalendarDays } from "lucide-react";
import CategoryPopup from "@/components/CategoryPopup";

const cards = [
  { key: "journal", label: "Journal", href: "/journal", icon: BookOpen, suffix: "entries" },
  { key: "psychology", label: "Mind Notes", href: "/psychology", icon: Brain, suffix: "notes" },
  { key: "creative", label: "Made This", href: "/creative", icon: Palette, suffix: "paintings" },
  { key: "kitchen", label: "Kitchen Diaries", href: "/kitchen", icon: UtensilsCrossed, suffix: "recipes tried" },
  { key: "movies", label: "Screen Time", href: "/movies", icon: Clapperboard, suffix: "movies watched" },
  { key: "books", label: "Bookshelf", href: "/books", icon: Library, suffix: "books read" },
  { key: "archive", label: "Archive", href: "/archive", icon: CalendarDays, suffix: "all memories" },
];

export default function CategoryCards() {
  const { lifetimeCounts } = useWeekStats();
  const [openCategory, setOpenCategory] = useState(null);
  const openCard = cards.find((c) => c.key === openCategory);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const count = c.key === "archive" ? null : lifetimeCounts[c.key] || 0;
          const isArchive = c.key === "archive";
          const CardInner = (
            <>
              <Icon size={18} className="text-plum mb-2" strokeWidth={1.75} />
              <p className="text-sm font-semibold text-ink/80">{c.label}</p>
              <p className="text-xs text-ink/50">{count !== null ? `${count} ${c.suffix}` : c.suffix}</p>
            </>
          );
          const className = "bg-white/50 rounded-2xl p-4 hover:bg-white/80 transition flex flex-col justify-between min-h-[110px] text-left";

          return isArchive ? (
            <Link key={c.key} href={c.href} className={className}>
              <div>{CardInner}</div>
              <span className="text-ink/30 text-sm">→</span>
            </Link>
          ) : (
            <button key={c.key} onClick={() => setOpenCategory(c.key)} className={className}>
              <div>{CardInner}</div>
              <span className="text-ink/30 text-sm">→</span>
            </button>
          );
        })}
      </div>

      {openCard && (
        <CategoryPopup category={openCard.key} href={openCard.href} onClose={() => setOpenCategory(null)} />
      )}
    </>
  );
}