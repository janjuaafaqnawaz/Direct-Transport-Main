"use client";

import React, { useEffect, useState } from "react";
import {
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  postCustomIdDoc,
  uploadImageToFirestore,
} from "@/api/firebase/functions/upload";
import RenderChat from "./RenderChat";
import { app } from "@/api/firebase/config";
import { ChatNotification } from "@/server/ChatNotification";

export default function Chat({ id, user }) {
  const [chat, setChat] = useState([]);
  const db = getFirestore(app);

  useEffect(() => {
    let unsubscribe;

    const fetchChat = async () => {
      try {
        const chatDoc = await fetchDocById(id, "chats");

        if (!chatDoc) {
          await createNewChat();
        }

        unsubscribe = subscribeToChat();
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

  const fetchDocById = async (docId, collection) => {
    try {
      const docRef = doc(db, collection, docId);
      const docSnapshot = await getDoc(docRef);
      return docSnapshot.exists() ? docSnapshot.data() : null;
    } catch (error) {
      console.error("Error fetching document by ID:", error);
      return null;
    }
  };

  const createNewChat = async () => {
    try {
      const newChatData = {
        user,
        id,
        driverEmail: id,
        messages: [],
      };

      await postCustomIdDoc(newChatData, "chats", id);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const subscribeToChat = () => {
    try {
      const chatDocRef = doc(db, "chats", id);

      return onSnapshot(chatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setChat(docSnapshot.data().messages);
        } else {
          console.warn("Chat document does not exist!");
        }
      });
    } catch (error) {
      console.error("Error subscribing to chat:", error);
      return null;
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

      ChatNotification(user.expoPushToken, message);

      const updatedMessages = [...chat, newMessage];

      await updateDoc(chatDocRef, { user, messages: updatedMessages });
      setChat(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const sendPicture = async (message) => {
    if (!message || !message.trim()) {
      console.log("Message cannot be empty.");
      return;
    }

    try {
      const url = await uploadImageToFirestore(message);

      if (!url) {
        console.log("Error uploading image.");
        return;
      }

      const chatDocRef = doc(db, "chats", id);
      const newMessage = {
        message: "#IMAGE",
        url,
        sender: "user",
        timestamp: new Date().toISOString(),
      };

      ChatNotification(user.expoPushToken, message);

      const updatedMessages = [...chat, newMessage];

      await updateDoc(chatDocRef, { user, messages: updatedMessages });
      setChat(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <RenderChat
      sendMessage={sendMessage}
      sendPicture={sendPicture}
      chat={chat}
      id={id}
      user={user}
    />
  );
}
