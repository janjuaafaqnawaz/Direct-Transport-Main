"use client";

import { useState } from "react";
import { Button, ButtonGroup, Center, Container } from "@mantine/core";
import { initialFormData } from "@/components/static";
import { PlacesAutocomplete } from "@/components/Index";
import ItemDimensions from "@/components/ItemDimensions";
import CheckoutSummary from "@/components/CheckoutSummary";
import Form from "@/components/review_booking/form";
import ServicesFields from "@/components/fields/ServicesFields";
import FrequentAddress from "@/components/fields/FrequentAddress";

export default function Page() {
  const [formData, setFormData] = useState(initialFormData);
  const [show, setShow] = useState("");
  const [showFrequentOrigins, setShowFrequentOrigins] = useState(true);
  const [showFrequentDestinations, setShowFrequentDestinations] =
    useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  console.log({ formData });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const styleField = {
    width: "100%",
    margin: ".8rem 0",
    minWidth: "10rem",
  };

  if (show === "checkout") {
    return (
      <Form
        form={formData}
        cat={"place_job"}
        edit={false}
        action={(e) => {
          setShow(e);
        }}
        back={true}
        diseble={true}
        fetchTolls={true}
        selectedEmail={""}
      />
    );
  } else if (show === "summary") {
    const requiredFields = ["Service", "Items", "Address"];
    const emptyFields = requiredFields.filter(
      (field) =>
        !formData[field.toLowerCase()] ||
        (Array.isArray(formData[field.toLowerCase()]) &&
          formData[field.toLowerCase()].length === 0)
    );

    if (emptyFields.length === 0) {
      return (
        <CheckoutSummary
          formData={formData}
          updatedForm={(updatedForm) => {
            setFormData(updatedForm);
          }}
          action={(e) => {
            setShow(e);
          }}
        />
      );
    } else {
      console.log(
        `Please fill in the following fields: ${emptyFields.join(", ")}`
      );
    }
  }

  return (
    <>
      <Container size={"xs"}>
        <Center>
          <h3>Pickup Details</h3>{" "}
        </Center>
        <div style={styleField} key={refreshKey}>
          <FrequentAddress
            address={formData.address.Origin}
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
            visible={true}
          />
          {showFrequentOrigins === true ? (
            <PlacesAutocomplete
              onLocationSelect={(loc) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, Origin: loc },
                })
              }
              pickup={true}
              address={formData.address.Origin}
            />
          ) : null}
          <FrequentAddress
            address={formData.address.Destination}
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
            visible={true}
          />
          {showFrequentDestinations === true ? (
            <PlacesAutocomplete
              onLocationSelect={(loc) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, Destination: loc },
                })
              }
              address={formData.address.Destination}
            />
          ) : null}
        </div>
        <ServicesFields
          handleChange={(service) =>
            setFormData({ ...formData, service: service })
          }
          value={formData.service}
        />
        <ItemDimensions
          handleItems={(items) => setFormData({ ...formData, items: items })}
          defaultItems={formData?.items}
        />
        <Center>
          <ButtonGroup orientation="vertical">
            <Button
              w={180}
              color="#1384e1"
              mt={3}
              variant="filled"
              onClick={() => {
                setShow("summary");
              }}
            >
              Price A Job
            </Button>
            <Button w={180} color="#1384e1" mt={3} variant="filled">
              Client Service
            </Button>
            <Button
              w={180}
              color="lime"
              mt={3}
              variant="filled"
              onClick={handleRefresh}
            >
              Clear Address
            </Button>
          </ButtonGroup>
        </Center>
      </Container>
    </>
  );
}
