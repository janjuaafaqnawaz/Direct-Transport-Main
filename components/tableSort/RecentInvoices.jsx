"use client";

import { useState, useMemo } from "react";
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
import { Eye } from "lucide-react";
import { Pagination } from "@nextui-org/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RecentInvoices({ place_booking, place_job }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const rowsPerPage = 10;

  const combinedData = useMemo(() => {
    return [...(place_booking || []), ...(place_job || [])].filter(
      (booking) => booking.date
    );
  }, [place_booking, place_job]);

  const sortedBookings = useMemo(() => {
    return [...combinedData].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.dateTimestamp;
        const dateB = b.dateTimestamp;
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      } else if (sortBy === "invoice") {
        const invoiceA =
          Number(a?.totalPriceWithGST || 0) + Number(a?.totalTollsCost || 0);
        const invoiceB =
          Number(b?.totalPriceWithGST || 0) + Number(b?.totalTollsCost || 0);
        return sortOrder === "desc" ? invoiceB - invoiceA : invoiceA - invoiceB;
      }
      return 0;
    });
  }, [combinedData, sortBy, sortOrder]);

  const userDoc = useMemo(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("userDoc") || "{}");
    }
    return {};
  }, []);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedBookings.slice(start, end);
  }, [page, sortedBookings]);

  const handleNavigate = (id) => {
    router.push(`/RecentInvoices/${id}`);
  };

  const renderTableRow = (row) => (
    <TableRow key={row.docId}>
      <TableCell className="font-medium">{row.returnType}</TableCell>
      <TableCell>{row.docId}</TableCell>
      <TableCell>{formatToSydneyTime(row.dateTimestamp)}</TableCell>
      <TableCell>
        $
        {(
          Number(row?.totalPriceWithGST || 0) + Number(row?.totalTollsCost || 0)
        ).toFixed(2)}
      </TableCell>
      <TableCell>
        <Badge variant="outline">
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
        <div className="flex justify-end mb-4 space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="invoice">Invoice Amount</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
          <TableBody>{paginatedData.map(renderTableRow)}</TableBody>
        </Table>
        <div className="flex w-full justify-center mt-4">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={total}
            onChange={setPage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
