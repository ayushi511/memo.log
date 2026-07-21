"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, getDoc, where } from "firebase/firestore";
import { categoryStyles } from "@/lib/categoryStyles";
import { fieldsConfig } from "@/lib/fieldsConfig";
import { CalendarDays } from "lucide-react";
import { auth } from "@/lib/auth";
import EntryForm from "@/components/EntryForm";
import { deleteEntry, updateEntry, uploadImageToCloudinary } from "@/hooks/useEntries";

const moodLabels = {
  "😄": "Happy",
  "🙂": "Good",
  "😌": "Peaceful",
  "😐": "Meh",
  "😴": "Tired",
  "😤": "Frustrated",
  "😢": "Sad",
  "😰": "Anxious",
  "🥳": "Excited",
};

function renderValue(category, key, val) {
  const fieldDef = fieldsConfig[category]?.find((f) => f.name === key);
  if (!val) return null;
  if (fieldDef?.type === "rating") {
    const n = parseInt(val) || 0;
    return (
      <p key={key} className="text-sm mb-1">
        <span className="text-butter">{"★".repeat(n)}</span>
        <span className="text-ink/20">{"★".repeat(5 - n)}</span>
      </p>
    );
  }
  return (
    <div key={key} className="mb-2">
      {fieldDef?.label && <p className="text-xs font-semibold text-ink/40">{fieldDef.label}</p>}
      <p className="text-sm text-ink/80">{val}</p>
    </div>
  );
}

export default function Archive() {
  const [allEntries, setAllEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [dayWidget, setDayWidget] = useState(null);
  const [viewingEntry, setViewingEntry] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "entries"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setAllEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const byDate = allEntries.reduce((acc, e) => {
    acc[e.date] = acc[e.date] || [];
    acc[e.date].push(e);
    return acc;
  }, {});

  const dates = Object.keys(byDate).sort((a, b) => (a < b ? 1 : -1));

  const months = [...new Set(dates.map((d) => d.slice(0, 7)))].sort((a, b) => (a < b ? 1 : -1));
  const activeMonth = selectedMonth || months[0];
  const datesInMonth = dates.filter((d) => d.startsWith(activeMonth));

  const activeDate = selectedDate || datesInMonth[0];
  const shown = activeDate ? byDate[activeDate] || [] : [];

  useEffect(() => {
    if (!activeDate) return;
    const user = auth.currentUser;
    if (!user) return;
    getDoc(doc(db, "dailyWidgets", `${user.uid}_${activeDate}`)).then((snap) => {
      setDayWidget(snap.exists() ? snap.data() : null);
    });
  }, [activeDate]);

  function monthLabel(m) {
    const [y, mo] = m.split("-");
    return new Date(y, mo - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }

  return (
    <div>
      <h1 className="font-display text-3xl mb-2 flex items-center gap-2">
        <CalendarDays size={26} strokeWidth={1.75} className="text-plum" /> Archive
      </h1>
      <p className="text-ink/60 text-sm mb-6">A look back at all the little things. 💗</p>

      <div className="flex gap-8">
        <div className="w-52 shrink-0">
          <p className="text-xs font-semibold text-ink/40 uppercase mb-2">Month</p>
          <select
            value={activeMonth || ""}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              setSelectedDate(null);
            }}
            className="w-full bg-white/70 rounded-lg px-3 py-2 text-sm mb-5 focus:outline-none"
          >
            {months.map((m) => (
              <option key={m} value={m}>{monthLabel(m)}</option>
            ))}
          </select>

          <p className="text-xs font-semibold text-ink/40 uppercase mb-2">Days</p>
          <div className="space-y-1 max-h-[60vh] overflow-y-auto">
            {datesInMonth.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  activeDate === date ? "bg-plum text-white" : "text-ink/60 hover:bg-white/60"
                }`}
              >
                {date} <span className="opacity-70">({byDate[date].length})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {dayWidget && (dayWidget.reminder || dayWidget.focus || dayWidget.gratitude || dayWidget.mood) && (
            <div className="bg-white/50 rounded-2xl p-5 mb-6 flex flex-wrap gap-6">
              {dayWidget.mood && (
                <div>
                  <p className="text-xs font-semibold text-ink/40 uppercase">Mood</p>
                  <p className="text-2xl">
                    {dayWidget.mood} <span className="text-sm text-ink/70 align-middle">{moodLabels[dayWidget.mood] || ""}</span>
                  </p>
                </div>
              )}
              {dayWidget.reminder && (
                <div>
                  <p className="text-xs font-semibold text-ink/40 uppercase">📌 Reminder</p>
                  <p className="text-sm text-ink/80">{dayWidget.reminder}</p>
                </div>
              )}
              {dayWidget.focus && (
                <div>
                  <p className="text-xs font-semibold text-ink/40 uppercase">🎯 Focus</p>
                  <p className="text-sm text-ink/80">{dayWidget.focus}</p>
                </div>
              )}
              {dayWidget.gratitude && (
                <div>
                  <p className="text-xs font-semibold text-ink/40 uppercase">💗 Gratitude</p>
                  <p className="text-sm text-ink/80">{dayWidget.gratitude}</p>
                </div>
              )}
            </div>
          )}

          {activeDate && shown.length === 0 && <p className="text-ink/50 text-sm">Nothing on this day.</p>}
          {dates.length === 0 && <p className="text-ink/50 text-sm">No entries yet.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shown.map((entry) => {
              const style = categoryStyles[entry.category] || { label: entry.category, emoji: "✨", bgLight: "bg-white/50", stripe: "bg-plum" };
              return (
                <div key={entry.id} className={`${style.bgLight} rounded-2xl break-inside-avoid relative`}>
                  <div className="rounded-2xl overflow-hidden">
                    <div className={`${style.stripe} h-1.5`} />
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-ink/70 uppercase tracking-wide">
                          {style.emoji} {style.label}
                        </span>
                        <button
                          onClick={() => setViewingEntry(entry)}
                          className="text-ink/40 hover:text-ink/80 px-2 leading-none"
                        >
                          ⋮
                        </button>
                      </div>
                      {entry.imageUrl && (
                        <img src={entry.imageUrl} alt="" className="rounded-xl my-3 w-full object-contain bg-white/40" />
                      )}
                      {Object.entries(entry.fields || {}).map(([key, val]) => renderValue(entry.category, key, val))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {viewingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F7F3F9] rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative">
            <button
              onClick={() => setViewingEntry(null)}
              className="absolute top-5 right-5 text-ink/40 hover:text-ink"
            >
              ✕
            </button>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-ink/70 uppercase tracking-wide">
                  {(categoryStyles[viewingEntry.category] || {}).emoji} {(categoryStyles[viewingEntry.category] || {}).label}
                </span>
                <span className="text-xs text-ink/40">{viewingEntry.date}</span>
              </div>

              {viewingEntry.imageUrl && (
                <img src={viewingEntry.imageUrl} alt="" className="rounded-xl mb-4 w-full object-contain bg-white/40" />
              )}

              {Object.entries(viewingEntry.fields || {}).map(([key, val]) => renderValue(viewingEntry.category, key, val))}

              <div className="flex gap-3 mt-6 pt-6 border-t border-ink/10">
                <button
                  onClick={() => {
                    setEditingEntry(viewingEntry);
                    setViewingEntry(null);
                  }}
                  className="flex-1 bg-plum text-white px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => {
                    setDeletingId(viewingEntry.id);
                    setViewingEntry(null);
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deletingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80">
            <p className="text-sm mb-4">Delete this entry? This can't be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingId(null)} className="text-sm px-4 py-2">
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deleteEntry(deletingId);
                  setDeletingId(null);
                }}
                className="text-sm px-4 py-2 bg-red-500 text-white rounded-full"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingEntry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F7F3F9] rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Edit entry</h3>
                <button onClick={() => setEditingEntry(null)} className="text-ink/40">
                  ✕
                </button>
              </div>
              <EntryForm
                category={editingEntry.category}
                fields={fieldsConfig[editingEntry.category] || []}
                initialValues={editingEntry.fields}
                onSubmit={async ({ values, imageFile }) => {
                  let imageUrl = editingEntry.imageUrl;
                  if (imageFile) {
                    imageUrl = await uploadImageToCloudinary(imageFile);
                  }
                  await updateEntry(editingEntry.id, {
                    text: values.text || "",
                    fields: values,
                    imageUrl,
                  });
                  setEditingEntry(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}