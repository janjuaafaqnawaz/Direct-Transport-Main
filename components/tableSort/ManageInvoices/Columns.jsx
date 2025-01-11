"use client";

import { Tooltip } from "@mantine/core";
import StatusDropdown from "./InvoiceAction/StatusDropdown";
import DeleteInvoice from "./InvoiceAction/DeleteInvoice";
import EditInvoice from "./InvoiceAction/edit_invoice_modal/Modal";
import TrackDriver from "./InvoiceAction/TrackDriver/TrackDriverModal";
import Assigned from "./InvoiceAction/Assigned";
import InvoicePOD from "./InvoiceAction/pod_invoice_modal/Modal";
import { Chip } from "@nextui-org/react";
import Notes from "./InvoiceAction/notes/Notes";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";
import FixPriceModal from "./InvoiceAction/edit_invoice_modal/FixPriceModal";

const toCapitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export function RowsWithIds({ invoice }) {
  const sortedInvoices = [...invoice].sort(
    (a, b) => b.createdAt.seconds - a.createdAt.seconds
  );

  const rowsWithIds = sortedInvoices.map((row, index) => ({
    ...row,
    id: row.docId || index + 1,
  }));

  return rowsWithIds;
}
export function Columns({ isArchived, hideAction }) {
  return [
    {
      field: "isOpened",
      headerName: "",
      width: 40,
      renderCell: (params) =>
        params.row.isNew ? (
          <Chip size="sm" color="primary">
            New
          </Chip>
        ) : (
          <Chip size="sm"></Chip>
        ),
    },
    { field: "returnType", headerName: "Job Code", width: 60 },
    { field: "docId", headerName: "Job Number", width: 100 },
    {
      field: "date",
      headerName: "Ready Date & Time",
      width: 200,
      valueGetter: (value, row) => row.date + " " + row.time,
    },
    {
      field: "createdAt",
      headerName: "Booking Created",
      width: 170,
      valueGetter: (value, row) => formatToSydneyTime(row?.createdAt),
    },
    { field: "userName", headerName: "Customer", width: 100 },
    {
      field: "pickupSuburb",
      headerName: "Pickup Suburb",
      width: 100,
      valueGetter: (value, row) => row?.pickupSuburb,
    },
    {
      field: "deliverySuburb",
      headerName: "Delivery Suburb",
      width: 100,
      valueGetter: (value, row) => row?.deliverySuburb,
    },
    {
      field: "totalPriceWithGST",
      headerName: "Invoice",
      width: 100,
      valueGetter: (value, row) =>
        "$" +
        (
          Number(row?.totalPriceWithGST) + Number(row?.totalTollsCost || 0)
        ).toFixed(2),
    },
    {
      field: "currentStatus",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Chip size="sm" color="primary">
          {toCapitalize(params?.row?.currentStatus) || "Pending"}
        </Chip>
      ),
    },
    !hideAction && {
      field: "driverName",
      headerName: "Driver Name",
      width: 90,
      valueGetter: (value, row) => toCapitalize(row?.driverName) || "N/A",
    },
    !hideAction && {
      field: "actions",
      headerName: "Actions",
      width: 500,
      renderCell: (params) => (
        <>
          <Tooltip label="Pick Status">
            <StatusDropdown booking={params.row} />
          </Tooltip>
          <FixPriceModal booking={params.row || ""} />
          <Tooltip label="Assign Driver">
            <Assigned booking={params.row || ""} />
          </Tooltip>
          <Tooltip label="Notes">
            <Notes booking={params.row || ""} />
          </Tooltip>
          <Tooltip label="Edit Invoice">
            <EditInvoice id={params.row.docId || ""} />
          </Tooltip>
          <InvoicePOD id={params.row.docId || ""} />
          <TrackDriver booking={params.row || ""} />
          <DeleteInvoice
            isArchived={isArchived}
            id={params.row.docId}
            booking={params.row}
          />
        </>
      ),
    },
  ].filter(Boolean);
}
