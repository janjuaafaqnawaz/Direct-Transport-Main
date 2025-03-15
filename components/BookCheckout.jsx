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
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import getSuburbByLatLng from "@/api/getSuburbByLatLng";
import {
  addFrequentAddress,
  postInvoice,
} from "@/api/firebase/functions/upload";
import sendBookingEmail from "@/api/sendBookingEmail";
import ProcessPrice from "@/api/price_calculation/index";
import Loading from "./Loading";
import DimensionsTable from "./ItemDimensions/DimensionsTable";
import StripeWrapper from "@/components/stripe/StripeWrapper";
import "@mantine/dates/styles.css";

export default function BookCheckout({
  formData,
  action,
  back,
  payment,
  fetchTolls,
  selectedEmail,
  goBack,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(formData);
  const [creating, setCreating] = useState(false);

  // Process booking data on mount
  useEffect(() => {
    const processBooking = async () => {
      try {
        const processedData = await ProcessPrice(formData, fetchTolls);
        setInvoice(processedData);
      } catch (error) {
        console.error("Error processing booking:", error);
        toast.error("Unable to process your booking. Please try again.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    processBooking();
  }, [formData, fetchTolls, router]);

  // Save frequent address
  const handleAddressSave = async (address) => {
    try {
      await addFrequentAddress({ ...address, label: address.label }, true);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address.");
    }
  };

  // Convert date string to Firestore Timestamp
  const convertToTimestamp = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return Timestamp.fromDate(new Date(`${year}-${month}-${day}T00:00:00Z`));
  };

  // Handle booking submission
  const handleSubmit = async () => {
    setCreating(true);

    try {
      const { savePickAddress, saveDropAddress, address, date } = invoice;

      if (savePickAddress) await handleAddressSave(address?.Origin);
      if (saveDropAddress) await handleAddressSave(address?.Destination);

      const pickupSuburb = await getSuburbByLatLng(address?.Origin?.label);
      const deliverySuburb = await getSuburbByLatLng(
        address?.Destination?.label
      );
      const dateTimestamp = convertToTimestamp(date);

      const delivery = {
        ...invoice,
        pickupSuburb,
        deliverySuburb,
        dateTimestamp,
      };

      const id = await postInvoice(delivery, "place_bookings", selectedEmail);

      if (id) {
        console.log("Booking uploaded with id:", id);
        await sendBookingEmail(invoice, id, invoice?.name || invoice?.contact);
        router.push(`/RecentInvoices/${id}`);
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  // Render loading state
  if (loading) {
    return <Loading />;
  }

  return (
    <Container
      size="sm"
      style={{
        borderRadius: "1.5rem",
        padding: "2.5rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        background: "linear-gradient(to bottom, #ffffff, #f9fafb)",
      }}
      className="container my-10"
    >
      <div className="space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Booking Summary
          </h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Booking Information */}
        {renderDetails("Booking Information", [
          invoice?.email && {
            icon: <AccountCircle />,
            label: "Email",
            value: invoice.email,
          },
          {
            icon: <Email />,
            label: "Internal Reference",
            value: invoice.internalReference,
          },
          { icon: <Email />, label: "Contact", value: invoice.contact },
          { icon: <Today />, label: "Date", value: invoice.date },
          { icon: <AccessTime />, label: "Time", value: invoice.time },
        ])}

        {/* Pickup and Drop-off Information */}
        {renderDetails("Pickup and Drop-off Information", [
          {
            icon: <LocationOn />,
            label: "Pickup Company Name",
            value: invoice.pickupCompanyName,
          },
          {
            icon: <LocationOn />,
            label: "Pickup Address",
            value: invoice.address?.Origin.label,
          },
          {
            icon: <LocationOn />,
            label: "Drop Company Name",
            value: invoice.dropCompanyName,
          },
          {
            icon: <LocationOn />,
            label: "Drop Address",
            value: invoice.address?.Destination.label,
          },
          {
            icon: <AccessTime />,
            label: "Reference",
            value: invoice.pickupReference1,
          },
          {
            icon: <AccessTime />,
            label: "Delivery Instructions",
            value: invoice.deliveryIns,
          },
        ])}

        {/* Pricing Information */}
        <div className=" ">
          <Text
            tt="uppercase"
            size="lg"
            fw={900}
            c="rgba(59, 58, 58, 1)"
            className="mb-4 border-b pb-2"
          >
            Pricing Details
          </Text>

          {invoice.requestQuote ? (
            <div className="flex justify-between items-center p-3 rounded-lg ">
              <div className="flex items-center">
                <ActionIcon
                  variant="light"
                  mr={20}
                  p={20}
                  radius="lg"
                  c="blue"
                  className="bg-blue-50"
                >
                  <AttachMoney />
                </ActionIcon>
                <h5 className="font-semibold text-gray-700">Request Quote</h5>
              </div>
              <Button>Go</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {invoice.totalTolls > 0 && (
                <div className="flex justify-between items-center p-3 rounded-lg ">
                  <div className="flex items-center">
                    <ActionIcon
                      variant="light"
                      mr={20}
                      p={20}
                      radius="lg"
                      c="blue"
                      className="bg-blue-50"
                    >
                      <AttachMoney />
                    </ActionIcon>
                    <h5 className="font-semibold text-gray-700">Tolls</h5>
                  </div>
                  <h6 className="font-medium text-gray-900">
                    ${invoice.totalTollsCost}
                  </h6>
                </div>
              )}

              <div className="flex justify-between items-center p-3 rounded-lg ">
                <div className="flex items-center">
                  <ActionIcon
                    variant="light"
                    mr={20}
                    p={20}
                    radius="lg"
                    c="blue"
                    className="bg-blue-50"
                  >
                    <AttachMoney />
                  </ActionIcon>
                  <h5 className="font-semibold text-gray-700">GST</h5>
                </div>
                <h6 className="font-medium text-gray-900">${invoice.gst}</h6>
              </div>

              <div className="flex justify-between items-center p-3 rounded-lg ">
                <div className="flex items-center">
                  <ActionIcon
                    variant="light"
                    mr={20}
                    p={20}
                    radius="lg"
                    c="blue"
                    className="bg-blue-50"
                  >
                    <AttachMoney />
                  </ActionIcon>
                  <h5 className="font-semibold text-gray-700">Price</h5>
                </div>
                <h6 className="font-medium text-gray-900">
                  ${invoice.totalPrice}
                </h6>
              </div>

              {invoice.serviceCharges !== 0 && (
                <div className="flex justify-between items-center p-3 rounded-lg ">
                  <div className="flex items-center">
                    <ActionIcon
                      variant="light"
                      mr={20}
                      p={20}
                      radius="lg"
                      c="blue"
                      className="bg-blue-50"
                    >
                      <AttachMoney />
                    </ActionIcon>
                    <h5 className="font-semibold text-gray-700">
                      Service Charges
                    </h5>
                  </div>
                  <h6 className="font-medium text-gray-900">
                    ${invoice.serviceCharges}
                  </h6>
                </div>
              )}

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg shadow-sm mt-4 border-t-2 border-blue-100">
                <div className="flex items-center">
                  <ActionIcon
                    variant="filled"
                    mr={20}
                    p={20}
                    radius="lg"
                    c="white"
                    className="bg-blue-500"
                  >
                    <AttachMoney />
                  </ActionIcon>
                  <h5 className="font-bold text-gray-800">
                    Total Price (incl. GST)
                  </h5>
                </div>
                <h6 className="font-bold text-xl text-blue-600">
                  $
                  {(
                    Number(invoice.totalPriceWithGST) +
                    Number(invoice.totalTollsCost)
                  ).toFixed(2)}
                </h6>
              </div>
            </div>
          )}
        </div>

        {/* Item Dimensions Table */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="font-semibold text-xl text-gray-800">
              Item Dimensions
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Detailed dimensions for the items in your invoice.
            </p>
          </div>
          <div className="p-3">
            <DimensionsTable
              items={invoice.items}
              handleDelete={null}
              disable={true}
              invoice={invoice}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 space-y-3">
          {!payment ? (
            <Button
              fullWidth
              variant="filled"
              color="#1383e1"
              onClick={handleSubmit}
              loading={creating}
              size="md"
            >
              Confirm Booking
            </Button>
          ) : (
            <StripeWrapper formData={formData} />
          )}

          {back && (
            <Button
              fullWidth
              variant="outline"
              color="#1383e1"
              mt={2}
              onClick={() => action("summary")}
              size="md"
            >
              Back to Summary
            </Button>
          )}

          <Button size="md" fullWidth color="#d62828" mt={2} onClick={goBack}>
            Cancel
          </Button>
        </div>
      </div>
    </Container>
  );
}

// Helper function to render details section
const renderDetails = (title, details) => (
  <div className="     ">
    <Text
      tt="uppercase"
      size="lg"
      fw={900}
      c="rgba(59, 58, 58, 1)"
      className="mb-6  pb-2"
    >
      {title}
    </Text>
    <div className="space-y-1 ">
      {details.filter(Boolean).map((detail, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex items-center mb-2 sm:mb-0 ">
            <ActionIcon
              variant="light"
              mr={20}
              p={20}
              radius="lg"
              c="blue"
              className="bg-blue-50 shrink-0"
            >
              {detail.icon}
            </ActionIcon>
            <h5 className="font-semibold text-gray-700">{detail.label}</h5>
          </div>
          <h6 className="font-medium text-gray-900 sm:text-right sm:w-auto w-full pl-14 sm:pl-0 max-w-[50%] ">
            {detail.value || "—"}
          </h6>
        </div>
      ))}
    </div>
  </div>
);
