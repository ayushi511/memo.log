"use client";
import { useHeatmapData } from "@/hooks/useHeatmapData";
import { Flame } from "lucide-react";

function levelColor(count) {
  if (count === 0) return "bg-ink/5";
  if (count === 1) return "bg-plum/30";
  if (count === 2) return "bg-plum/55";
  return "bg-plum/85";
}

export default function ActivityHeatmap() {
  const { days } = useHeatmapData();

  // group into weeks (columns), 7 rows each
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const totalDays = days.filter((d) => d.count > 0).length;

  return (
    <div className="bg-white/50 rounded-2xl p-4">
      <h3 className="font-display text-sm flex items-center gap-1.5 mb-1">
        <Flame size={15} className="text-plum" /> Activity
      </h3>
      <p className="text-xs text-ink/40 mb-3">{totalDays} days documented in the last 12 weeks</p>

      <div className="flex gap-1 overflow-x-auto">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => (
              <div
                key={day.date}
                title={`${day.date}: ${day.count} ${day.count === 1 ? "entry" : "entries"}`}
                className={`w-3 h-3 rounded-sm ${levelColor(day.count)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}