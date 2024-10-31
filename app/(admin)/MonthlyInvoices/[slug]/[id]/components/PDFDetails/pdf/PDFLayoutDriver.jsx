"use client";

import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import styles from "./pdf.styles";
import getTotalInvoicePrice from "./getTotalInvoicePrice";
import { format } from "date-fns";

export default function MyDocument({ datesRange, invoices, user, pdfId }) {
  const { start, end } = datesRange;
  const { totalPrice, totalGst, totalTolls, totalUnloading } =
    getTotalInvoicePrice(invoices);

  const restrictLength = (str, maxLength) =>
    str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  // Group bookings by date (formatted as dd/MM/yyyy)
  const bookingsByDate = invoices.reduce((acc, booking) => {
    const formattedDate = format(parseDate(booking.date), "dd/MM/yyyy");
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(booking);
    return acc;
  }, {});

  return (
    <Document>
      <Page size="A3" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image style={styles.image} alt="logo" src="/pdf_header2.jpg" />
          <View>
            <Text style={styles.heading}>Recipient Generated Invoice</Text>
            <Text style={styles.para}>{user.companyAddress}</Text>
            <Text style={styles.para}>Driver Name: {user.firstName}</Text>
            <Text style={styles.para}>Invoice Number: {pdfId}</Text>
            <Text style={styles.para}>
              Invoice period: {start} - {end}
            </Text>
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
          </View>

          {Object.entries(bookingsByDate).map(([date, bookings]) => (
            <View style={styles.tableRow} key={date}>
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCell}>{date}</Text>
              </View>
              <View style={[styles.tableCol, { width: "50%" }]}>
                <Text style={styles.tableCell}>{bookings.length}</Text>
              </View>
            </View>
          ))}

          <View style={{ width: "100%", marginBottom: 20, marginTop: 20 }}>
            <Text
              style={{
                marginLeft: "auto",
                fontWeight: "extrabold",
                fontSize: 12,
                marginRight: 20,
              }}
            >
              Grand Total: {invoices.length}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
