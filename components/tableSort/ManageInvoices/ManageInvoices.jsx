"use client";

import { DataGrid } from "@mui/x-data-grid";
import { Tooltip } from "@mantine/core";
import { format } from "date-fns";
import StatusDropdown from "./InvoiceAction/StatusDropdown";
import DeleteInvoice from "./InvoiceAction/DeleteInvoice";
import EditInvoice from "./InvoiceAction/edit_invoice_modal/Modal";
import Assigned from "./InvoiceAction/Assigned";
import InvoicePOD from "./InvoiceAction/pod_invoice_modal/Modal";
import { Chip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useFirebase } from "@/context/FirebaseContext";

export default function ManageInvoices({ invoice, hideAction }) {
  const [invoicesWithSuburbs, setInvoicesWithSuburbs] = useState([]);

  useEffect(() => {
    const fetchSuburbs = async () => {
      // const updatedInvoices = await Promise.all(
      //   invoice.map(async (inv) => {
      //     const pickupSuburb =
      //       inv.address?.Origin?.suburb ||
      //       (await getSuburbByLatLng(
      //         inv.address?.Origin?.coordinates?.lat,
      //         inv.address?.Origin?.coordinates?.lng
      //       ));
      //     const deliverySuburb =
      //       inv.address?.Destination?.suburb ||
      //       (await getSuburbByLatLng(
      //         inv.address?.Destination?.coordinates?.lat,
      //         inv.address?.Destination?.coordinates?.lng
      //       ));
      //     return {
      //       ...inv,
      //       pickupSuburb,
      //       deliverySuburb,
      //     };
      //   })
      // );
      // setInvoicesWithSuburbs(updatedInvoices);
    };

    fetchSuburbs();
  }, [invoice, hideAction]);

  const sortedInvoices = [...invoice].sort(
    (a, b) => b.createdAt.seconds - a.createdAt.seconds
  );

  const toCapitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const columns = [
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
      valueGetter: (value, row) =>
        row?.createdAt
          ? format(
              new Date(
                row.createdAt.seconds * 1000 +
                  row.createdAt.nanoseconds / 1000000
              ),
              "dd/MM/yyyy hh:mm a"
            )
          : "err",
    },
    { field: "userName", headerName: "Customer", width: 150 },
    {
      field: "pickupSuburb",
      headerName: "Pickup Suburb",
      width: 150,
      valueGetter: (value, row) =>
        row?.pickupSuburb || row?.address?.Origin?.address?.suburb,
    },
    {
      field: "deliverySuburb",
      headerName: "Delivery Suburb",
      width: 150,
      valueGetter: (value, row) =>
        row?.deliverySuburb || row?.address?.Destination?.address?.suburb,
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
          {toCapitalize(params.row?.currentStatus) || "Pending"}
        </Chip>
      ),
    },
    hideAction
      ? null
      : {
          field: "driverName",
          headerName: "Driver Name",
          width: 150,
          valueGetter: (value, row) => toCapitalize(row?.driverName) || "N/A",
        },
    hideAction
      ? null
      : {
          field: "payment",
          headerName: "Payment",
          valueGetter: (value, row) => row?.payment || "Manual",
          width: 80,
        },
    hideAction
      ? null
      : {
          field: "actions",
          headerName: "Actions",
          width: 400,
          renderCell: (params) => (
            <>
              <Tooltip label="Pick Status">
                <StatusDropdown booking={params.row} />
              </Tooltip>
              <Tooltip label="Edit Invoice">
                <EditInvoice id={params.row.docId || ""} />
              </Tooltip>
              <InvoicePOD id={params.row.docId || ""} />
              <DeleteInvoice id={params.row.docId} />
              <Tooltip label="Assign Driver">
                <Assigned booking={params.row || ""} />
              </Tooltip>
            </>
          ),
        },
  ];

  // Add unique identifiers to each row if not already present
  const rowsWithIds = sortedInvoices.map((row, index) => ({
    ...row,
    id: row.docId || index + 1,
  }));

  console.log(rowsWithIds[0]?.address?.Origin?.address);

  return (
    <div className="w-[95vw]  overflow-hidden flex justify-center">
      <div className="max-w-[95vw]">
        <DataGrid
          rows={rowsWithIds}
          columns={columns.filter((column) => column !== null)}
          pageSize={10}
          rowHeight={100}
          disableRowSelectionOnClick
          pagination={false}
          pageSizeOptions={[5, 10, 20, 50, 100]}
        />
      </div>
    </div>
  );
}

const invisibleLine =
  "‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ";
