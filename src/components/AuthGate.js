"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { signIn, logOut } from "@/lib/auth";
import { LogOut, ChevronDown } from "lucide-react";

export default function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3F9]">
        <p className="text-ink/40 text-sm">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3F9] px-6">
        <div className="text-center max-w-sm">
          <h1 className="font-display text-4xl mb-3">memo.log ✨</h1>
          <p className="text-ink/60 text-sm mb-8">
            A personal space to document life — your journal, your creative work,
            your little everyday moments, all in one place. Sign in to create your
            own archive.
          </p>
          <button
            onClick={signIn}
            className="bg-plum text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition"
          >
            Sign in with Google
          </button>
          <p className="text-xs text-ink/40 mt-4">
            First time here? Signing in automatically creates your own private space.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" key={user.uid}>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-xs text-ink/60 hover:text-ink bg-white/80 pl-1.5 pr-3 py-1.5 rounded-full transition shadow-sm"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-plum/20 flex items-center justify-center text-[10px] font-semibold text-plum">
              {user.email?.[0]?.toUpperCase()}
            </div>
          )}
          <span className="max-w-[140px] truncate">{user.email}</span>
          <ChevronDown size={12} />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden w-48 text-sm">
            <div className="px-4 py-3 border-b border-ink/5">
              <p className="text-ink/40 text-xs">Signed in as</p>
              <p className="text-ink/80 truncate">{user.email}</p>
            </div>
            <button
              onClick={logOut}
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 hover:bg-ink/5 text-ink/70"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}