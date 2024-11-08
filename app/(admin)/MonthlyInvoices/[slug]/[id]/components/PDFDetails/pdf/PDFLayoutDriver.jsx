"use client";

import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import getTotalInvoicePrice from "./getTotalInvoicePrice";
import { format } from "date-fns";
import styles from "./pdf.styles";

export default function MyDocument({ datesRange, invoices, user, pdfId }) {
  const { totalPriceWithGST } = getTotalInvoicePrice(invoices);

  const restrictLength = (str, maxLength) =>
    str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const bookingsByDate = invoices.reduce((acc, booking) => {
    const formattedDate = format(parseDate(booking.date), "dd/MM/yyyy");
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(booking);
    return acc;
  }, {});

  const calcDayPayment = (bookings) => {
    let total = 0;
    bookings.forEach((booking) => {
      total += booking.totalPriceWithGST;
    });
    return total.toFixed(2);
  };

  return (
    <Document>
      <Page size="A3" style={styles.page}>
        {/* Header Section */}
        <Image style={styles.image} alt="logo" src="/pdf_header2.jpg" />

        <View style={[styles.header, { marginTop: 10, marginBottom: 10 }]}>
          <Text style={styles.companyInfo}>
            Direct Transport Solutions Pty Ltd
          </Text>
          <Text style={styles.companyInfo}>ABN 87 658 348 808</Text>
          <Text style={styles.invoiceType}>RECIPIENT GENERATED INVOICE</Text>
        </View>

        <View
          style={[styles.headerDetails, { marginTop: 30, marginBottom: 50 }]}
        >
          <View style={styles.driverInfo}>
            <Text style={styles.para}>Driver: {user?.firstName || ""}</Text>
            <Text style={styles.para}>
              Address:{" "}
              {user.companyAddress === ""
                ? "You don't have address"
                : user.companyAddress}
            </Text>
          </View>

          <View style={styles.invoiceInfo}>
            <Text style={styles.para}>Invoice Number: {pdfId}</Text>
            <Text style={styles.para}>
              Invoice Date: {format(new Date(), "dd/MM/yyyy")}
            </Text>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "33%" }]}>
              <Text style={styles.tableCellHeader}>DATE</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "33%" }]}>
              <Text style={styles.tableCellHeader}>JOBS</Text>
            </View>
            <View
              style={[
                styles.tableColHeader,
                { width: "33%", textAlign: "right" },
              ]}
            >
              <Text style={styles.tableCellHeader}>AMOUNT CASH HELD</Text>
            </View>
          </View>

          {Object.entries(bookingsByDate).map(([date, bookings]) => (
            <View style={styles.tableRow} key={date}>
              <View style={[styles.tableCol, { width: "33%" }]}>
                <Text style={styles.tableCell}>{date}</Text>
              </View>
              <View style={[styles.tableCol, { width: "33%" }]}>
                <Text style={styles.tableCell}>{bookings.length}</Text>
              </View>
              <View
                style={[styles.tableCol, { width: "33%", textAlign: "right" }]}
              >
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  ${calcDayPayment(bookings)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Total Amount Section */}
        <View
          style={{
            padding: 10,
            backgroundColor: "#f8f9fa",
            borderRadius: 8,
            marginTop: 10,
          }}
        >
          <View>
            <Text style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>
              Grand Total
            </Text>

            <Text style={{ fontSize: 12, fontWeight: "500", color: "#d9534f" }}>
              $
              {(
                ((totalPriceWithGST || 0) / 100) *
                (user?.paymentPercentage || 1)
              ).toFixed(2)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
