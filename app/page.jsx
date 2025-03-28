"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader } from "@/components/Index";

export default function Page() {
  const navigate = useRouter();
  useEffect(() => {
    navigate.replace("/ClientServices");
  }, [navigate]);
 
  return <Loader />;
}

// End of page.jsx file
