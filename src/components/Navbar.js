"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, Palette, UtensilsCrossed, Clapperboard, Library, CalendarDays } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Today I...", href: "/journal", icon: BookOpen },
  { name: "Mind Notes", href: "/psychology", icon: Brain },
  { name: "Made This", href: "/creative", icon: Palette },
  { name: "Kitchen Diaries", href: "/kitchen", icon: UtensilsCrossed },
  { name: "Screen Time", href: "/movies", icon: Clapperboard },
  { name: "Bookshelf", href: "/books", icon: Library },
  { name: "Archive", href: "/archive", icon: CalendarDays },
];

export default function Navbar() {
  const pathname = usePathname();
  const { profile } = useProfile();

  return (
    <nav className="w-60 min-h-screen bg-white/50 px-5 py-8">
      <span className="font-display text-2xl block mb-10 px-3">
        {profile.name || "My"} <span className="text-plum">OS</span> ✨
      </span>
      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
  key={item.href}
  href={item.href}
  style={active ? { backgroundColor: "var(--accent)", opacity: 0.15 } : {}}
  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
    active ? "text-ink font-semibold" : "text-ink/60 hover:bg-white/60"
  }`}
>
            
              <Icon size={18} strokeWidth={1.75} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}