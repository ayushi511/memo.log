"use client";
import { useState } from "react";
import { PenLine, Settings, Sparkles } from "lucide-react";
import { useDailyWidget } from "@/hooks/useDailyWidget";
import { useProfile } from "@/hooks/useProfile";
import { useWeeklySummary } from "@/hooks/useWeeklySummary";
import EditProfileModal from "@/components/EditProfileModal";
import WeeklyOverview from "@/components/WeeklyOverview";
import MoodTrackerCard from "@/components/MoodTrackerCard";
import MiniCalendar from "@/components/MiniCalendar";
import CategoryCards from "@/components/CategoryCards";
import ActivityHeatmap from "@/components/ActivityHeatmap";

export default function Home() {
  const { data: widgets } = useDailyWidget();
  const { profile, saveProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [recapPeriod, setRecapPeriod] = useState("week");
  const { summary, loading: summaryLoading } = useWeeklySummary(recapPeriod);

  return (
    <div>
      <div className="flex items-start justify-between mb-2 pr-40">
        <h1 className="font-display text-4xl -ml-0.5">
          Hi, I'm {profile.name || "..."} <span className="text-rose">💜</span>
        </h1>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-ink transition shrink-0"
        >
          <Settings size={13} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.7fr_1fr_1.2fr] gap-4 items-start mb-5">
        <div>
          {profile.intro ? (
            profile.intro.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm text-ink/70 mb-2 leading-relaxed">{para}</p>
            ))
          ) : (
            <p className="text-sm text-ink/50 italic">
              Click "Edit" above to introduce yourself and personalize your space.
            </p>
          )}
        </div>

        <div className="bg-rose/15 rounded-2xl p-4 flex flex-col items-center gap-3">
          <MiniCalendar />
          
           <a href="/journal"
            className="inline-flex items-center justify-center gap-1.5 text-white px-4 py-2 rounded-full text-xs font-medium hover:opacity-90 transition w-full"
            style={{ backgroundColor: profile.accentColor }}
          >
            <PenLine size={13} /> New entry
          </a>
        </div>

        <div className="bg-butter/30 rounded-2xl p-4 flex flex-col items-center justify-center">
          {profile.photoUrl && (
            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm rotate-[-2deg] bg-white p-1 mb-2">
              <img src={profile.photoUrl} alt={profile.name} className="w-full h-full object-cover rounded-lg" />
            </div>
          )}
          <p className="font-semibold text-sm">💗 About me</p>
          <p className="text-xs text-ink/60 text-center mt-0.5">
            {profile.name ? `just ${profile.name}, collecting little moments` : "Add photo & intro"}
          </p>
        </div>

        <div className="bg-plum/15 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-semibold text-sm flex items-center gap-1.5">
              <Sparkles size={14} /> Recap
            </p>
            <select
              value={recapPeriod}
              onChange={(e) => setRecapPeriod(e.target.value)}
              className="text-[10px] bg-white/60 rounded-full px-2 py-1 focus:outline-none"
            >
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="year">This year</option>
            </select>
          </div>
          <p className="text-xs text-ink/70 italic leading-relaxed">
            {summaryLoading ? "Reading your entries..." : summary}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2">
          <WeeklyOverview />
        </div>
        <div>
          <MoodTrackerCard />
        </div>
      </div>

      <div className="mb-5">
        <ActivityHeatmap />
      </div>

      <div className="mb-5">
        <CategoryCards />
      </div>

      <div className="bg-plum/10 rounded-full px-5 py-2.5 text-center text-sm text-ink/60 italic">
        Collect moments, not things. 💜
      </div>

      {editing && (
        <EditProfileModal profile={profile} onSave={saveProfile} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}