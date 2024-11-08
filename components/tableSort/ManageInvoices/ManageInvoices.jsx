"use client";

import { DataGrid } from "@mui/x-data-grid";
import { RowsWithIds, Columns } from "./Columns";

export default function ManageInvoices({ isArchived, hideAction, invoice }) {
  const rowsWithIds = RowsWithIds({ invoice });
  const columns = Columns({ isArchived, hideAction });

  return (
    <div className="w-[95vw]  overflow-hidden flex justify-center">
      <div className="max-w-[95vw]">
        <DataGrid
          rows={rowsWithIds}
          columns={columns.filter((column) => column !== null)}
          pageSize={10}
          rowHeight={100}
          pagination={false}
          disableRowSelectionOnClick
          pageSizeOptions={[100]}
        />
      </div>
    </div>
  );
}
