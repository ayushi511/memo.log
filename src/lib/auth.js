"use client";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getApps } from "firebase/app";
import { app } from "@/lib/firebase";

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export function signIn() {
  return signInWithPopup(auth, provider);
}

export function logOut() {
  return signOut(auth);
}

export function watchAuth(callback) {
  return onAuthStateChanged(auth, callback);
}