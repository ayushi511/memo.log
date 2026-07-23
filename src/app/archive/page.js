"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, getDoc, where } from "firebase/firestore";
import { categoryStyles } from "@/lib/categoryStyles";
import { fieldsConfig } from "@/lib/fieldsConfig";
import { CalendarDays, Search } from "lucide-react";
import { auth } from "@/lib/auth";
import EntryForm from "@/components/EntryForm";
import { deleteEntry, updateEntry, uploadImageToCloudinary } from "@/hooks/useEntries";

const moodLabels = {
  "😄": "Happy", "🙂": "Good", "😌": "Peaceful", "😐": "Meh",
  "😴": "Tired", "😤": "Frustrated", "😢": "Sad", "😰": "Anxious", "🥳": "Excited",
};
const primaryField = {
  journal: "happened",
  psychology: "observation",
  creative: "title",
  kitchen: "dish",
  movies: "title",
  books: "title",
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
  const [monthFilter, setMonthFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
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

  const months = [...new Set(allEntries.map((e) => e.date?.slice(0, 7)))].filter(Boolean).sort((a, b) => (a < b ? 1 : -1));

  function monthLabel(m) {
    const [y, mo] = m.split("-");
    return new Date(y, mo - 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }

  const filtered = allEntries.filter((e) => {
  if (monthFilter !== "all" && !e.date?.startsWith(monthFilter)) return false;
  if (categoryFilter !== "all" && e.category !== categoryFilter) return false;
  if (searchTerm) {
    const text = Object.values(e.fields || {}).join(" ").toLowerCase();
    if (!text.includes(searchTerm.toLowerCase())) return false;
  }
  return true;
});

  return (
    <div>
      <h1 className="font-display text-2xl mb-1 flex items-center gap-2">
        <CalendarDays size={22} strokeWidth={1.75} className="text-plum" /> Archive
      </h1>
      <p className="text-sm text-ink/50 italic mb-6">A home for the little moments.</p>

      <div className="flex gap-6">
        <div className="w-48 shrink-0 space-y-5">
          <div>
            <p className="text-xs font-semibold text-ink/40 uppercase mb-2">Filter by</p>
            <p className="text-xs text-ink/50 mb-1">Month</p>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full bg-white/70 rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              <option value="all">All time</option>
              {months.map((m) => (
                <option key={m} value={m}>{monthLabel(m)}</option>
              ))}
            </select>
          </div>
          <div>
  <p className="text-xs text-ink/50 mb-1">Category</p>
  <select
    value={categoryFilter}
    onChange={(e) => setCategoryFilter(e.target.value)}
    className="w-full bg-white/70 rounded-lg px-3 py-2 text-sm focus:outline-none"
  >
    <option value="all">All entries</option>
    <option value="journal">Today I...</option>
    <option value="psychology">Mind Notes</option>
    <option value="creative">Made This</option>
    <option value="kitchen">Kitchen Diaries</option>
    <option value="movies">Screen Time</option>
    <option value="books">Bookshelf</option>
  </select>
</div>
          <div>
            <p className="text-xs text-ink/50 mb-1">Search</p>
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-2.5 text-ink/30" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search entries..."
                className="w-full bg-white/70 rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex-1">
          {filtered.length === 0 && <p className="text-ink/50 text-sm">No entries found.</p>}

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {filtered.map((entry) => {
              const style = categoryStyles[entry.category] || { label: entry.category, emoji: "✨", bgLight: "bg-white/50", stripe: "bg-plum" };
              const preview = entry.fields?.[primaryField[entry.category]] || Object.values(entry.fields || {}).filter(Boolean)[0];
              return (
                <button
                  key={entry.id}
                  onClick={() => setViewingEntry(entry)}
                  className={`${style.bgLight} rounded-2xl overflow-hidden break-inside-avoid text-left w-full block`}
                >
                  <div className={`${style.stripe} h-1.5`} />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-ink/70 uppercase tracking-wide">
                        {style.emoji} {style.label}
                      </span>
                      <span className="text-xs text-ink/40">{entry.date}</span>
                    </div>
                    {entry.imageUrl && (
                      <img src={entry.imageUrl} alt="" className="rounded-xl mb-2 w-full max-h-40 object-cover" />
                    )}
                    {preview && <p className="text-sm text-ink/80 line-clamp-3">{preview}</p>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {viewingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#F7F3F9] rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto relative">
            <button onClick={() => setViewingEntry(null)} className="absolute top-5 right-5 text-ink/40 hover:text-ink">✕</button>
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
                  onClick={() => { setEditingEntry(viewingEntry); setViewingEntry(null); }}
                  className="flex-1 bg-plum text-white px-4 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => { setDeletingId(viewingEntry.id); setViewingEntry(null); }}
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
              <button onClick={() => setDeletingId(null)} className="text-sm px-4 py-2">Cancel</button>
              <button
                onClick={async () => { await deleteEntry(deletingId); setDeletingId(null); }}
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
                <button onClick={() => setEditingEntry(null)} className="text-ink/40">✕</button>
              </div>
              <EntryForm
                category={editingEntry.category}
                fields={fieldsConfig[editingEntry.category] || []}
                initialValues={editingEntry.fields}
                onSubmit={async ({ values, imageFile }) => {
                  let imageUrl = editingEntry.imageUrl;
                  if (imageFile) imageUrl = await uploadImageToCloudinary(imageFile);
                  await updateEntry(editingEntry.id, { text: values.text || "", fields: values, imageUrl });
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