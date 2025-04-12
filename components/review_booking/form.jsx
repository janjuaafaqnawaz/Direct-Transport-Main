"use client";

import "./form.css";
import Link from "next/link";
import toast from "react-hot-toast";
import AddressesSection from "./AddressesSection";
import BasicDetailsSection from "./BasicDetailsSection";
import isPointInGeofence from "@/api/price_calculation/function/helper/isPointInGeofence";

import { useEffect, useState } from "react";
import { initialFormData } from "../static";
import { BookCheckout } from "@/components/Index";
import { Button, ButtonGroup } from "@mantine/core";

function Form({
  type,
  form,
  edit,
  action,
  diseble,
  payment,
  noEmail,
  fetchTolls,
  selectedEmail,
  resetSelectedEmail,
}) {
  // -------------------------------State

  const [user, setUser] = useState([]);
  const [error, setError] = useState(true);
  const [formData, setFormData] = useState(form || initialFormData);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFrequentOrigins, setShowFrequentOrigins] = useState(true);
  const [showFrequentDestinations, setShowFrequentDestinations] =
    useState(true);
  const [locationsError, setLocationsError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const user = JSON.parse(localStorage.getItem("userDoc")) || {} || null;
        setUser(user);
        setFormData(form || initialFormData);
        resetSelectedEmail();
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  const handleRefresh = () => {
    setFormData({
      ...formData,
      address: {
        Origin: {},
        Destination: {},
      },
    });
    setShowFrequentOrigins(true), setShowFrequentDestinations(true);
  };

  // -----------------------------State Handlers
  const handleCheckOut = () => {
    if (locationsError) return toast.error("Please enter valid location ");
    if (error) return toast.error("Please enter valid date & time");

    const isSingleAddressValid = Boolean(
      formData.address?.Origin?.coordinates &&
        formData.address?.Destination?.coordinates
    );

    const isMultipleAddressValid = Boolean(
      formData.address?.useMultipleAddresses &&
        formData.address?.MultipleOrigin[0]?.coordinates &&
        formData.address?.MultipleDestination[0]?.coordinates
    );

    // console.log("isSingleAddressValid:", isSingleAddressValid);
    // console.log("isMultipleAddressValid:", isMultipleAddressValid);

    if (!isSingleAddressValid && !isMultipleAddressValid) {
      return toast.error("Please enter address details");
    }

    const requiredFields = [
      "Contact",
      "Service",
      "Date",
      "Time",
      "Items",
      "Address",
    ];
    const emptyFields = requiredFields.filter(
      (field) =>
        !formData[field.toLowerCase()] ||
        (Array.isArray(formData[field.toLowerCase()]) &&
          formData[field.toLowerCase()].length === 0)
    );

    if (emptyFields.length === 0) {
      setShowCheckout(true);
    } else {
      toast.success(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name && value !== undefined) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handle_address = async (name, e, overwrite) => {
    const updatedAddress = overwrite ? e : { ...formData.address[name], ...e };
    if (type === "same_day") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: updatedAddress,
        },
      }));
      toast.success("Address selected ");
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: updatedAddress,
        },
      }));

      const updatedAddresses = {
        ...formData.address,
        [name]: updatedAddress,
      };

      if (
        updatedAddresses.Origin?.coordinates &&
        updatedAddresses.Destination?.coordinates
      ) {
        try {
          const { isOriginInside, isDestinationInside } =
            await isPointInGeofence(updatedAddresses);

          if (!isOriginInside || !isDestinationInside) {
            setLocationsError(false);
            toast.success("Address saved and is within the allowed area.");
          } else {
            setLocationsError(true);
            toast.error(
              "Both addresses are inside the non allowed area. Please select valid locations."
            );
            revertAddress(name);
          }
        } catch (error) {
          console.error(error);
          revertAddress(name);
          toast.error("An error occurred while saving the address.");
        }
      } else {
        setLocationsError(false);
      }
    }
  };

  const revertAddress = (name) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      address: {
        ...prevFormData.address,
        [name]: {},
      },
    }));
  };

  const handleDateChange = (name, val) =>
    setFormData({ ...formData, [name]: val });

  const handleBack = () => setShowCheckout(false);

  if (showCheckout) {
    return (
      <BookCheckout
        formData={{ ...formData, type, selectedEmail }}
        cat={"place_bookings"}
        job={true}
        payment={payment}
        fetchTolls={fetchTolls}
        selectedEmail={selectedEmail}
        goBack={handleBack}
      />
    );
  }

  return (
    <>
      <div className="container mx-auto mt-8">
        <BasicDetailsSection
          user={user}
          type={type}
          diseble={diseble}
          noEmail={noEmail}
          selectedEmail={selectedEmail}
          formData={formData}
          setFormData={setFormData}
          setError={setError}
          handleChange={handleChange}
          handleDateChange={handleDateChange}
          resetSelectedEmail={resetSelectedEmail}
        />

        <AddressesSection
          user={user}
          edit={edit}
          locationsError={locationsError}
          handleRefresh={handleRefresh}
          formData={formData}
          setFormData={setFormData}
          handleChange={handleChange}
          handle_address={handle_address}
          showFrequentOrigins={showFrequentOrigins}
          setShowFrequentOrigins={setShowFrequentOrigins}
          showFrequentDestinations={showFrequentDestinations}
          setShowFrequentDestinations={setShowFrequentDestinations}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          marginTop: 60,
        }}
      >
        <ButtonGroup orientation="vertical" className="gap-[2px]">
          <Button
            variant="filled"
            color="#1582e1"
            size="md"
            onClick={handleCheckOut}
          >
            Book Job
          </Button>

          <Button w={230} variant="filled" color="#1582e1" size="md">
            <Link href="/ClientServices" style={{ textDecoration: "none" }}>
              Client Services
            </Link>
          </Button>
          {action ? null : (
            <Button
              color="#29bf12"
              w={230}
              variant="filled"
              size="md"
              onClick={handleRefresh}
            >
              Clear Address
            </Button>
          )}
          {action ? (
            <Button
              w={230}
              variant="filled"
              color="#1582e1"
              size="md"
              onClick={() => action("summary")}
            >
              Back
            </Button>
          ) : null}
        </ButtonGroup>
      </div>
    </>
  );
}

export default Form;
