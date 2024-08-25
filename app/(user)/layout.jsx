"use client";

import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../globals.css"

export default function RootLayout({ children }) {
  const nav = useRouter();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = async () => {
      try {
        const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
        const userRole = userDoc.role || null;
        setRole(userRole);

        if (!userRole) {
          nav.push("/Signin");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        nav.push("/Signin");
      }
    };

    auth();
  }, [nav]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {children}
    </>
  );
}
