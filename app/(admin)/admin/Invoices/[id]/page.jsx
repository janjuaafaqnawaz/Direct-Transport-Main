"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { InvoicesDetials, CAP } from "@/components/Index";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Button, Input, Modal, NumberInput, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function Page() {
  const pathname = usePathname();
  const [invoice, setInvoice] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [load, setLoad] = useState(false); // Added loading state

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      const match = pathname && pathname.match(/\/([^/]+)$/);
      const id = match && match[1];

      if (id) {
        const data = await fetchDocById(id, "place_bookings");
        setInvoice(data);
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchInvoice();
  }, [pathname]);

  useEffect(() => {
    const userRole =
      (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    setRole(userRole);
  }, []);

  const updateInvoice = async (updatedData) => {
    await updateDoc("place_bookings", invoice.docId, updatedData);
  };

  const handleSubmit = async () => {
    try {
      setLoad(true);

      const res = await fetchDocById("GST", "data");
      if (!res || !res.GST) {
        throw new Error("Failed to fetch GST value");
      }

      const gstVal = parseFloat(res.GST);
      if (isNaN(gstVal)) {
        throw new Error("Invalid GST value");
      }

      const price = parseFloat(invoice?.totalPrice) || 0;
      const unloading = parseFloat(invoice?.unloading) || 0;
      const tollsCost = parseFloat(invoice?.totalTollsCost) || 0;

      const priceWithUnloading = price + unloading;
      const gst = (priceWithUnloading * gstVal) / 100;
      const totalPriceWithGST = priceWithUnloading + gst;

      const updatedInvoice = {
        ...invoice,
        totalPrice: price,
        gst: parseFloat(gst.toFixed(2)),
        totalPriceWithGST: parseFloat(totalPriceWithGST.toFixed(2)),
        totalTollsCost: tollsCost,
      };

      console.log({
        totalPrice: price,
        totalPriceWithGST: parseFloat(totalPriceWithGST.toFixed(2)),
        gst: parseFloat(gst.toFixed(2)),
        totalTollsCost: tollsCost,
      });

      // console.log(updatedInvoice);
      // Uncomment the next lines to update the state or send the updated invoice
      setInvoice(updatedInvoice);
      updateInvoice(updatedInvoice);

      setLoad(false);
      close();
    } catch (error) {
      console.error("Error updating invoice:", error);
      setLoad(false);
      // Optionally, handle the error (e.g., show a message to the user)
    }
  };

  if (role === null || loading) {
    // Added loading state
    return <p>Loading...</p>;
  }

  return (
    <div>
      {invoice ? (
        <>
          <Modal opened={opened} onClose={close} title="Modify Pricing">
            <NumberInput
              min={0}
              decimalScale={2}
              label="Tolls"
              mb={6}
              value={invoice.totalTollsCost}
              onChange={(e) => setInvoice({ ...invoice, totalTollsCost: e })}
            />
            <NumberInput
              min={10}
              decimalScale={2}
              label="Price"
              mb={6}
              value={invoice.totalPrice}
              onChange={(e) => setInvoice({ ...invoice, totalPrice: e })}
            />
            <NumberInput
              min={1}
              decimalScale={2}
              label="Waiting/unloading"
              mb={6}
              value={invoice?.unloading}
              onChange={(e) => setInvoice({ ...invoice, unloading: e })}
            />
            <Input
              placeholder="Waiting/unloading time Description"
              value={invoice?.unloadingDescription || ""}
              onChange={(e) =>
                setInvoice({ ...invoice, unloadingDescription: e.target.value })
              }
            />
            <br />
            <Button onClick={handleSubmit} bg={load ? "pink" : "green"}>
              {load ? "Calculating Please Wait" : "Calculate & Update"}
            </Button>
          </Modal>

          <InvoicesDetials invoice={invoice} admin={true} />

          <Button size="lg" color="cyan" ml={"45%"} onClick={open}>
            Modify Pricing
          </Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
