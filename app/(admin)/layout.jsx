"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Stats } from "@/components/Index";
import { ScrollArea } from "@mantine/core";
import { ScrollShadow } from "@nextui-org/react";
import { AdminProvider } from "@/context/AdminProvider";
import Script from "next/script";

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
        } else if (role === "user" || role === "business") {
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

  const API = "AIzaSyACXmi5Hwi2SRE_VqmYqSI7gdLOa9neomg";

  return (
    <AdminProvider>
      <ScrollShadow>
        <ScrollArea>
          <Stats />
          {children}
          {API ? (
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${API}=places`}
            />
          ) : null}
        </ScrollArea>
      </ScrollShadow>
    </AdminProvider>
  );
}
