"use client";

import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
import { StyleSheet } from "@react-pdf/renderer";
import getTotalInvoicePrice from "./getTotalInvoicePrice";
import { format } from "date-fns";

export default function MyDocument({ datesRange, invoices, user, pdfId }) {
  const { start, end } = datesRange;
  const {
    totalPrice,
    totalGst,
    totalTolls,
    totalUnloading,
    totalPriceWithGST,
  } = getTotalInvoicePrice(invoices);

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
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.leftHeader}>
            <Text style={styles.companyName}>
              Direct Transport Solutions Pty Ltd
            </Text>
            <Text style={styles.companyDetails}>1353 The Horsley Dr</Text>
            <Text style={styles.companyDetails}>Wetherill park</Text>
            <Text style={styles.companyDetails}>NSW 2164</Text>
            <Text style={styles.companyDetails}>Phone: 02 9188 0894</Text>
            <Text style={styles.companyDetails}>
              accounts@directtransport?.com.au
            </Text>
            <Text style={styles.companyDetails}>
              www.directtransport?.com.au
            </Text>
            <Text style={styles.companyDetails}>ABN: 87 658 348 808</Text>
          </View>
          <Image alt="logo" style={styles.logo} src="/pdf_header2.jpg" />
        </View>

        <View style={styles.invoiceHeader}>
          <Text style={styles.invoiceTitle}>Tax invoice</Text>
          <View style={styles.invoiceDetails}>
            <View style={styles.invoiceRow}>
              <Text style={styles.label}>Invoice number</Text>
              <Text style={styles.value}>{pdfId}</Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.label}>Issue date</Text>
              <Text style={styles.value}>
                {format(new Date(), "dd/MM/yyyy")}
              </Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.label}>Due date</Text>
              <Text style={styles.value}>
                {format(
                  new Date(new Date().setDate(new Date().getDate() + 7)),
                  "dd/MM/yyyy"
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.billingSection}>
          <View style={styles.billTo}>
            <Text style={styles.sectionTitle}>Bill to</Text>
            <Text style={styles.addressText}>
              {user?.name || "Customer Name"}
            </Text>
            <Text style={styles.addressText}>
              {user?.company || "Company Name"}
            </Text>
            <Text style={styles.addressText}>{user?.address || "Address"}</Text>
            <Text style={styles.addressText}>Australia</Text>
          </View>
          <View style={styles.shipTo}>
            <Text style={styles.sectionTitle}>Ship to</Text>
            <Text style={styles.addressText}>
              {user?.name || "Customer Name"}
            </Text>
            <Text style={styles.addressText}>
              {user?.company || "Company Name"}
            </Text>
            <Text style={styles.addressText}>{user?.address || "Address"}</Text>
            <Text style={styles.addressText}>Australia</Text>
          </View>
        </View> */}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.descriptionHeader}>Description</Text>
            <Text style={styles.taxHeader}>Tax</Text>
            <Text style={styles.amountHeader}>Amount ($)</Text>
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
                  style={[
                    styles.tableCol,
                    { width: "50%", textAlign: "right" },
                  ]}
                >
                  <Text style={[styles.tableCell, { textAlign: "right" }]}>
                    {calcDayPayment(bookings)}
                  </Text>
                </View>
              </View>
            ))}

            <View style={styles.tableRow}>
              <Text style={styles.descriptionCell}>
                Courier Services - {format(parseDate(start), "MMMM yyyy")}
              </Text>
              <Text style={styles.taxCell}>GST</Text>
              <Text style={styles.amountCell}>{totalGst}</Text>
            </View>

            <View style={styles.tableSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Price</Text>
                <Text style={styles.summaryAmount}>${totalPrice}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount (inc. gst)</Text>
                <Text style={styles.summaryAmount}>${totalPriceWithGST}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.balanceDueLabel}>Balance due</Text>
                <Text style={styles.balanceDueAmount}>
                  $
                  {(
                    ((totalPriceWithGST || 0) / 100) *
                    (user?.paymentPercentage || 0)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

const styles = StyleSheet?.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 48,
  },
  leftHeader: {
    flexDirection: "column",
  },
  logo: {
    width: 250,
    height: 140,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 10,
    marginBottom: 2,
  },
  invoiceHeader: {
    marginBottom: 30,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  invoiceDetails: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 40,
  },
  invoiceRow: {
    flexDirection: "column",
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: "#666",
  },
  value: {
    fontSize: 10,
  },
  billingSection: {
    flexDirection: "row",
    marginBottom: 30,
    gap: 40,
  },
  billTo: {
    flex: 1,
  },
  shipTo: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addressText: {
    fontSize: 10,
    marginBottom: 2,
  },
  table: {
    flexDirection: "column",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 8,
    color: "#fff",
  },
  descriptionHeader: {
    flex: 2,
    fontSize: 10,
  },
  taxHeader: {
    flex: 1,
    fontSize: 10,
    textAlign: "right",
  },
  amountHeader: {
    flex: 1,
    fontSize: 10,
    textAlign: "right",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    padding: 8,
  },
  descriptionCell: {
    flex: 2,
    fontSize: 10,
  },
  taxCell: {
    flex: 1,
    fontSize: 10,
    textAlign: "right",
  },
  amountCell: {
    flex: 1,
    fontSize: 10,
    textAlign: "right",
  },
  tableSummary: {
    marginTop: 20,
    alignSelf: "flex-end",
    width: "50%",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
  },
  summaryAmount: {
    fontSize: 10,
  },
  balanceDueLabel: {
    fontSize: 12,
    fontWeight: "bold",
  },
  balanceDueAmount: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
// "use client";

// import { Page, Text, View, Document, Image } from "@react-pdf/renderer";
// import { StyleSheet } from "@react-pdf/renderer";
// import getTotalInvoicePrice from "./getTotalInvoicePrice";
// import { format } from "date-fns";

// export default function MyDocument({ datesRange, invoices, user, pdfId }) {
//   const { start, end } = datesRange;
//   const { totalPriceWithGST } = getTotalInvoicePrice(invoices);

//   const restrictLength = (str, maxLength) =>
//     str.length > maxLength ? str.slice(0, maxLength) + "..." : str;

//   const parseDate = (dateStr) => {
//     const [day, month, year] = dateStr.split("/").map(Number);
//     return new Date(year, month - 1, day);
//   };

//   // Group bookings by date (formatted as dd/MM/yyyy)
//   const bookingsByDate = invoices.reduce((acc, booking) => {
//     const formattedDate = format(parseDate(booking.date), "dd/MM/yyyy");
//     if (!acc[formattedDate]) {
//       acc[formattedDate] = [];
//     }
//     acc[formattedDate].push(booking);
//     return acc;
//   }, {});

//   const calcDayPayment = (bookings) => {
//     let total = 0;
//     bookings.forEach((booking) => {
//       total += booking.totalPriceWithGST;
//     });
//     return total.toFixed(2);
//   };

//   return (
//     <Document>
//       <Page size="A3" style={styles.page}>
//         {/* Header */}
//         {/* Header */}
//         <View style={styles.header}>
//           <Image style={styles.logo} src="/pdf_header2.jpg" />

//           <View style={styles.companyInfo}>
//             <Text style={styles.companyName}>
//               Direct Transport Solutions Pty Ltd
//             </Text>
//             <Text style={styles.companyDetails}>
//               1353 The Horsley Dr, Wetherill Park, NSW 2164
//             </Text>
//             <Text style={styles.companyDetails}>Phone: 02 9188 0894</Text>
//             <Text style={styles.companyDetails}>
//               Email: accounts@directtransport.com.au
//             </Text>
//             <Text style={styles.companyDetails}>ABN: 87 658 348 808</Text>
//           </View>

//           <View style={styles.invoiceInfo}>
//             <Text style={styles.invoiceLabel}>Tax Invoice</Text>
//             <Text>Invoice Number: {pdfId}</Text>
//             <Text>Issue Date: {format(new Date(), "dd/MM/yyyy")}</Text>
//             <Text>
//               Invoice Period: {start} - {end}
//             </Text>
//           </View>
//         </View>

//         {/* Table */}
//         <View style={styles.table}>
//           <View style={styles.tableRow}>
//             <View style={[styles.tableColHeader, { width: "50%" }]}>
//               <Text style={styles.tableCellHeader}>DATE</Text>
//             </View>
//             <View style={[styles.tableColHeader, { width: "50%" }]}>
//               <Text style={styles.tableCellHeader}>Total Bookings</Text>
//             </View>
//             <View style={[styles.tableColHeader, { width: "50%" }]}>
//               <Text style={styles.tableCellHeader}>Total Earned </Text>
//             </View>
//           </View>

//           {Object.entries(bookingsByDate).map(([date, bookings]) => (
//             <View style={styles.tableRow} key={date}>
//               <View style={[styles.tableCol, { width: "50%" }]}>
//                 <Text style={styles.tableCell}>{date}</Text>
//               </View>
//               <View style={[styles.tableCol, { width: "50%" }]}>
//                 <Text style={styles.tableCell}>{bookings.length}</Text>
//               </View>
//               <View style={[styles.tableCol, { width: "50%" }]}>
//                 <Text style={styles.tableCell}>{calcDayPayment(bookings)}</Text>
//               </View>
//             </View>
//           ))}

//           <View style={{ width: "100%", marginBottom: 20, marginTop: 20 }}>
//             <Text
//               style={{
//                 marginLeft: "auto",
//                 fontWeight: "extrabold",
//                 fontSize: 12,
//                 marginRight: 20,
//               }}
//             >
//               Booking Total: ${totalPriceWithGST}
//             </Text>
//             <Text
//               style={{
//                 marginLeft: "auto",
//                 fontWeight: "extrabold",
//                 fontSize: 12,
//                 marginRight: 20,
//               }}
//             >
//               Payment Due: $
//               {(
//                 ((totalPriceWithGST || 0) / 100) *
//                 (user?.paymentPercentage || 0)
//               ).toFixed(2)}
//             </Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#FFF",
//     padding: 10,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingBottom: 10,
//     borderBottomWidth: 2,
//     borderBottomColor: "#333",
//     marginBottom: 10,
//   },
//   logo: {
//     width: 100,
//     height: 50,
//   },
//   companyInfo: {
//     flex: 1,
//     marginLeft: 10,
//   },
//   companyName: {
//     fontSize: 12,
//     fontWeight: "bold",
//   },
//   companyDetails: {
//     fontSize: 10,
//     color: "#555",
//   },
//   invoiceInfo: {
//     textAlign: "right",
//     fontSize: 10,
//   },
//   invoiceLabel: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   table: {
//     display: "table",
//     width: "auto",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#bfbfbf",
//     marginTop: 20,
//   },
//   tableRow: {
//     flexDirection: "row",
//   },
//   tableColHeader: {
//     width: "12%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#bfbfbf",
//     backgroundColor: "#f3f3f3",
//     padding: 5,
//   },
//   tableCol: {
//     width: "12%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderColor: "#bfbfbf",
//     padding: 5,
//     wordWrap: "break-word", // For older browsers
//     overflowWrap: "break-word", // Modern browsers
//     wordBreak: "break-all", // Break long words
//     overflow: "hidden",
//     whiteSpace: "normal",
//   },

//   tableCellHeader: {
//     fontSize: 10,
//     fontWeight: "bold",
//     wordWrap: "break-word", // For older browsers
//     overflowWrap: "break-word", // Modern browsers
//     wordBreak: "break-all", // Break long words
//     overflow: "hidden",
//     whiteSpace: "normal",
//   },

//   tableCell: {
//     fontSize: 8,
//     wordWrap: "break-word", // For older browsers
//     overflowWrap: "break-word", // Modern browsers
//     wordBreak: "break-all", // Break long words
//     overflow: "hidden",
//     whiteSpace: "normal",
//   },
//   image: {
//     width: 200,
//     height: 100,
//   },

//   heading: {
//     fontSize: 15,
//     fontWeight: "extrabold",
//     margin: "10px 0",
//   },

//   para: {
//     fontSize: 10,
//     fontWeight: "hairline",
//   },
//   boldText: {
//     fontSize: 12,
//     fontWeight: "extrabold",
//   },
//   row: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 4,
//     width: "300px",
//   },
//   rowItem1: {
//     fontSize: 12,
//     fontWeight: "extrabold",
//     width: "50%",
//   },
//   rowItem2: {
//     fontSize: 12,
//     width: "50%",
//   },
// });
