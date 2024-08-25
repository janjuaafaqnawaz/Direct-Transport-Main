"use client";
import { fetchMyPdfsOfDoc } from "@/api/firebase/functions/fetch";
import { deleteDocument } from "@/api/firebase/functions/upload";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function History({ email }) {
  const [pdfs, setPdfs] = useState([]);

  useEffect(() => {
    const get = async () => {
      const pdfs = await fetchMyPdfsOfDoc(email);
      setPdfs(pdfs);
      console.log(pdfs);
    };
    get();
  }, []);

  const deletePdf = async (docId) => {
    await deleteDocument("generatedPdfs", docId);
    alert("PDF deleted successfully!");
  };

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Email</TableColumn>
        <TableColumn>Issue</TableColumn>
        <TableColumn>Dates</TableColumn>
        <TableColumn>Download</TableColumn>
        <TableColumn>Delete</TableColumn>
      </TableHeader>
      <TableBody emptyContent={"No rows to display."}>
        {pdfs.length > 0 &&
          pdfs.map((pdf, ind) => {
            return (
                <TableRow key={ind}>
                  
                <TableCell>{pdf?.firstName || pdf?.email}</TableCell>
                <TableCell>
                  {format(pdf.createdAt.toDate(), "dd/MM/yyyy HH:mm:ss")}
                </TableCell>
                <TableCell>
                  {pdf.datesRange.start + "-" + pdf.datesRange.end}
                </TableCell>
                <TableCell>
                  <a target="_blank" href={pdf.url} download>
                    View
                  </a>
                </TableCell>
                <TableCell className="cursor-pointer">
                  <p onClick={() => deletePdf(pdf.id)}>🗑️</p>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
