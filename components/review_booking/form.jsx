"use client";

import "./form.css";
import { Alert } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Button, ButtonGroup, Divider } from "@mantine/core";
import Link from "next/link";
import { PlacesAutocomplete, BookCheckout } from "@/components/Index";
import ItemDimensions from "@/components/ItemDimensions";
import ServicesFields from "@/components/fields/ServicesFields";
import FrequentAddress from "@/components/fields/FrequentAddress";
import CustomInput from "@/components/fields/CustomInput";
import { initialFormData } from ".././static";
import DateTime from "@/components/fields/DateTime";
import { formatDate, formatTime } from "@/api/DateAndTime/format";
import isPointInGeofence from "@/api/price_calculation/function/helper/isPointInGeofence";
import toast from "react-hot-toast";
import { ErrorOutline } from "@mui/icons-material";

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
    if (
      !formData.address.Origin.coordinates ||
      !formData.address.Destination.coordinates
    )
      return toast.error("Please enter address details");

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
      <div className="container">
        <div className="box">
          <h3>Job information</h3>
          <p>
            Account:
            {selectedEmail?.name !== "" ? selectedEmail.name : user?.firstName}
          </p>
          <br />
          <CustomInput
            name="contact"
            label="Contact"
            value={formData.contact}
            handleChange={handleChange}
          />
          <CustomInput
            name="internalReference"
            label="Internal Reference"
            value={formData.internalReference}
            handleChange={handleChange}
          />
          <br />
          {noEmail ? (
            <CustomInput
              name="email"
              label="Email"
              value={formData.email}
              handleChange={handleChange}
            />
          ) : null}
          <br />
          <div
            style={{
              padding: "20px",
              backgroundColor: "steelblue",
              color: "wheat",
              width: "100%",
              borderRadius: 10,
            }}
          >
            <p>
              <strong>Please Note:</strong>
              {type === "same_day" ? (
                "Interstate/regional prices may vary from the original quote. Please wait for the job to be accepted and we will contact you if any changes are necessary."
              ) : (
                <>
                  <br />
                  1. Has to be booked before 12 noon <br />
                  2. Deliveries will be carried out during normal business hours
                  (7am - 5pm) <br />
                  3. Goods must be ready for pickup at the time of the booking
                  <br />
                  4. Accurate dimensions and weights will be required for
                  accurate pricing
                </>
              )}
            </p>

            <p>
              <strong>
                Accurate measurements are necessary for accurate pricing.
              </strong>
            </p>
          </div>
          <Divider style={{ margin: "5.5rem 0" }} />
        </div>
        <div className="box">
          <h3>Ready Date & Time</h3>
          <DateTime
            service={formData.service}
            handle_date={(name, val) => handleDateChange(name, formatDate(val))}
            handle_time={(name, val) => handleDateChange(name, formatTime(val))}
            handleInvalid={(e) => setError(e)}
          />
          <h5 className="my-8">Service information</h5>
          {type === "same_day" ? (
            <ServicesFields
              handleChange={(service) =>
                setFormData({ ...formData, service: service })
              }
              value={formData.service}
            />
          ) : null}
          <ItemDimensions
            handleItems={(items) => setFormData({ ...formData, items: items })}
            defaultItems={formData?.items}
            diseble={diseble}
          />
        </div>
        <div className="box">
          <h3>Pickup Details</h3>
          {locationsError && (
            <Alert icon={<ErrorOutline />} className="w-full">
              Please enter valid location
            </Alert>
          )}
          <FrequentAddress
            address={formData.address.Origin}
            handleChange={(e) => handle_address("Origin", e)}
            show={() => setShowFrequentOrigins(false)}
            visible={edit}
          />
          <CustomInput
            name="pickupCompanyName"
            label="Company Name"
            value={formData.pickupCompanyName}
            handleChange={handleChange}
          />
          {edit && showFrequentOrigins ? (
            <PlacesAutocomplete
              onLocationSelect={(e) => handle_address("Origin", e, true)}
              address={formData.address.Origin}
              pickup={true}
            />
          ) : (
            <CustomInput
              value={formData.address.Origin.label}
              handleChange={(e) =>
                setFormData({
                  ...formData,
                  address: {
                    ...formData.address,
                    Destination: {
                      ...formData.address.Origin,
                      label: e.target.value,
                    },
                  },
                })
              }
            />
          )}

          <CustomInput
            name="pickupReference1"
            label="Reference"
            value={formData.pickupReference1}
            handleChange={handleChange}
          />
          <CustomInput
            name="pickupPhone"
            label="Phone number"
            value={formData.pickupPhone}
            handleChange={handleChange}
            type="number"
          />
        </div>
        <div className="box">
          <h3>Drop Details</h3>
          {locationsError && (
            <Alert icon={<ErrorOutline />} className="w-full">
              Please enter valid location
            </Alert>
          )}
          <FrequentAddress
            address={formData.address.Destination}
            handleChange={(e) => handle_address("Destination", e)}
            show={() => setShowFrequentDestinations(false)}
            visible={edit}
          />
          <CustomInput
            name="dropCompanyName"
            label="Company Name"
            value={formData.dropCompanyName}
            handleChange={handleChange}
          />
          {edit && showFrequentDestinations ? (
            <PlacesAutocomplete
              onLocationSelect={(e) => handle_address("Destination", e, true)}
              address={formData.address.Destination}
            />
          ) : (
            <CustomInput
              value={formData.address.Destination.label}
              handleChange={(e) =>
                setFormData({
                  ...formData,
                  address: {
                    ...formData.address,
                    Destination: {
                      ...formData.address.Destination,
                      label: e.target.value,
                    },
                  },
                })
              }
            />
          )}
          <CustomInput
            name="deliveryIns"
            label="Delivery Instructions"
            value={formData.deliveryIns}
            handleChange={handleChange}
          />
          <CustomInput
            name="deliveryPhone"
            label="Phone number"
            value={formData.deliveryPhone}
            handleChange={handleChange}
            type="number"
          />
        </div>
      </div>
      <div
        className="sm:-mt-44"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <ButtonGroup orientation="vertical">
          <Button
            variant="filled"
            mt={3}
            color="#1384e1"
            size="md"
            w={230}
            onClick={handleCheckOut}
          >
            Book Job
          </Button>

          <Button w={230} variant="filled" mt={3} color="#1384e1" size="md">
            <Link href="/ClientServices" style={{ textDecoration: "none" }}>
              Client Services
            </Link>
          </Button>
          {action ? null : (
            <Button
              color="lime"
              w={230}
              mt={3}
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
              mt={10}
              color="#1384e1"
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
