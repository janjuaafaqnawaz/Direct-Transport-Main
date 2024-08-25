"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import DropzoneButton from "@/components/Dropzone/index";
import {
  updateDoc,
  uploadImageToFirestore,
} from "@/api/firebase/functions/upload";
import { Box, Button, Image, LoadingOverlay } from "@mantine/core";

export default function Page() {
  const pathname = usePathname();
  const [invoice, setInvoice] = useState(null);
  const [images, setImages] = useState([]);
  const [refreash, setRefreash] = useState(1);
  const router = useRouter();
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      const match = pathname && pathname.match(/\/([^/]+)\/pod$/);
      const id = match && match[1];

      if (id) {
        const data = await fetchDocById(id, "place_bookings");
        setInvoice(data);
        setImages(data?.images || []);
      }
    };

    fetchInvoice();
  }, [pathname]);

  const handleSave = async () => {
    if (!images.length) {
      console.log("No images to save.");
      return;
    }

    try {
      setLoadingOverlay(true);
      // Clear the images state
      setImages([]);

      const uploadedImageUrls = await Promise.all(
        images.map(async (image, index) => {
          const url = await uploadImageToFirestore(image);
          setImages([...images, url]);
          return url;
        })
      );

      console.log("All images uploaded successfully:", uploadedImageUrls);

      await updateDoc("place_bookings", invoice.docId, {
        ...invoice,
        images: uploadedImageUrls,
      });

      router.push(`/admin/Invoices/${invoice.docId}`);

      // Do any further processing here, such as updating status or navigating
      setLoadingOverlay(false);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  // Function to remove a specific image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={loadingOverlay}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
          backgroundColor: "#f7f7f7",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {invoice ? (
          <>
            <h1 style={{ marginBottom: "1rem", color: "#333" }}>Add PODs</h1>

            <DropzoneButton
              key={refreash}
              handleImage={(blob) => {
                setImages([...images, blob]);
                setRefreash(refreash + 1);
              }}
            />

            <h2>{invoice?.receiverName}</h2>

            {images.map((image, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <Image
                  src={image}
                  alt={`Image ${index}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginRight: "0.5rem",
                  }}
                />
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  ml={6}
                  onClick={() => removeImage(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              variant="filled"
              color="green"
              onClick={handleSave}
              style={{ marginTop: "1rem" }}
            >
              Save & Deliver
            </Button>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Box>
  );
}
