"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { postCustomIdDoc } from "@/api/firebase/functions/fetch";
import RenderChat from "./RenderChat";
import { app } from "@/api/firebase/config";

export default function Chat({ id }) {
  const [chat, setChat] = useState([]);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const db = getFirestore(app);

  const fetchDocById = async (id, collection) => {
    const docRef = doc(db, collection, id);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.exists() ? docSnapshot.data() : null;
  };

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chatDoc = await fetchDocById(id, "chats");

        if (!chatDoc) {
          await handleNewChat();
        }

        subscribeChat();
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    fetchChat();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [id]);

  const handleNewChat = async () => {
    try {
      const data = {
        id: id,
        driverEmail: id,
        messages: [],
      };

      await postCustomIdDoc(data, "chats", id);
    } catch (error) {
      console.log("Error creating new chat:", error);
    }
  };

  const subscribeChat = () => {
    try {
      const chatDocRef = doc(db, "chats", id);

      const unsubscribeFn = onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setChat(docSnapshot.data().messages);
        } else {
          console.log("Chat document does not exist!");
        }
      });

      setUnsubscribe(() => unsubscribeFn);
    } catch (error) {
      console.error("Error subscribing to chat:", error);
    }
  };
  const sendMessage = async (message) => {
    try {
      const chatDocRef = doc(db, "chats", id);
      const newMessage = {
        message,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = chat ? [...chat, newMessage] : [newMessage];

      await updateDoc(chatDocRef, {
        messages: updatedMessages,
      });

      setChat(updatedMessages);
    } catch (error) {
      console.log("Error sending message:", error);
    }
  };

  return <RenderChat sendMessage={sendMessage} chat={chat} id={id} />;
}
