"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { uploadImageToFirestore } from "@/api/firebase/functions/upload";
import RenderChat from "./RenderChat";
import { app } from "@/api/firebase/config";
import { ChatNotification } from "@/server/ChatNotification";

export default function Chat({ id, user }) {
  const [chat, setChat] = useState([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const db = getFirestore(app);

  const markMessagesAsSeen = useCallback(
    async (messages) => {
      const updatedMessages = messages.map((message) =>
        message.sender !== "admin" && !message.seen
          ? { ...message, seen: true }
          : message
      );

      const hasChanges = updatedMessages.some(
        (message, index) => message.seen !== messages[index].seen
      );

      if (hasChanges) {
        const chatDocRef = doc(db, "chats", id);
        await updateDoc(chatDocRef, { messages: updatedMessages });
      }

      return updatedMessages;
    },
    [db, id]
  );

  useEffect(() => {
    let unsubscribe;

    const fetchChat = async () => {
      try {
        const chatDocRef = doc(db, "chats", id);
        const chatDocSnapshot = await getDoc(chatDocRef);

        if (!chatDocSnapshot.exists()) {
          await createNewChat(chatDocRef);
        }

        unsubscribe = onSnapshot(chatDocRef, async (docSnapshot) => {
          if (docSnapshot.exists()) {
            let messages = docSnapshot.data().messages || [];
            const updatedMessages = await markMessagesAsSeen(messages);
            setChat(updatedMessages);
            setUnseenCount(calculateUnseenMessages(updatedMessages));
          } else {
            console.warn("Chat document does not exist!");
          }
        });
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
  }, [id, db, markMessagesAsSeen]);

  const createNewChat = async (chatDocRef) => {
    try {
      const newChatData = {
        user,
        id,
        driverEmail: id,
        messages: [
          {
            message: "Chat started by admin.",
            sender: "admin",
            timestamp: new Date().toISOString(),
            seen: false,
          },
        ],
      };

      await setDoc(chatDocRef, newChatData);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const sendMessage = useCallback(
    async (message) => {
      try {
        const newMessage = {
          message,
          sender: "admin",
          timestamp: new Date().toISOString(),
          seen: false,
        };

        ChatNotification(user.expoPushToken, message);
        await updateMessages(newMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [user.expoPushToken]
  );

  const sendPicture = useCallback(
    async (file) => {
      if (!file) {
        console.log("File cannot be empty.");
        return;
      }

      try {
        const url = await uploadImageToFirestore(file);

        if (!url) {
          console.log("Error uploading image.");
          return;
        }

        const newMessage = {
          message: "#IMAGE",
          url,
          sender: "admin",
          timestamp: new Date().toISOString(),
          seen: false,
        };

        ChatNotification(user.expoPushToken, "Image sent");
        await updateMessages(newMessage);
      } catch (error) {
        console.error("Error sending picture:", error);
      }
    },
    [user.expoPushToken]
  );
  
  const handleSendImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          sendPicture(event.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const updateMessages = useCallback(
    async (newMessage) => {
      try {
        const chatDocRef = doc(db, "chats", id);
        const chatDocSnapshot = await getDoc(chatDocRef);

        if (!chatDocSnapshot.exists()) {
          console.log("Chat document does not exist.");
          return;
        }

        const currentMessages = chatDocSnapshot.data().messages || [];
        const messages = [...currentMessages, newMessage];

        await updateDoc(chatDocRef, { messages });
      } catch (error) {
        console.error("Error updating messages:", error);
      }
    },
    [id, db]
  );

  const calculateUnseenMessages = (messages) => {
    return messages.reduce(
      (total, message) =>
        message.sender !== "admin" && !message.seen ? total + 1 : total,
      0
    );
  };

  return (
    <RenderChat
      sendMessage={sendMessage}
      handleSendImage={handleSendImage}
      chat={chat}
      unseenCount={unseenCount}
      id={id}
      user={user}
    />
  );
}
