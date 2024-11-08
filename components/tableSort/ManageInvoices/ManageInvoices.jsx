"use client";

import { useState, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { RowsWithIds, Columns } from "./Columns";
import { Pagination } from "@nextui-org/react";

export default function ManageInvoices({ isArchived, hideAction, invoice }) {
  const rowsWithIds = useMemo(() => RowsWithIds({ invoice }), [invoice]);
  const columns = useMemo(
    () => Columns({ isArchived, hideAction }),
    [isArchived, hideAction]
  );

  const [page, setPage] = useState(1);
  const pageSize = 50;

  const paginatedRows = rowsWithIds.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalBookings = rowsWithIds.length;
  const startBooking = (page - 1) * pageSize + 1;
  const endBooking = Math.min(page * pageSize, totalBookings);

  return (
    <div className="w-[96vw] overflow-hidden flex flex-col items-center">
      <div className="text-center mb-4">
        <p>Total Bookings: {totalBookings}</p>
        <p>
          Showing bookings {startBooking} - {endBooking}
        </p>
      </div>

      <div className="max-w-[96vw]  overflow-hidden">
        <DataGrid
          rows={paginatedRows}
          columns={columns.filter(
            (column) => column !== null && column !== undefined
          )}
          pageSize={pageSize}
          rowHeight={70}
          pagination={false}
          disableRowSelectionOnClick
          hideFooter // Hides the default footer completely
          components={{
            VirtualScroller: true,
          }}
        />
      </div>

      <Pagination
        initialPage={1}
        showControls
        page={page}
        onChange={setPage}
        total={Math.ceil(totalBookings / pageSize)}
        withControls
        position="center"
        className="mt-4"
        variant="faded"
      />
    </div>
  );
}
