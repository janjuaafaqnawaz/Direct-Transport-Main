"use client";

import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import styles from "./pdf.styles";
import {
  getFirstDateOfCurrentMonth,
  getPreviousMonthDates,
} from "@/api/DateAndTime";
import getTotalInvoicePrice from "./getTotalInvoicePrice";

export default function MyDocument({ invoices, user }) {
  const { startDateStr, endDateStr } = getPreviousMonthDates();
  console.log({ startDateStr, startDateStr });
  const { totalPrice, totalGst, totalTolls, totalUnloading } =
    getTotalInvoicePrice(invoices);

  const restrictLength = (str, maxLength) =>
    str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedBookings = invoices.sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}

        <View style={styles.header}>
          <Image style={styles.image} alt="logo" src="/pdf_header2.jpg" />

          <View>
            <Text style={styles.heading}>TAX INVOICE</Text>
            <Text style={styles.headerText}>
              Direct Transport Solutions Pty Ltd
            </Text>
            <Text style={styles.para}>Phone: (02) 9030 0333</Text>
            <Text style={styles.para}>ABN 87 658 348 808</Text>
            <Text style={styles.para}>
              1353 The Horsley Dr Wetherill Park NSW 2164
            </Text>
            <Text style={styles.para}>
              Email: bookings@courierssydney.com.au
            </Text>
          </View>
        </View>
        {/* Header */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>DATE</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>JOB NO</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Pickup Company </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Drop Company </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Ref </Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Job Code</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Serv/Charges</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Serv.</Text>
            </View>{" "}
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>COST</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>TOLLS</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Wait/Unload</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>GST</Text>
            </View>
          </View>

          {sortedBookings &&
            sortedBookings.reverse().map((booking, ind) => {
              const originLabel = restrictLength(
                booking.address?.Origin?.label || "N/A",
                30
              );
              const destinationLabel = restrictLength(
                booking.address?.Destination?.label || "N/A",
                30
              );

              return (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{booking.date} </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{booking.docId} </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {booking.pickupCompanyName}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {booking.dropCompanyName}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {booking.internalReference}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {" "}
                        {booking.returnType}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${booking?.serviceCharges || 0}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{booking.service}</Text>
                    </View>{" "}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${booking.totalPrice}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${booking?.totalTollsCost}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${booking.unloading || 0}
                      </Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        ${(booking?.gst).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </>
              );
            })}
          <View style={{ width: "100%", marginBottom: 20, marginTop: 20 }}>
            <Text
              style={{
                marginLeft: "auto",
                fontWeight: "extrabold",
                fontSize: 12,
                marginRight: 20,
              }}
            >
              Total Price incl GST: $
              {(
                Number(totalPrice) +
                Number(totalGst) +
                Number(totalTolls) +
                Number(totalUnloading)
              ).toFixed(2)}
            </Text>
          </View>
        </View>
        {/* Footer */}
        <View>
          <Text style={styles.heading}>Terms strictly apply</Text>
          <Text style={styles.para}>
            All shipments by Direct Transport Solutions Pty Ltd and its agents
            are subject to our standard terms and conditions. Insurance
            liability has not been arranged or included unless specifically
            requested beforehand, along with the appropriate premium.
          </Text>
          <Text style={styles.heading}>Direct Transport Solutions Pty Ltd</Text>
          <Text style={styles.para}>
            ABN 87 658 348 808| 1353 The Horsley Dr Wetherill Park NSW 2164 |
            Phone: (02) 9030 0333| Email: bookings@courierssydney.com.au
          </Text>
        </View>
      </Page>
    </Document>
  );
}
