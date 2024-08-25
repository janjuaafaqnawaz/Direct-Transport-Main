"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DropzoneButton from "@/components/Dropzone/index";
import {
  updateDoc,
  uploadImageToFirestore,
} from "@/api/firebase/functions/upload";
import { Box, LoadingOverlay } from "@mantine/core";
import { PhotoView } from "react-photo-view";
import { Button, Image, Input } from "@nextui-org/react";

export default function Page({ booking, close }) {
  const [name, setName] = useState(booking?.receiverName || "");
  const [images, setImages] = useState(booking?.images || []);
  const [refreash, setRefreash] = useState(1);
  const router = useRouter();
  const [loadingOverlay, setLoadingOverlay] = useState(false);

  const handleSave = async () => {
    // if (!images.length) {
    //   console.log("No images to save.");
    //   return;
    // }

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

      await updateDoc("place_bookings", booking.docId, {
        ...booking,
        images: uploadedImageUrls,
        receiverName: name,
      });

      setLoadingOverlay(false);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      close();
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
        {booking ? (
          <>
            <h1 style={{ marginBottom: "1rem", color: "#333" }}>Add PODs</h1>

            <Input
              type="name"
              label="Receiver Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-4"
            />
            <DropzoneButton
              key={refreash}
              handleImage={(blob) => {
                setImages([...images, blob]);
                setRefreash(refreash + 1);
              }}
            />

            <div className="flex flex-wrap gap-4">
              {images &&
                images.length > 0 &&
                images.map((item, index) => (
                  <PhotoView key={index} src={item}>
                    <div className="w-full flex flex-col justify-center align-middle">
                      <Image
                        src={item}
                        alt=""
                        className="w-full h-auto my-4 rounded-lg "
                      />
                      <Button
                        onClick={() => removeImage(index)}
                        size="sm"
                        color="danger"
                      >
                        Remove
                      </Button>
                    </div>
                  </PhotoView>
                ))}
            </div>
            <Button
              color="primary"
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
