"use client";

import React, { useEffect, useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import Chat from "./components/Chat";
import { ChevronRight, Home, VolumeXIcon } from "lucide-react";
import { Switch, Tooltip } from "@mantine/core";
import Link from "next/link";
import { VolumeUpSharp } from "@mui/icons-material";
import Image from "next/image";

export default function AllChats() {
  const { chats } = useAdminContext();
  const [user, setUser] = useState(null);
  const [isNotificationSoundOn, setIsNotificationSoundOn] = useState(() => {
    return localStorage.getItem("notificationSound") === "true";
  });

  useEffect(() => {
    if (user && chats) {
      const updatedUser = chats.find((chat) => chat.user.email === user.email);
      if (!updatedUser) setUser(null);
    }
  }, [chats]);

  useEffect(() => {
    const mode = localStorage.getItem("notificationSound") === "true";
    setIsNotificationSoundOn(mode);
  }, []);

  const handleToggle = (event) => {
    const value = event.currentTarget.checked;
    setIsNotificationSoundOn(value);
    localStorage.setItem("notificationSound", value);
  };

  const unReadMessage = (email) => {
    if (!chats || !email) {
      console.log("No chats available or email is undefined/null.");
      return 0;
    }

    const myChat = chats.find((chat) => chat.user.email === email);
    if (!myChat) {
      console.log(`No chat found for email: ${email}`);
      return 0;
    }

    const messages = myChat.messages || [];

    const unRead = messages.filter(
      (message) => !message.seen && message.sender === "user"
    );
    return unRead.length || 0;
  };

  const orderedChats =
    chats?.length > 0 &&
    chats.sort((chatA, chatB) => {
      const lastMessageA = chatA?.messages?.[chatA.messages.length - 1] || null;
      const lastMessageB = chatB?.messages?.[chatB.messages.length - 1] || null;

      const timestampA = lastMessageA
        ? new Date(lastMessageA.timestamp).getTime()
        : 0;
      const timestampB = lastMessageB
        ? new Date(lastMessageB.timestamp).getTime()
        : 0;

      return timestampB - timestampA;
    });

  return (
    <div className="min-h-screen w-screen fixed top-0 bottom-0 left-0 right-0 pl-5 bg-white p-1 grid grid-cols-4">
      <div className=" w-full mx-auto bg-white rounded-xl overflow-hidden">
        <div className="pr-3 w-full">
          <div className=" ml-5">
            <Image
              src="/Direct-Transport-Solutions-2.png"
              height={200}
              width={400}
              alt="logo"
              className="h-20 my-10 w-auto"
            />
            <div className="flex align-middle justify-around items-center gap-3 mb-3">
              <Switch
              className="-m-8"
                size="lg"
                checked={isNotificationSoundOn}
                onChange={handleToggle}
                thumbIcon={
                  isNotificationSoundOn ? (
                    <VolumeUpSharp
                      style={{ width: 12, height: 12, color: "teal" }}
                    />
                  ) : (
                    <VolumeXIcon
                      style={{ width: 12, height: 12, color: "red" }}
                    />
                  )
                }
                label="Notifications"
              />
              <Tooltip
                label="Go Home"
                className="text-black animate-pulse cursor-pointer"
              >
                <Link href="/">
                  <Home size={24} />
                </Link>
              </Tooltip>
            </div>
            <p className="font-semibold text-gray-800">
              Sorted by most recent chat.
            </p>
          </div>
          <div className=" gap-3">
            {chats?.length > 0 &&
              orderedChats.map((chat) => {
                const unSeenCount = unReadMessage(chat.user.email);

                return (
                  <div
                    key={chat.user.id}
                    className="block mx-3 cursor-pointer"
                    onClick={() => setUser(chat.user)}
                  >
                    <div className="bg-gray-50 rounded-lg p-2 my-2 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-100 flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
                          <span className="text-xl font-semibold text-indigo-600">
                            {chat.user.firstName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h6 className="text-md font-semibold text-gray-800">
                            {chat.user.firstName}
                          </h6>
                          <p className="text-xs text-gray-600">
                            {chat.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-indigo-600">
                        {unSeenCount > 0 && (
                          <p className="bg-[#4f46e5] p-3 rounded-full aspect-square text-white">
                            {unSeenCount}
                          </p>
                        )}
                        <ChevronRight className="ml-2" size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <div className="grid col-span-3   bg-white rounded-xl shadow-lg w-full  mx-auto">
        {user && <Chat key={user} id={user.email} user={user} />}
      </div>
    </div>
  );
}
