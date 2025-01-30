"use client";

import {
  Email,
  AccountCircle,
  Today,
  AccessTime,
  LocationOn,
  AttachMoney,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Text, Button, Container, ActionIcon } from "@mantine/core";
import getSuburbByLatLng from "@/api/getSuburbByLatLng";
import { postInvoice } from "@/api/firebase/functions/upload";
import { useRouter } from "next/navigation";
import Loading from "./Loading";
import "@mantine/dates/styles.css";
import sendBookingEmail from "@/api/sendBookingEmail";
import DimensionsTable from "./ItemDimensions/DimensionsTable";
import ProcessPrice from "@/api/price_calculation/index";
import StripeWrapper from "@/components/stripe/StripeWrapper";
import toast from "react-hot-toast";
import { Timestamp } from "firebase/firestore";

export default function BookCheckout({
  formData,
  action,
  back,
  payment,
  fetchTolls,
  selectedEmail,
  goBack,
}) {
  const nav = useRouter();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(formData);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const processBooking = async () => {
      try {
        const finaleData = await ProcessPrice(formData, fetchTolls);
        setInvoice(finaleData);
        setLoading(false);
      } catch (error) {
        console.error("Error while processing in checkout page:", error);
        toast.error("Unable to process your booking. Please try again.");
        nav.push("/");
      }
    };
    processBooking();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const convertToTimestamp = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return Timestamp.fromDate(new Date(`${year}-${month}-${day}T00:00:00Z`));
  };

  const handleSubmit = async () => {
    console.log("Creating");

    setCreating(true);
    try {
      const pickupSuburb = await getSuburbByLatLng(
        invoice.address?.Origin?.label
      );

      const deliverySuburb = await getSuburbByLatLng(
        invoice.address?.Destination?.label
      );

      const dateTimestamp = convertToTimestamp(invoice.date);

      const delivery = {
        ...invoice,
        pickupSuburb,
        deliverySuburb,
        dateTimestamp,
      };

      const id = await postInvoice(delivery, "place_bookings", selectedEmail);

      if (id) {
        console.log("Booking uploaded with id:", id);
        sendBookingEmail(invoice, id, invoice?.name || invoice?.contact);
        nav.push(`/RecentInvoices/${id}`);
      }
    } catch (error) {
      console.log("Error While Submitting.", error);
      toast.error("Something went wrong");
      toast.error("Sorry we won't be able to create booking this time!");
    } finally {
      setCreating(false);
    }
  };

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
      {renderDetails("Booking Information", [
        invoice?.email
          ? {
              icon: <AccountCircle />,
              label: invoice?.email ? "Email" : " ",
              value: invoice?.email || " ",
            }
          : null,
        {
          icon: <Email />,
          label: "Internal Reference",
          value: invoice?.internalReference,
        },
        { icon: <Email />, label: "Contact", value: invoice?.contact },
        { icon: <Today />, label: "Date", value: invoice?.date },
        { icon: <AccessTime />, label: "Time", value: invoice?.time },
      ])}
      {renderDetails("Pickup and Drop-off Information", [
        {
          icon: <LocationOn />,
          label: "Pickup Company Name",
          value: invoice?.pickupCompanyName,
        },
        {
          icon: <LocationOn />,
          label: "Pickup Address",
          value: invoice?.address?.Origin.label,
        },
        {
          icon: <LocationOn />,
          label: "Drop Company Name",
          value: invoice?.dropCompanyName,
        },
        {
          icon: <LocationOn />,
          label: "Drop Address",
          value: invoice?.address?.Destination.label,
        },
        {
          icon: <AccessTime />,
          label: "Reference",
          value: invoice?.pickupReference1,
        },

        {
          icon: <AccessTime />,
          label: "Delivery Instructions.",
          value: invoice?.deliveryIns,
        },
      ])}
      {invoice.requestQuote
        ? renderDetails("Prices", [
            {
              icon: <AttachMoney />,
              label: "Request Quote",
              value: <Button>Go</Button>,
            },
          ])
        : renderDetails("Prices", [
            invoice && invoice.totalTolls > 0
              ? {
                  icon: <AttachMoney />,
                  label: "Tolls",
                  value: "$" + invoice.totalTollsCost,
                }
              : null,
            {
              icon: <AttachMoney />,
              label: "GST",
              value: "$" + invoice?.gst,
            },
            {
              icon: <AttachMoney />,
              label: "Price",
              value: "$" + invoice?.totalPrice,
            },
            invoice?.serviceCharges !== 0
              ? {
                  icon: <AttachMoney />,
                  label: "Service Charges",
                  value: "$" + invoice?.serviceCharges,
                }
              : null,
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
        handleDelete={null}
        diseble={true}
        invoice={invoice}
      />
      <br />
      <br />
      <br />
      {!payment ? (
        <Button
          fullWidth
          variant="filled"
          color="green"
          onClick={handleSubmit}
          marginTop="lg"
          style={{ borderRadius: "8px" }}
          loading={creating}
        >
          Confirm Booking
        </Button>
      ) : (
        <StripeWrapper formData={formData} />
      )}
      {back ? (
        <Button
          fullWidth
          variant="filled"
          color="red"
          mt={2}
          marginTop="lg"
          style={{ borderRadius: "8px" }}
          onClick={() => action("summary")}
        >
          Back
        </Button>
      ) : null}{" "}
      <Button
        fullWidth
        variant="filled"
        color="red"
        mt={2}
        marginTop="lg"
        style={{ borderRadius: "8px" }}
        onClick={() => goBack()}
      >
        Back
      </Button>
    </Container>
  );
}

const renderDetails = (title, details) => (
  <div>
    <Text tt="uppercase" size="lg" fw={900} c={"rgba(59, 58, 58, 1)"}>
      {title || "Something went wrong"}
    </Text>
    {details &&
      details
        .filter((detail) => detail)
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
                c={"red"}
              >
                {detail?.icon ? detail?.icon : null}
              </ActionIcon>{" "}
              {(detail && detail.label) || "Empty"}:
            </h5>
            <h6 tt="uppercase" fw={500} style={{ width: "15rem" }}>
              {(detail && detail.value) || "empty"}
            </h6>
          </div>
        ))}
  </div>
);
