"use client"
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyD3FGI3-A4LF7Cr0PyqgwKvRmJDIGE6gFc",
    authDomain: "couriers-946ec.firebaseapp.com",
    projectId: "couriers-946ec",
    storageBucket: "couriers-946ec.appspot.com",
    messagingSenderId: "828818568390",
    appId: "1:828818568390:web:aa706c769c69c92f8093c7",
    measurementId: "G-HD9NTD86S6"
};

export const app = initializeApp(firebaseConfig);