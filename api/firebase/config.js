"use client";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);
const realtimeDb = getDatabase(app);

// Firebase Configuration for Location-Tracking App
const firebaseConfigOFL = {
  apiKey: "AIzaSyD77nzoV_f6OnA2ebI6Ln-vj6V-0kNZWa8",
  authDomain: "location-tracking-9122b.firebaseapp.com",
  projectId: "location-tracking-9122b",
  storageBucket: "location-tracking-9122b.firebasestorage.app",
  messagingSenderId: "476599892713",
  appId: "1:476599892713:web:5a647dc2a720e89c9e8e78",
};

const appOFL = initializeApp(firebaseConfigOFL, "locationTrackingApp");

const realtimeDbOFL = getDatabase(appOFL);

export { app, realtimeDb, realtimeDbOFL };
