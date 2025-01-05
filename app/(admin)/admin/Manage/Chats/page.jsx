"use client";

import React, { useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import Chat from "./components/Chat";
import { Users, ChevronRight, Home } from "lucide-react";
import { Tooltip } from "@mantine/core";
import Link from "next/link";

export default function AllChats() {
  const { allDrivers } = useAdminContext();
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen w-screen fixed top-0 bottom-0 left-0 right-0 pl-5 bg-white p-1 grid grid-cols-4">
      <div className=" w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="pr-3 w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Tooltip
              label="Go Home"
              className="text-black animate-pulse cursor-pointer mx-4"
            >
              <Link href="/">
                <Home size={24} />
              </Link>
            </Tooltip>
            <Users className="mr-2" />
            All Chats
          </h1>
          <div className=" gap-3">
            {allDrivers &&
              allDrivers.map((driver) => (
                <div
                  key={driver.id}
                  className="block mx-3 cursor-pointer"
                  onClick={() => setUser(driver)}
                >
                  <div className="bg-gray-50 rounded-lg p-2 my-2 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-100 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-indigo-600">
                          {driver.firstName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h6 className="text-md font-semibold text-gray-800">
                          {driver.firstName}
                        </h6>
                        <p className="text-xs text-gray-600">{driver.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-indigo-600">
                      {/* <MessageCircle className="mr-2" size={20} /> */}
                      {/* <span className="text-sm font-medium">Chat</span> */}
                      <ChevronRight className="ml-2" size={20} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="grid col-span-3   bg-white rounded-xl shadow-lg w-full  mx-auto">
        {user && <Chat key={user} id={user.email} user={user} />}
      </div>
    </div>
  );
}
