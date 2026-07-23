"use client";

export default function MiniCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first

  const monthLabel = today.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const cells = Array.from({ length: startOffset }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div>
      <p className="text-sm font-semibold text-ink/70 mb-2">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="text-ink/40 font-medium pb-1">{d}</span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={`w-6 h-6 flex items-center justify-center rounded-full mx-auto ${
              day === today.getDate() ? "bg-plum text-white font-semibold" : "text-ink/60"
            }`}
          >
            {day || ""}
          </span>
        ))}
      </div>
    </div>
  );
}