"use client";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyANVScPB8u2z0NinfQn4ZkkmvQqLkpkJ5E",
  authDomain: "couriers-946ec.firebaseapp.com",
  projectId: "couriers-946ec",
  storageBucket: "couriers-946ec.appspot.com",
  messagingSenderId: "828818568390",
  appId: "1:828818568390:web:432896e276b7b88a8093c7",
  measurementId: "G-K2MVCFJHQ1",
};

const app = initializeApp(firebaseConfig);
const realtimeDb = getDatabase(app);

export { app, realtimeDb };
