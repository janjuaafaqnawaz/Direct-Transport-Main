"use client";

import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import styles from "./pdf.styles";
import {
  getFirstDateOfCurrentMonth,
  getPreviousMonthDates,
} from "@/api/DateAndTime";
import getTotalInvoicePrice from "./getTotalInvoicePrice";

export default function MyDocument({ invoices, logo }) {
  const { startDateStr, endDateStr } = getPreviousMonthDates();
  console.log({ startDateStr, endDateStr });
  const { totalPrice, totalGst, totalTolls, totalUnloading } =
    getTotalInvoicePrice(invoices);
  console.log(
    Number(totalPrice) +
      Number(totalTolls) +
      Number(totalUnloading) +
      Number(totalGst)
  );
  const restrictLength = (str, maxLength) =>
    str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}

        <View style={styles.header}>
          <Image style={styles.image} src="/pdf_header2.jpg" />
          <View>
            <Text style={styles.headerText}>
              Campany Name: {invoices[0]?.userName || ""}
            </Text>{" "}
            <Text style={styles.headerText}>
              Date of issue: {getFirstDateOfCurrentMonth()}
            </Text>{" "}
            <Text style={styles.headerText}>
              Time period: {startDateStr} - {endDateStr}
            </Text>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>DATE</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>JOB NO</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>FROM</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>TO</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>SERV</Text>
            </View>
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
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>TOTAL</Text>
            </View>
          </View>
          {/* Example row - repeat for actual data */}

          {invoices.map((booking, ind) => {
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
                <View key={ind} style={styles.tableRow}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.date} </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{booking.docId} </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{originLabel} </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{destinationLabel}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}> {booking.service}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>${booking.totalPrice}</Text>
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
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      $
                      {(
                        Number(booking?.totalPrice || 0) +
                        Number(booking?.totalTollsCost || 0) +
                        Number(booking?.gst || 0) +
                        Number(booking?.unloading || 0)
                      ).toFixed(2)}
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
              Total Price ex GST: $
              {Number(totalPrice) + Number(totalTolls) + Number(totalUnloading)}
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
          {/* <Text style={styles.heading}>REMITTANCE ADVICE</Text>
          <Text style={styles.para}>Please make your payment to `{">>>"}`</Text>
          <Text style={{ fontSize: 12, marginTop: 10 }}>
            Account: {invoices[0]?.userName || ""} | Total this invoice: $
            {Number(totalPrice) +
              Number(totalTolls) +
              Number(totalUnloading) +
              Number(totalGst)}
            | Job Number: {invoices[0]?.docId || ""}
          </Text> */}
        </View>
      </Page>
    </Document>
  );
}
