"use client";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { InvoicesDetials } from "@/components/Index";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const pathname = usePathname();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const match = pathname && pathname.match(/\/([^/]+)$/);
        const id = match && match[1];

        if (id) {
          let data = await fetchDocById(id, "place_bookings");

          if (!data) {
            data = await fetchDocById(id, "place_job");
            setInvoice(data);
          }

          setInvoice(data);
        }
      } catch (error) {
        // Handle errors
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoice();
  }, [pathname]);

  return (
    <div>
      {invoice ? <InvoicesDetials invoice={invoice} /> : <p>Loading...</p>}
    </div>
  );
}
