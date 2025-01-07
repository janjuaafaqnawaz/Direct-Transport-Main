"use client";

import useAdminContext from "@/context/AdminProvider";
import { useEffect, useRef, useState } from "react";

export default function RootLayout({ children }) {
  const audioRef = useRef(null);
  const { chats } = useAdminContext();
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

  useEffect(() => {
    const currentMessageCount = chats.reduce((total, chat) => {
      return total + (chat.messages?.length || 0);
    }, 0);

    if (audioRef.current && currentMessageCount > previousMessageCount) {
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
