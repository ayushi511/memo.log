"use client";
import { LineChart, Line, XAxis, ResponsiveContainer } from "recharts";
import { useWeekStats } from "@/hooks/useWeekStats";
import { CalendarRange } from "lucide-react";

export default function WeeklyOverview() {
  const { chartData, totalEntries, photosCount, streak } = useWeekStats();

  return (
    <div className="bg-white/50 rounded-2xl p-4 h-full">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3 className="font-display text-sm flex items-center gap-1.5 mb-3">
            <CalendarRange size={15} className="text-plum" /> Weekly overview
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[9px] text-ink/40 uppercase">Entries</p>
              <p className="font-display text-lg">{totalEntries}</p>
            </div>
            <div>
              <p className="text-[9px] text-ink/40 uppercase">Photos</p>
              <p className="font-display text-lg">{photosCount}</p>
            </div>
            <div>
              <p className="text-[9px] text-ink/40 uppercase">Streak</p>
              <p className="font-display text-lg">{streak}d</p>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <ResponsiveContainer width="100%" height={70}>
            <LineChart data={chartData}>
              <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#3A2E4299" }} axisLine={false} tickLine={false} />
              <Line type="monotone" dataKey="entries" stroke="#8B6F9E" strokeWidth={2} dot={{ r: 3, fill: "#8B6F9E" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}