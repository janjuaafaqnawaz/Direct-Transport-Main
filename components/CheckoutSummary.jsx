"use client";

import { ActionIcon, Container, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { AccountCircle, LocationOn, AttachMoney } from "@mui/icons-material";
import Loading from "./Loading";
import DimensionsTable from "@/components/ItemDimensions/DimensionsTable";
import ProcessPrice from "@/api/price_calculation";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";
import { postCustomIdDoc } from "@/api/firebase/functions/upload";
import toast from "react-hot-toast";

const renderDetails = (title, details) => (
  <div>
    <Text tt="uppercase" size="lg" fw={900} c={"rgba(59, 58, 58, 1)"}>
      {title || "Something went wrong"}
    </Text>
    {details &&
      details
        .filter((detail) => detail) // Filter out null or undefined elements
        .map((detail, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Render icon if available */}
            <h5
              tt="uppercase"
              fw={700}
              style={{
                color: "grey",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActionIcon
                variant="light"
                mr={20}
                p={20}
                radius={"lg"}
                c={"#1384e1"}
              >
                {detail?.icon ? detail?.icon : null}
              </ActionIcon>{" "}
              {(detail && detail.label) || "Empty"}:
            </h5>
            <h6 tt="uppercase" fw={300} style={{ width: "15rem" }}>
              {(detail && detail.value) || "empty"}
            </h6>
          </div>
        ))}
  </div>
);

const CheckoutSummary = ({ formData, action, updatedForm }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(formData);

  useEffect(() => {
    const processBooking = async () => {
      try {
        const finaleData = await ProcessPrice(invoice);
        setInvoice(finaleData);

        setLoading(false);
      } catch (error) {
        console.log(error);
        router.push("/ClientServices");
      }
    };
    processBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  if (loading === true) {
    return <Loading />;
  }

  return (
    <Container
      size={"sm"}
      style={{
        borderRadius: "1rem",
        padding: "3rem",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Example shadow style
      }}
    >
      {invoice?.requestQuote === true
        ? renderDetails("Booking Summary", [
            {
              icon: <AccountCircle />,
              label: "Service",
              value: invoice?.service,
            },
            {
              icon: <LocationOn />,
              label: "Pickup Address",
              value: invoice?.address?.Origin.label,
            },
            {
              icon: <LocationOn />,
              label: "Drop Address",
              value: invoice?.address?.Destination.label,
            },
            {
              icon: <AttachMoney />,
              label: "Request Quote",
              value: <Button>Go</Button>,
            },
          ])
        : renderDetails("Booking Summary", [
            {
              icon: <AccountCircle />,
              label: "Service",
              value: invoice?.service,
            },
            {
              icon: <LocationOn />,
              label: "Pickup Address",
              value: invoice?.address?.Origin.label,
            },
            {
              icon: <LocationOn />,
              label: "Drop Address",
              value: invoice?.address?.Destination.label,
            },
            invoice && invoice.totalTolls > 0
              ? {
                  icon: <AttachMoney />,
                  label: "Tolls",
                  value: "$" + invoice.totalTollsCost,
                }
              : null,
            invoice?.serviceCharges !== 0
              ? {
                  icon: <AttachMoney />,
                  label: "Service Charges",
                  value: "$" + invoice?.serviceCharges,
                }
              : null,
            {
              icon: <AttachMoney />,
              label: "Price",
              value: "$" + invoice?.totalPrice,
            },
            {
              icon: <AttachMoney />,
              label: "GST",
              value: "$" + invoice?.gst,
            },
            {
              icon: <AttachMoney />,
              label: "Price including GST",
              value:
                "$" +
                (
                  Number(invoice?.totalPriceWithGST) +
                  Number(invoice.totalTollsCost)
                ).toFixed(2),
            },
          ])}
      <DimensionsTable
        items={invoice?.items}
        diseble={true}
        handleDelete={null}
      />
      <br />
      <br />
      <br />
      <Button
        fullWidth
        className="mb-1"
        color="primary"
        onClick={() => {
          action("checkout"), updatedForm(invoice);
        }}
      >
        Confirm Booking
      </Button>

      <Button
        fullWidth
        className="mb-1"
        color="secondary"
        onClick={async () => {
          const toastId = toast.loading("Saving Quote...");
          updatedForm(invoice);
          await postCustomIdDoc(invoice, "saved_quotes", generateSQId());
          toast.success("Quote Saved Successfully " + invoice?.docId, {
            id: toastId,
          });
          router.push("/MyQuotes");
        }}
      >
        Save Quote
      </Button>

      <Button fullWidth color="danger" onClick={() => action("")}>
        Back
      </Button>
    </Container>
  );
};

export default CheckoutSummary;

function generateSQId() {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // ensures it's always 6 digits
  return `SQ${randomNumber}`;
}
