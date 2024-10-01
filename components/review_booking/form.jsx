"use client";

import "./form.css";

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
  const notify = (msg) => toast("")(msg);
  // -------------------------------State

  const [user, setUser] = useState([]);
  const [error, setError] = useState(true);
  const [formData, setFormData] = useState(form || initialFormData);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFrequentOrigins, setShowFrequentOrigins] = useState(true);
  const [showFrequentDestinations, setShowFrequentDestinations] =
    useState(true);
  const [locationsError, setLocationsError] = useState(true);

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
    if (name && value) {
      setFormData({ ...formData, [name]: value });
    } else {
    }
  };
  const handle_address = async (name, e, overwrite, type) => {
    setLocationsError(true); // Initially, set error to true

    try {
      // Show a toast message if the type is same day
      if (type === "same_day") {
        toast.error("Same day delivery cannot be processed at this time.");
        return;
      }

      // Update form data without unnecessary toast
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: overwrite ? e : { ...prevFormData.address[name], ...e },
        },
      }));

      // Get the updated addresses
      const updatedAddresses = {
        ...formData.address,
        [name]: overwrite ? e : { ...formData.address[name], ...e },
      };

      // Check geofence only if both addresses are provided
      if (
        updatedAddresses.Origin?.coordinates &&
        updatedAddresses.Destination?.coordinates
      ) {
        // Remove redundant loading message and use a success/error toast after geofence check
        const { isOriginInside, isDestinationInside } = await isPointInGeofence(
          updatedAddresses
        );

        // Check if at least one of the locations is inside the geofence
        if (isOriginInside || isDestinationInside) {
          // At least one is inside, clear the error and show success toast
          setLocationsError(false);
          toast.success("Address saved and is within the allowed area.");
        } else {
          // Both are outside the geofence, show an error
          setLocationsError(true);
          toast.error(
            "Both addresses are outside the allowed area. Please select valid locations."
          );

          // Revert to the previous state
          setFormData((prevFormData) => ({
            ...prevFormData,
            address: {
              ...prevFormData.address,
              [name]: formData.address[name], // Revert to the previous state
            },
          }));
        }
      }
    } catch (error) {
      console.error(error);

      // Show a single toast message in case of an error and revert state
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: {
          ...prevFormData.address,
          [name]: formData.address[name], // Revert to the previous state
        },
      }));
      toast.error("An error occurred while saving the address.");
    }
  };

  const handleDateChange = (name, val) =>
    setFormData({ ...formData, [name]: val });

  if (showCheckout) {
    return (
      <BookCheckout
        formData={{ ...formData, type }}
        cat={"place_bookings"}
        job={true}
        payment={payment}
        fetchTolls={fetchTolls}
        selectedEmail={selectedEmail}
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
              <strong>Please Note:</strong> Interstate/regional prices may vary
              from the original quote. Please wait for the job to be accepted
              and we will contact you if any changes are necessary.
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
          <h5 className="my-8">Servicermation</h5>
          <ServicesFields
            handleChange={(service) =>
              setFormData({ ...formData, service: service })
            }
            value={formData.service}
          />
          <ItemDimensions
            handleItems={(items) => setFormData({ ...formData, items: items })}
            defaultItems={formData?.items}
            diseble={diseble}
          />
        </div>
        <div className="box">
          <h3>Pickup Details</h3>
          {/* <FrequentAddress
            address={formData.address.Origin}
            handleChange={(e) => handle_address("Origin", e)}
            //   handleChange={(address) =>
            //   setFormData({
            //     ...formData,
            //     address: {
            //       ...formData.address,
            //       Origin: address,
            //     },
            //   })
            // }
            show={() => setShowFrequentOrigins(false)}
            visible={edit}
          /> */}
          <CustomInput
            name="pickupCompanyName"
            label="Company Name"
            value={formData.pickupCompanyName}
            handleChange={handleChange}
          />
          {edit && showFrequentOrigins ? (
            <PlacesAutocomplete
              onLocationSelect={(e) => handle_address("Destination", e, true)}
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
          {/* <FrequentAddress
            address={formData.address.Destination}
            handleChange={(e) => handle_address("Destination", e)}
            show={() => setShowFrequentDestinations(false)}
            visible={edit}
          />{" "} */}
          <CustomInput
            name="dropCompanyName"
            label="Company Name"
            value={formData.dropCompanyName}
            handleChange={handleChange}
          />
          {edit && showFrequentDestinations ? (
            <PlacesAutocomplete
              onLocationSelect={(e) => handle_address("Destination", e, true)}
              // onLocationSelect={(loc) =>
              //   setFormData({
              //     ...formData,
              //     address: { ...formData.address, Destination: loc },
              //   })
              // }
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
          )}{" "}
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
