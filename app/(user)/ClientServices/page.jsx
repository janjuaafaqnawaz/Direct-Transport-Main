"use client";
import React, { useEffect, useState } from "react";
import { ClientServices, CAP } from "@/components/Index";
import { verifyAuth } from "@/api/firebase/functions/auth";

export default function Page() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const verifyAndSetRole = () => {
      let userDoc = localStorage.getItem("userDoc");
      if (userDoc) {
        try {
          userDoc = JSON.parse(userDoc);
          const role = userDoc?.role || null;
          setRole(role);
        } catch (error) {
          console.error("Failed to parse userDoc from localStorage", error);
          localStorage.removeItem("userDoc");
          verifyAuth();
        }
      } else {
        verifyAuth();
      }
    };

    verifyAndSetRole();
  }, []);

  return <ClientServices />;
}
