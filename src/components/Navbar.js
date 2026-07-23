"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, Palette, UtensilsCrossed, Clapperboard, Library, CalendarDays, Sparkles } from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Journal", href: "/journal", icon: BookOpen },
  { name: "Mind Notes", href: "/psychology", icon: Brain },
  { name: "Made This", href: "/creative", icon: Palette },
  { name: "Kitchen", href: "/kitchen", icon: UtensilsCrossed },
  { name: "Screen Time", href: "/movies", icon: Clapperboard },
  { name: "Bookshelf", href: "/books", icon: Library },
  { name: "Archive", href: "/archive", icon: CalendarDays },
  
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur border-t border-ink/10 flex justify-center z-40">
      <div className="flex gap-1 px-4 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-[10px] transition shrink-0 ${
                active ? "bg-plum/15 text-plum font-semibold" : "text-ink/50 hover:bg-ink/5"
              }`}
            >
              <Icon size={17} strokeWidth={1.75} />
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}