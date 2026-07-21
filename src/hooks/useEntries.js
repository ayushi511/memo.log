"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { auth } from "@/lib/auth";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export function useEntries(category) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "entries"),
      where("category", "==", category),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [category]);

  async function addEntry({ text, fields = {}, imageFile = null }) {
    const user = auth.currentUser;
    if (!user) throw new Error("Not signed in");

    let imageUrl = null;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      imageUrl = data.secure_url;
    }

    await addDoc(collection(db, "entries"), {
      category,
      text,
      fields,
      imageUrl,
      userId: user.uid,
      date: new Date().toISOString().split("T")[0],
      createdAt: serverTimestamp(),
    });
  }

  return { entries, loading, addEntry };
}

export function useRecentEntries(limitCount = 5) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "entries"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [limitCount]);

  return { entries, loading };
}

export async function deleteEntry(id) {
  await deleteDoc(doc(db, "entries", id));
}

export async function updateEntry(id, { text, fields, imageUrl }) {
  await updateDoc(doc(db, "entries", id), {
    text,
    fields,
    imageUrl,
    updatedAt: serverTimestamp(),
  });
}

export async function uploadImageToCloudinary(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );
  const data = await res.json();
  return data.secure_url;
}