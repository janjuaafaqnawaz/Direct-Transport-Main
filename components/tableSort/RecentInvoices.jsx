/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PdfButton } from "@/components/Index";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";
import TrackDriver from "./ManageInvoices/InvoiceAction/TrackDriver/TrackDriverModal";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";
import { Pagination } from "@nextui-org/react";

export default function RecentInvoices({ place_booking, place_job }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const combinedData = [...(place_booking || []), ...(place_job || [])];
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const sortedBookings = combinedData
    .filter((booking) => booking.date)
    .sort((a, b) => parseDate(b.date) - parseDate(a.date));
  const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedBookings.slice(start, end);
  }, [page, sortedBookings]);

  const handleNavigate = (id) => {
    router.push(`/RecentInvoices/${id}`);
  };

  const renderTableRow = (row, cat) => (
    <TableRow key={row.docId}>
      <TableCell className="font-medium">{row.returnType}</TableCell>
      <TableCell>{row.docId}</TableCell>
      <TableCell>{row?.date}</TableCell>
      <TableCell>
        $
        {(
          Number(row?.totalPriceWithGST || 0) + Number(row?.totalTollsCost || 0)
        ).toFixed(2)}
      </TableCell>
      <TableCell>
        <Badge variant={"outline"}>
          <p className="uppercase text-gray-800">
            {row?.currentStatus || "Pending"}
          </p>
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigate(row.docId)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
          {userDoc?.tracking && <TrackDriver customBtn={true} booking={row} />}
        </div>
      </TableCell>
      <TableCell>
        <PdfButton invoice={row} />
      </TableCell>
    </TableRow>
  );

  const total = Math.ceil(combinedData.length / rowsPerPage);

  return (
    <Card className="w-full max-w-6xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <CardDescription>View and manage your recent invoices</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Type</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>View</TableHead>
              <TableHead>Download Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) =>
              renderTableRow(row, row.jobType || "Unknown")
            )}
          </TableBody>
        </Table>
        <div className="flex w-full justify-center mt-4">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={total}
            onChange={setPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
