"use client";

import { useState } from "react";
import { Button, ButtonGroup, Center, Container } from "@mantine/core";
import { initialFormData } from "@/components/static";
import { PlacesAutocomplete } from "@/components/Index";
import ItemDimensions from "@/components/ItemDimensions";
import CheckoutSummary from "@/components/CheckoutSummary";
import Form from "@/components/review_booking/form";
import ServicesFields from "@/components/fields/ServicesFields";

export default function Page({ params }) {
  const [formData, setFormData] = useState(initialFormData);
  const [show, setShow] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

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
        type={params.type}
        form={formData}
        cat={"place_job"}
        edit={false}
        action={(e) => {
          setShow(e);
        }}
        back={true}
        diseble={true}
        payment={true}
        noEmail={true}
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
          formData={{ ...formData, type: params.type }}
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

          <PlacesAutocomplete
            onLocationSelect={(loc) =>
              setFormData({
                ...formData,
                address: { ...formData.address, Destination: loc },
              })
            }
            address={formData.address.Destination}
          />
        </div>

        <br />
        {params?.type === "same_day" ? (
          <ServicesFields
            handleChange={(service) =>
              setFormData({ ...formData, service: service })
            }
            value={formData.service}
          />
        ) : null}
        <br />

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
