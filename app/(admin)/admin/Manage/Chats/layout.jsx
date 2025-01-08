"use client";

import useAdminContext from "@/context/AdminProvider";
import { useEffect, useRef, useState } from "react";

export default function RootLayout({ children }) {
  const audioRef = useRef(null);
  const { chats } = useAdminContext();
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  useEffect(() => {
    const notificationSound =
      localStorage.getItem("notificationSound") === "true";
    console.log(notificationSound);
    const currentMessageCount =
      chats &&
      chats?.length > 0 &&
      chats?.reduce((total, chat) => {
        return total + (chat.messages?.length || 0);
      }, 0);

    if (
      audioRef.current &&
      currentMessageCount > previousMessageCount &&
      notificationSound
    ) {
      audioRef.current.play();
    }

    setPreviousMessageCount(currentMessageCount);
  }, [chats]);

  return (
    <>
      <audio ref={audioRef} src="/sound/notification.wav" preload="auto" />
      {children}
    </>
  );
}
