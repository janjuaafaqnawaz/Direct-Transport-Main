/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  ArrowDownCircle,
  BadgeAlert,
  BadgeCheck,
  ImageIcon,
  Send,
  Sparkles,
} from "lucide-react";
import { User } from "@nextui-org/react";
import Image from "next/image";
import { PhotoView } from "react-photo-view";

const userImg =
  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1734353403~exp=1734357003~hmac=1dbbde6a9a2aef5817bcd7324f2f8b3e49602ae96cc46e4683b72e7b90319dd2&w=826";

const MessageRow = ({ index, style, msg, rowHeights, listRef }) => {
  const rowRef = useRef(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (rowRef.current) {
      const newHeight = rowRef.current.getBoundingClientRect().height;
      if (rowHeights.current[index] !== newHeight) {
        rowHeights.current[index] = newHeight;
        listRef.current?.resetAfterIndex(index);
      }
    }
  }, [msg, showImage]);

  return (
    <div ref={rowRef} style={{ ...style, height: "auto" }} className="w-full">
      <div
        className={`flex ${
          msg.sender === "admin" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs md:max-w-md ${
            msg.sender === "admin"
              ? "bg-gray-800 text-gray-300"
              : "bg-[#349ae7] text-white"
          } rounded-lg p-3 shadow-lg`}
        >
          {msg.message === "#IMAGE" && msg.url ? (
            <>
              {!showImage ? (
                <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-700 rounded">
                  <button
                    onClick={() => setShowImage(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Show Image
                  </button>
                </div>
              ) : (
                <PhotoView src={msg.url}>
                  <Image
                    src={msg.url}
                    alt="Sent image"
                    width={250}
                    height={250}
                    className="h-[250px] w-[250px] rounded"
                  />
                </PhotoView>
              )}
            </>
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
      </div>
    </div>
  );
};

const ChatInput = ({
  message,
  setMessage,
  handleSendMessage,
  handleSendImage,
  listRef,
  chat,
}) => (
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
        onClick={() => listRef.current?.scrollToItem(chat.length - 1, "end")}
        className="bg-white text-[#349ae7] rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <ArrowDownCircle size={20} />
      </button>
    </div>
  </div>
);

export default function RenderChat({
  sendMessage,
  handleSendImage,
  chat: liveChat,
  id,
  user,
}) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const listRef = useRef(null);
  const rowHeights = useRef({});

  useEffect(() => {
    setChat(liveChat.reverse());
    scrollToBottom();
  }, [liveChat, user]);

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToItem(0, "end");
  }, [chat.length]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
      scrollToBottom();
    }
  };

  const getItemSize = (index) => rowHeights.current[index] || 50;

  return (
    <div className="flex flex-col max-h-screen bg-white">
      <div className="bg-white pt-5 pl-4 h-20">
        <User
          avatarProps={{ src: userImg }}
          description={id}
          name={user?.firstName}
        />
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={chat.length}
              itemSize={getItemSize}
              ref={listRef}
              estimatedItemSize={100}
            >
              {({ index, style }) => (
                <MessageRow
                  index={index}
                  style={style}
                  msg={chat[index]}
                  rowHeights={rowHeights}
                  listRef={listRef}
                />
              )}
            </List>
          )}
        </AutoSizer>
      </div>
      <ChatInput
        message={message}
        setMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleSendImage={handleSendImage}
        listRef={listRef}
        chat={chat}
      />
      <Sparkles
        className="absolute top-7 right-20 text-blue-700 animate-pulse"
        size={24}
      />
    </div>
  );
}
