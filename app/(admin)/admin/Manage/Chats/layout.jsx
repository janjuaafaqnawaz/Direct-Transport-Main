"use client";

import useAdminContext from "@/context/AdminProvider";
import { useEffect, useRef } from "react";

export default function RootLayout({ children }) {
  const audioRef = useRef(null);
  const { chats } = useAdminContext();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [chats]);

  return (
    <>
      <audio ref={audioRef} src="/sound/notification.wav" preload="auto" />
      {children}
    </>
  );
}
