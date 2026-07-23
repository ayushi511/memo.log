"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { X } from "lucide-react";
import Link from "next/link";

const primaryField = {
  journal: "happened",
  psychology: "observation",
  creative: "title",
  kitchen: "dish",
  movies: "title",
  books: "title",
};

const popupTitles = {
  journal: "Journal entries",
  psychology: "Mind notes",
  creative: "Things I've made",
  kitchen: "Recipes I've tried",
  movies: "Movies I've watched",
  books: "Books I've read",
};

export default function CategoryPopup({ category, href, onClose }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(db, "entries"),
      where("userId", "==", user.uid),
      where("category", "==", category),
      orderBy("createdAt", "desc")
    );
    getDocs(q).then((snap) => {
      setEntries(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
  }, [category]);

  const recentPhotos = entries.filter((e) => e.imageUrl).slice(0, 2);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F7F3F9] rounded-3xl max-w-md w-full max-h-[75vh] overflow-y-auto relative shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-ink/10 sticky top-0 bg-[#F7F3F9] z-10">
          <h3 className="font-display text-lg">{popupTitles[category] || category}</h3>
          <button onClick={onClose} className="text-ink/40 hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {loading && <p className="text-sm text-ink/40">Loading...</p>}

          {!loading && recentPhotos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {recentPhotos.map((e) => (
                <div key={e.id} className="rounded-xl overflow-hidden bg-white/40">
                  <img src={e.imageUrl} alt="" className="w-full h-28 object-cover" />
                  <p className="text-[10px] text-ink/50 px-2 py-1 truncate">{e.date}</p>
                </div>
              ))}
            </div>
          )}

          {!loading && entries.length === 0 && (
            <p className="text-sm text-ink/50">Nothing here yet.</p>
          )}

          <div className="space-y-3">
            {entries.map((e) => {
              const title = e.fields?.[primaryField[category]] || "Untitled";
              return (
                <div key={e.id} className="flex items-center justify-between border-b border-ink/5 pb-2">
                  <p className="text-sm text-ink/80 truncate pr-3">{title}</p>
                  <p className="text-xs text-ink/40 shrink-0">{e.date}</p>
                </div>
              );
            })}
          </div>

          {entries.length > 0 && (
            <Link href={href} className="text-sm text-plum mt-4 inline-block">
              View all →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}