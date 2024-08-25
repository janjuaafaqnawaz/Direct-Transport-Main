"use client";

import { useEffect, useState } from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import headerImg from "../../../../../public/pdf_header2.jpg";
import transformDataToTableFormat from "./transformDataToTableFormat";
import PdFooter from "./footer";
import { Center } from "@mantine/core";
import { getPreviousMonthDates } from "@/api/DateAndTime";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PdfButton = ({ invoices }) => {
  const [imageDataUrl, setImageDataUrl] = useState("");

  const tableData = transformDataToTableFormat(invoices);

  const { startDateStr, endDateStr } = getPreviousMonthDates();
  const { totalPrice, totalGst } = getTotalInvoicePrice();

  function getTotalInvoicePrice() {
    // Assuming invoices is an array of objects with a 'price' property
    const totalPrice = invoices.reduce((accumulator, invoice) => {
      return accumulator + parseInt(invoice.totalPrice);
    }, 0);
    const totalGst = invoices.reduce((accumulator, invoice) => {
      return accumulator + invoice.gst;
    }, 0);

    return { totalPrice: totalPrice.toFixed(2), totalGst: totalGst.toFixed(2) };
  }

  const pdfContent = {
    header: {
      columns: [
        { image: imageDataUrl, width: 150 },
        {
          stack: [
            `Company Name: ${invoices[0]?.userName || "No Company Name"}`,
            `Date of issue: ${startDateStr || "No Start Date"}`,
            `Time period: ${startDateStr || "No Start Date"} - ${
              endDateStr || "No End Date"
            }`,
          ],
          fontSize: 10,
          margin: [250, 10, 0, 0],
          // height:
        },
      ],
    },

    content: [
      // Content
      {
        table: {
          headerRows: 1,
          widths: Array(10).fill("auto"),
          body: [
            [
              "DATE",
              "JOB NO",
              "FROM",
              "TO",
              "SERV",
              "COST",
              "TOLLS",
              "Wait/unload",
              "GST",
              "TOTAL",
            ],
            ...tableData.map((row) =>
              row.map((cell) => ({ text: cell, style: "tableCell" }))
            ),
          ],
        },
        margin: [0, 30, 0, 0],
        layout: "lightHorizontalLines",
        fontSize: 10,
      },

      "Price:",
      {
        ul: [`Price Excluding GST: ${totalPrice}`],
        margin: [350, 30, 0, 0],
      },

      // Footer
      // eslint-disable-next-line react/jsx-key
      PdFooter({ user: invoices[0] }),
    ],
    styles: {
      tableCell: {
        fontSize: 10,
      },
      heading: {
        bold: true,
        fontSize: 14,
      },
      para: {
        fontSize: 8,
      },
      info_heading: {
        fontSize: 8,
        bold: true,
      },
      info_heading2: {
        fontSize: 12,
        bold: true,
      },
      info_para: {
        fontSize: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      },
    },
    // pageSize: 'A5',
    pageMargins: [40, 60, 40, 60],
  };

  useEffect(() => {
    const createPdf = async () => {
      const response = await fetch(headerImg.src);
      const blob = await response.blob();

      const imageDataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      setImageDataUrl(imageDataUrl);
    };
    createPdf();
  }, []);

  useEffect(() => {
    createPdf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageDataUrl]);

  const createPdf = () => {
    const pdfGenerator = pdfMake.createPdf(pdfContent);
    pdfGenerator.download();
  };

  return (
    <Center h={300}>
      <button
        onClick={createPdf}
        style={{
          backgroundColor: "#4CAF50",
          border: "none",
          color: "white",
          padding: "10px 20px",
          textAlign: "center",
          textDecoration: "none",
          display: "inline-block",
          fontSize: "16px",
          margin: "4px 2px",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        If your download did not start automatically, click here to download
      </button>
    </Center>
  );
};

export default PdfButton;
