"use client";

import useAdminContext from "@/context/AdminProvider";
import { useEffect, useRef, useState } from "react";

export default function RootLayout({ children }) {
  const audioRef = useRef(null);
  const { chats } = useAdminContext();
  const [previousMessageCounts, setPreviousMessageCounts] = useState({});

  useEffect(() => {
    const notificationSound =
      localStorage.getItem("notificationSound") === "true";

    if (audioRef.current && notificationSound && chats?.length > 0) {
      const updatedMessageCounts = {};

      chats.forEach((chat) => {
        const chatId = chat.user.id;
        const previousCount = previousMessageCounts[chatId] || 0;
        const currentCount = chat.messages?.length || 0;

        updatedMessageCounts[chatId] = currentCount;

        if (currentCount > previousCount) {
          const newMessages = chat.messages.slice(previousCount);
          newMessages.forEach((msg) => {
            if (msg.sender !== "admin") {
              audioRef.current.play();
            }
          });
        }
      });

      setPreviousMessageCounts(updatedMessageCounts);
    }
  }, [chats, previousMessageCounts]);

  return (
    <>
      <audio ref={audioRef} src="/sound/notification.wav" preload="auto" />
      {children}
    </>
  );
}
