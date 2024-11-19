/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useMemo } from "react";
import { Button } from "@mantine/core";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { PdfButton } from "@/components/Index";
 import { Pagination } from "@nextui-org/react";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";

export default function RecentInvoices({ place_booking, place_job }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const combinedData = [...(place_booking || []), ...(place_job || [])];

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return combinedData.slice(start, end);
  }, [page, combinedData]);

  const handleNavigate = (id) => {
    router.push(`/RecentInvoices/${id}`);
  };

  const renderTableRow = (row, cat) => (
    <TableRow key={row.docId}>
      <TableCell>{row.returnType}</TableCell>
      <TableCell>{row.docId}</TableCell>
      <TableCell>{formatToSydneyTime(row.createdAt)}</TableCell>
      <TableCell>
        $
        {(
          Number(row?.totalPriceWithGST || 0) + Number(row?.totalTollsCost || 0)
        ).toFixed(2)}
      </TableCell>
      <TableCell className="capitalize">
        {row?.currentStatus || "pending"}
      </TableCell>
      <TableCell>
        <Button
          variant="light"
          color="#1384e1"
          onClick={() => handleNavigate(row.docId)}
        >
          View
        </Button>
      </TableCell>
      <TableCell>
        <PdfButton invoice={row} />
      </TableCell>
    </TableRow>
  );

  const total = Math.ceil(combinedData.length / rowsPerPage);

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ width: "80%", margin: "2rem auto" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Job Type</TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Download Invoice</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) =>
              renderTableRow(row, row.jobType || "Unknown")
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
    </>
  );
}
