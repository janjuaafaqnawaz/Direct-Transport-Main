"use client";
import { Stats } from "@/components/Index";
import ManageInvoices from "@/components/tableSort/ManageInvoices/ManageInvoices";
import { useEffect, useState } from "react";
import { getCollection } from "@/api/firebase/functions/fetch";

export default function Page() {
  const [place_job, setPlace_job] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlace_job = await getCollection("place_job");
        setPlace_job(fetchedPlace_job);
        console.log("ds", fetchedPlace_job);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Stats />
      <ManageInvoices invoice={place_job} title={"Job"} />;
    </>
  );
}
