"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { User } from "@nextui-org/react";

export default function RenderChat({ sendMessage, chat: liveChat, id }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  useEffect(() => {
    setChat(liveChat);
  }, [liveChat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const user =
    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1734353403~exp=1734357003~hmac=1dbbde6a9a2aef5817bcd7324f2f8b3e49602ae96cc46e4683b72e7b90319dd2&w=826";

  return (
    <div className="flex flex-col  fixed top-0 bottom-0 left-0 right-0 bg-gradient-to-br  from-gray-800 via-indigo-700 to-blue-800">
      {/* Chat container with scroll */}
      <div className="bg-white pt-5 pl-4  h-20 ">
        <User
          avatarProps={{
            src: user,
          }}
          description={id}
          name="Driver"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div
          ref={chatContainerRef}
          className="h-full space-y-4 pr-4 scrollbar-thin scrollbar-thumb-indigo-500"
        >
          {chat?.length > 0 &&
            chat.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-800 text-gray-300"
                  } rounded-lg p-3 shadow-lg`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
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
            onClick={handleSendMessage}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Sparkles decoration */}
      <Sparkles
        className="absolute top-7 right-10 text-blue-700 animate-pulse"
        size={24}
      />
    </div>
  );
}
