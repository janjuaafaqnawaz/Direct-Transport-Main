"use client";

import React, { useEffect, useState } from "react";
import { Button, Container } from "@mantine/core";
import Link from "next/link";
import { PlacesAutocomplete, BookCheckout } from "@/components/Index";
import DateTimePickers from "@/components/fields/DateTimePickers";
import ItemDimensions from "@/components/ItemDimensions";
import ServicesFields from "@/components/fields/ServicesFields";
import FrequentAddress from "@/components/fields/FrequentAddress";
import CustomInput from "@/components/fields/CustomInput";
import { initialFormData } from "./static";

export default function ReviewBooking({
  form,
  edit,
  action,
  diseble,
  payment,
  noEmail,
  fetchTolls,
  selectedEmail,
}) {
  const [user, setUser] = useState([]);

  // -------------------------------State

  const [formData, setFormData] = useState(form || initialFormData);
  console.log(formData);
  const [showFrequentOrigins, setShowFrequentOrigins] = useState(true);
  const [showFrequentDestinations, setShowFrequentDestinations] =
    useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
    setRefreshKey((prevKey) => prevKey + 1);
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
      alert(`Please fill in the following fields: ${emptyFields.join(", ")}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      {showCheckout ? (
        <BookCheckout
          formData={formData}
          cat={"place_bookings"}
          job={true}
          payment={payment}
          fetchTolls={fetchTolls}
          selectedEmail={selectedEmail}
        />
      ) : (
        <Container
          size={"md"}
          style={{
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              height: "maxContent",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }} s>
              <h3>Job Information</h3>
              <p>
                Account:{" "}
                {selectedEmail?.name !== ""
                  ? selectedEmail.name
                  : user?.firstName}
              </p>

              <CustomInput
                name="contact"
                label="Contact"
                value={formData.contact}
                handleChange={handleChange}
              />
              {noEmail ? (
                <CustomInput
                  name="email"
                  label="Email"
                  value={formData.email}
                  handleChange={handleChange}
                />
              ) : null}

              <div
                style={{
                  padding: "20px",
                  backgroundColor: "steelblue",
                  color: "wheat",
                  width: 250,
                  borderRadius: 10,
                }}
              >
                <p>
                  <strong>Please Note:</strong> Interstate/regional prices may
                  vary from the original quote. Please wait for the job to be
                  accepted and we will contact you if any changes are necessary.
                </p>
                <p>
                  <strong>
                    Accurate measurements are necessary for accurate pricing.
                  </strong>
                </p>
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: 250,
                  marginLeft: "auto",
                }}
                s
              >
                <DateTimePickers
                  handleDateTimeChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.date,
                      time: e.time,
                    })
                  }
                  service={formData?.service || "Direct"}
                />
                <h3>Service Information</h3>

                <ServicesFields
                  handleChange={(service) =>
                    setFormData({ ...formData, service: service })
                  }
                  value={formData.service}
                />
              </div>
              <br />
              <ItemDimensions
                handleItems={(items) =>
                  setFormData({ ...formData, items: items })
                }
                defaultItems={formData?.items}
                diseble={diseble}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              height: "maxContent",
              overflow: "hidden",
            }}
            key={refreshKey}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h3>Pickup Details</h3>

              <FrequentAddress
                address={formData.address}
                handleChange={(address) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      Origin: address,
                    },
                  })
                }
                show={() => setShowFrequentOrigins(false)}
                visible={edit}
              />

              {edit && showFrequentOrigins ? (
                <PlacesAutocomplete
                  onLocationSelect={(loc) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, Origin: loc },
                    })
                  }
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
                        Origin: {
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
            </div>

            <div
              key={refreshKey}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <h3>Drop Details</h3>

              <FrequentAddress
                address={formData.address}
                handleChange={(address) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      Destination: address,
                    },
                  })
                }
                show={() => setShowFrequentDestinations(false)}
                visible={edit}
              />

              {edit && showFrequentDestinations ? (
                <PlacesAutocomplete
                  onLocationSelect={(loc) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, Destination: loc },
                    })
                  }
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
            </div>
          </div>

          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Button
              variant="filled"
              mt={10}
              color="#1384e1"
              size="md"
              w={230}
              onClick={handleCheckOut}
            >
              Book Job
            </Button>

            <Link href="/ClientServices" style={{ textDecoration: "none" }}>
              <Button
                w={230}
                variant="filled"
                mt={10}
                color="#1384e1"
                size="md"
              >
                Client Services
              </Button>
            </Link>
            {action ? null : (
              <Button
                color="lime"
                w={230}
                mt={10}
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
          </div>
        </Container>
      )}
    </>
  );
}
