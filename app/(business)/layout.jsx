"use client";

import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const nav = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = async () => {
      try {
        const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
        const role = userDoc.role || null;

        if (!role || role === "archived") {
          nav.push("/Signin");
        } else if (role === "user") {
          nav.push("/ClientServices");
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

  return <>{children}</>;
}
