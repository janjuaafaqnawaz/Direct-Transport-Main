import { getPreviousMonthDates } from "@/api/DateAndTime";
import { Table } from "@mantine/core";
import dynamic from "next/dynamic";
import Link from "next/link";
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function UserTable({ users, bookings }) {
  const { startDateStr, endDateStr } = getPreviousMonthDates();

  const getBadgeColor = (bookingCount) => {
    if (bookingCount > 20) return "green";
    if (bookingCount > 0) return "blue";
    return "gray";
  };

  const rows = users.map((user, key) => {
    const bookingCount = bookings[user.email]?.length || 0;
    const badgeColor = getBadgeColor(bookingCount);

    return (
      <Table.Tr key={key}>
        <Table.Td>{key + 1}</Table.Td>
        <Table.Td>{user.firstName}</Table.Td>
        {/* <Table.Td>
          {startDateStr} - {endDateStr}
        </Table.Td>
        <Table.Td>
          <Tooltip label={`Bookings: ${bookingCount}`} withArrow>
            <Badge color={badgeColor}>{bookingCount}</Badge>
          </Tooltip>
        </Table.Td> */}
        <Table.Td>
          {/* {bookingCount !== 0 ? (
            <PDFDownloadLink
              document={
                <MyDocument invoices={bookings[user.email]} user={user} />
              }
              fileName={`monthly_bookings_${user.firstName}.pdf`}
              style={{
                textDecoration: "none",
                padding: "10px",
                color: "#fff",
                backgroundColor: "#e5383b",
                border: "none",
                borderRadius: "30px",
                margin: "10px",
                cursor: "pointer",
              }}
            >
              {({ blob, url, loading, error }) =>
                loading ? "Loading..." : "PDF"
              }
            </PDFDownloadLink>
          ) : null} */}
          <Link href={`/MonthlyInvoices/${user.email}`}>Go</Link>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table verticalSpacing={20} highlightOnHover striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>No</Table.Th>
          <Table.Th>Company</Table.Th>
          {/* <Table.Th>Date</Table.Th>
          <Table.Th>Total Bookings</Table.Th> */}
          <Table.Th>Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
