"use client";

import { useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { RowsWithIds, Columns } from "./Columns";
import { Box } from "@mui/material";

export default function ManageInvoices({ isArchived, hideAction, invoice }) {
  const rowsWithIds = useMemo(() => RowsWithIds({ invoice }), [invoice]);
  const columns = useMemo(
    () => Columns({ isArchived, hideAction }),
    [isArchived, hideAction]
  );

  return (
    <Box sx={{ width: '96vw', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ maxWidth: '96vw', overflow: 'hidden' }}>
        <DataGrid
          rows={rowsWithIds}
          columns={columns.filter(
            (column) => column !== null && column !== undefined
          )}
          pageSize={50}
          rowHeight={70}
          pagination={false}
          disableRowSelectionOnClick
          components={{
            VirtualScroller: true,
          }}
          sx={{
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: "#f5f5f5",
              color: "#333",
              padding: "16px",
              fontSize: "1rem",
              fontWeight: "bold",
              borderTop: "1px solid #ddd",
              display: "flex",
              justifyContent: "center",
            },
            "& .MuiDataGrid-pagination .MuiButtonBase-root": {
              backgroundColor: "#007bff",     // Button background color
              color: "#fff",                  // Button text color
              fontWeight: "bold",             // Bold text
              borderRadius: "4px",            // Rounded corners
              padding: "6px 12px",            // Padding for larger button size
              margin: "0 8px",                // Space between buttons
              "&:hover": {
                backgroundColor: "#0056b3",   // Darker blue on hover
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}
