"use client";
import { useAuth } from "@/hooks/useAuth";
import { signIn, logOut } from "@/lib/auth";
import { LogOut } from "lucide-react";
import ThemeProvider from "@/components/ThemeProvider";

export default function AuthGate({ children }) {
  const { user, loading } = useAuth();

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
          <h1 className="font-display text-4xl mb-3">My Little Archive ✨</h1>
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
  <ThemeProvider>
  <div className="relative" key={user.uid}>
    <button
      onClick={logOut}
      className="fixed top-4 right-4 z-50 flex items-center gap-1.5 text-xs text-ink/50 hover:text-ink bg-white/70 px-3 py-1.5 rounded-full transition"
    >
      <LogOut size={14} /> {user.email}
    </button>
    {children}
  </div>
  </ThemeProvider>
);
}