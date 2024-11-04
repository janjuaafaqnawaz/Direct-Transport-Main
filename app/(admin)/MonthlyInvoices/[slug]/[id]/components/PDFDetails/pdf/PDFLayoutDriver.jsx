"use client";

import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import getTotalInvoicePrice from "./getTotalInvoicePrice";
import { format } from "date-fns";
import styles from "./pdf.styles";

export default function MyDocument({ datesRange, invoices, user, pdfId }) {
  const { start, end } = datesRange;
  const { totalPrice, totalGst, totalPriceWithGST } =
    getTotalInvoicePrice(invoices);

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
        <View style={styles.header}>
          <Image style={styles.image} alt="logo" src="/pdf_header2.jpg" />

          <View>
            <Text style={styles.heading}>TAX INVOICE</Text>
            <Text style={styles.para}>{user?.firstName || ""}</Text>
            <Text style={styles.para}> {user.companyAddress}</Text>
            <Text style={styles.para}>Invoice ID: {pdfId}</Text>
            {/* <Text style={styles.para}>
              Invoice period: {start} - {end}
            </Text> */}
            <Text style={styles.para}>Payment Terms - 14 days</Text>
            <Text style={styles.para}>
              Date of issue: {format(new Date(), "dd/MM/yyyy")}
            </Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: "50%" }]}>
              <Text style={styles.tableCellHeader}>DATE</Text>
            </View>
            <View style={[styles.tableColHeader, { width: "50%" }]}>
              <Text style={styles.tableCellHeader}>Total Bookings</Text>
            </View>
            <View
              style={[
                styles.tableColHeader,
                { width: "50%", textAlign: "right" },
              ]}
            >
              <Text style={styles.tableCellHeader}>Total Earned </Text>
            </View>
          </View>

          {Object.entries(bookingsByDate).map(([date, bookings]) => (
            <View style={styles.tableRow} key={date}>
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCell}>{date}</Text>
              </View>
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCell}>{bookings.length}</Text>
              </View>
              <View
                style={[styles.tableCol, { width: "50%", textAlign: "right" }]}
              >
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  $
                  {(
                    ((calcDayPayment(bookings) || 0) / 100) *
                    (user?.paymentPercentage || 0)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>
        <View
          style={{ padding: 10, backgroundColor: "#f8f9fa", borderRadius: 8 }}
        >
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>
              Price
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#000" }}>
              ${totalPrice}
            </Text>

            <Text
              style={{
                fontSize: 10,
                color: "#555",
                marginTop: 12,
                marginBottom: 4,
              }}
            >
              Total Amount (inc. GST)
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#000" }}>
              ${totalPriceWithGST}
            </Text>

            <Text
              style={{
                fontSize: 10,
                color: "#555",
                marginTop: 12,
                marginBottom: 4,
              }}
            >
              Balance Due
            </Text>
            <Text style={{ fontSize: 12, fontWeight: "500", color: "#d9534f" }}>
              $
              {(
                ((totalPriceWithGST || 0) / 100) *
                (user?.paymentPercentage || 0)
              ).toFixed(2)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
