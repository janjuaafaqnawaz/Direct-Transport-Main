import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Button, Image } from "@mantine/core";
import Link from "next/link";
import { format } from "date-fns";

const BookingTable = ({ bookings }) => {
  function calculateTotalQuantity(data) {
    // Initialize total quantity
    let totalQty = 0;

    // Check if items array exists in data
    if (data.items && Array.isArray(data.items)) {
      // Iterate through each item in the items array
      data.items.forEach((item) => {
        // If the item has a qty property, add its value to totalQty
        if (item.qty) {
          totalQty += parseInt(item.qty, 10);
        }
      });
    }

    return totalQty;
  }

  return (
    <TableContainer component={Paper} className="table-container">
      <Table className="booking-table">
        <TableHead>
          <TableRow>
            <TableCell>Job No</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Service</TableCell>
            <TableCell>Current Status</TableCell>
            <TableCell>Pickup</TableCell>
            <TableCell>Delivery</TableCell>
            <TableCell>
              Cost <br /> ex GST{" "}
            </TableCell>
            <TableCell>Item Qty</TableCell>
            <TableCell>POD</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.docId}>
              <TableCell>{booking.docId}</TableCell>
              <TableCell>
                {format(
                  new Date(
                    booking?.createdAt?.seconds * 1000 +
                      booking.createdAt.nanoseconds / 1000000
                  ),
                  "dd/MM/yyyy hh:mm a"
                )}
              </TableCell>
              <TableCell>{booking.address.Origin.label}</TableCell>
              <TableCell>{booking.address.Destination.label}</TableCell>
              <TableCell>{booking.service}</TableCell>
              <TableCell>{booking?.currentStatus || "Pending"}</TableCell>
              <TableCell>
                {booking?.progressInformation?.pickedup || "Pending"}
              </TableCell>
              <TableCell>
                {booking?.progressInformation?.delivered || "Pending"}
              </TableCell>
              <TableCell>
                <p>${booking?.totalPrice}</p>
              </TableCell>
              <TableCell>{calculateTotalQuantity(booking)}</TableCell>

              <TableCell>
                {booking?.images
                  ? booking?.images.map((url, index) => (
                      <Image
                        key={index}
                        src={url}
                        alt={`Image ${url}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: "10px",
                          marginBottom: 10,
                        }}
                      />
                    ))
                  : "..."}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const BookingsQuery = ({ bookings }) => {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <h2>Track Booking</h2>
      <BookingTable bookings={bookings} />
      <Link style={{ textDecoration: "none" }} href="/ClientServices">
        <Button variant="filled" color="#1384e1" size="lg">
          Client Services
        </Button>
      </Link>
    </section>
  );
};

export default BookingsQuery;
