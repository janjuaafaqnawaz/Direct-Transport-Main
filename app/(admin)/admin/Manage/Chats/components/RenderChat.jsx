"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  BadgeAlert,
  BadgeCheck,
  ImageIcon,
  Send,
  Sparkles,
} from "lucide-react";
import { Chip, User } from "@nextui-org/react";
import Image from "next/image";
import { PhotoView } from "react-photo-view";

const userImg =
  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1734353403~exp=1734357003~hmac=1dbbde6a9a2aef5817bcd7324f2f8b3e49602ae96cc46e4683b72e7b90319dd2&w=826";

export default function RenderChat({
  sendMessage,
  handleSendImage,
  chat: liveChat,
  id,
  user,
}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView();
    setTimeout(() => {
      bottomRef.current?.scrollIntoView();
    }, 100);
  };

  useEffect(() => {
    setChat(liveChat);
    scrollToBottom();
  }, [liveChat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (today.toDateString() === messageDate.toDateString()) {
      return "Today";
    }

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (yesterday.toDateString() === messageDate.toDateString()) {
      return "Yesterday";
    }

    return messageDate.toLocaleDateString("en-GB");
  };

  const renderMessagesWithDateSeparators = () => {
    let lastDate = null;

    return chat.map((msg, index) => {
      const messageDate = new Date(msg.timestamp).toDateString();
      const showDateSeparator = lastDate !== messageDate;
      lastDate = messageDate;

      return (
        <div key={index} className="w-full">
          {showDateSeparator && (
            <div className="w-full flex justify-center">
              <Chip className="mx-auto" size="lg" color="default">
                {formatDate(msg.timestamp)}
              </Chip>
            </div>
          )}
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              msg.sender === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              ref={bottomRef}
              className={`max-w-xs md:max-w-md ${
                msg.sender === "admin"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-[#349ae7] text-white"
              } rounded-lg p-3 shadow-lg`}
            >
              {msg.message === "#IMAGE" && msg.url ? (
                <PhotoView key={msg.url} src={msg.url}>
                  <Image
                    src={msg.url}
                    alt="Sent image"
                    width={300}
                    height={300}
                    className="max-w-full h-auto rounded"
                  />
                </PhotoView>
              ) : (
                <p className="text-sm">{msg.message}</p>
              )}

              <p className="text-xs mt-1 opacity-70 flex flex-row items-center justify-between">
                {new Date(msg?.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
                <div className="ml-3">
                  {msg?.seen === true ? (
                    <BadgeCheck
                      size={15}
                      color={msg.sender === "admin" ? "#349ae7" : "white"}
                    />
                  ) : (
                    <BadgeAlert size={15} />
                  )}
                </div>
              </p>
            </div>
          </motion.div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col  max-h-screen bg-white" ref={bottomRef}>
      <div className="bg-white pt-5 pl-4 h-20">
        <User
          avatarProps={{
            src: userImg,
          }}
          description={id}
          name={user?.firstName}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
        <div className="space-y-4 pr-4" ref={bottomRef}>
          {chat?.length > 0 && renderMessagesWithDateSeparators()}
        </div>
      </div>
      {/* Input and Send Button */}
      <div className="p-4 bg-opacity-20 backdrop-blur-lg bg-gray-900">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendImage}
            className="bg-[#349ae7] text-white rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ImageIcon alt="logo" size={20} />
          </button>
          <button
            onClick={handleSendMessage}
            className="bg-[#349ae7] text-white rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Send size={20} />
          </button>
          <button
            onClick={scrollToBottom}
            className="bg-white text-[#349ae7] rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <ArrowDownCircle size={20} />
          </button>
        </div>
      </div>
      {/* Sparkles decoration */}
      <Sparkles
        onClick={scrollToBottom}
        className="absolute top-7 right-20 text-blue-700 animate-pulse"
        size={24}
      />
    </div>
  );
}
