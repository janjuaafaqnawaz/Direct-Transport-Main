"use client";

import React from "react";
import useAdminContext from "@/context/AdminProvider";
import Link from "next/link";
import { Users, MessageCircle, ChevronRight } from "lucide-react";

export default function AllChats() {
  const { allDrivers } = useAdminContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <Users className="mr-2" />
            All Chats
          </h1>
          <div className="grid grid-cols-2 gap-3">
            {allDrivers &&
              allDrivers.map((driver) => (
                <Link
                  href={`/admin/Manage/Chats/${driver.email}`}
                  key={driver.id}
                  className="block mx-3" 
                >
                  <div className="bg-gray-50 rounded-lg p-4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-100 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-indigo-600">
                          {driver.firstName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {driver.firstName}
                        </h2>
                        <p className="text-sm text-gray-600">{driver.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-indigo-600">
                      <MessageCircle className="mr-2" size={20} />
                      <span className="text-sm font-medium">Chat</span>
                      <ChevronRight className="ml-2" size={20} />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
