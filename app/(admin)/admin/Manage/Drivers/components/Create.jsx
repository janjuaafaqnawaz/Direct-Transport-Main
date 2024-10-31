"use client";

import React, { useEffect, useState } from "react";
import { signUpWithEmail } from "@/api/firebase/functions/auth";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

async function uploadImageToFirestore(image) {
  const storage = getStorage();

  const imageName = `images/${Date.now()}_${image.name}`;
  const storageRef = ref(storage, imageName);

  await uploadBytes(storageRef, image);

  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
}

export default function Create({ edit, driver }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    phone: "",
    companyAddress: "",
    password: "",
    email: "",
    vehicleDetails: "",
    abn: "",
    paymentPercentage: "",
    startDate: "",
    dateOfBirth: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [vehiclePicture, setVehiclePicture] = useState(null);
  const [driverLicense, setDriverLicense] = useState(null);

  useEffect(() => {
    if (driver) {
      setForm(driver);
    }
  }, [driver]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleFileChange = (event, setter) => {
    const file = event.target.files[0];
    setter(file);
  };

  const handleCreateOrUpdate = async () => {
    const { password, email } = form;

    setIsLoading(true);
    try {
      // Only upload the files if they are selected
      const vehiclePictureURL = vehiclePicture
        ? await uploadImageToFirestore(vehiclePicture)
        : driver?.vehiclePicture || "";

      const driverLicenseURL = driverLicense
        ? await uploadImageToFirestore(driverLicense)
        : driver?.driverLicense || "";

      const userData = {
        ...form,
        role: "driver",
        vehiclePicture: vehiclePictureURL,
        driverLicense: driverLicenseURL,
      };

      if (edit) {
        await updateDoc("users", email, userData);
        toast.success("User updated successfully.");
      } else {
        const res = await signUpWithEmail(email, password, {
          ...userData,
          CustomPrice,
        });
        if (res) {
          toast.success("User created successfully.");
        } else {
          toast.error("Failed to create user. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating/updating user:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />{" "}
          {edit ? "Edit Driver" : "Add Driver"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full">
        <DialogHeader>
          <DialogTitle>
            {edit ? "Edit Driver" : "Create New Driver"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
          {/* Form fields */}
          <div className="flex flex-col">
            <Label htmlFor="firstName">Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col sm:col-span-2">
            <Label htmlFor="companyAddress">Address</Label>
            <Textarea
              id="companyAddress"
              name="companyAddress"
              value={form.companyAddress}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              disabled={edit}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={edit}
            />
          </div>
          <div className="flex flex-col sm:col-span-2">
            <Label htmlFor="vehicleDetails">Vehicle Details</Label>
            <Textarea
              id="vehicleDetails"
              name="vehicleDetails"
              value={form.vehicleDetails}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="vehiclePicture">Vehicle Picture</Label>
            <Input
              id="vehiclePicture"
              name="vehiclePicture"
              type="file"
              onChange={(e) => handleFileChange(e, setVehiclePicture)}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="driverLicense">Driver License</Label>
            <Input
              id="driverLicense"
              name="driverLicense"
              type="file"
              onChange={(e) => handleFileChange(e, setDriverLicense)}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="abn">ABN Number</Label>
            <Input
              id="abn"
              name="abn"
              value={form.abn}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="paymentPercentage">Payment Percentage</Label>
            <Input
              id="paymentPercentage"
              name="paymentPercentage"
              type="number"
              value={form.paymentPercentage}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateOrUpdate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {edit ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const CustomPrice = {
  minServices: {
    "2T": "90",
    "1T": "30",
    HT: "20",
    Courier: "10",
  },
  gst: {
    GST: 10,
  },
  services: {
    Courier: "0.90",
    "1T": "1.80",
    HT: "1.20",
    "2T": "90",
  },
  minWaitTime: {
    minWaitTimeRate: 0.75,
  },
  truckServices: {
    "8T": "140",
    "4T": "120",
    "12T": "160",
    "1T": "2",
    "10T": "150",
    "2T": "90",
    "6T": "130",
  },
};
