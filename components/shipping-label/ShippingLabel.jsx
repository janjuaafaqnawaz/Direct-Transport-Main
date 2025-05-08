/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ShippingLabel({
  shipTo,
  from,
  orderId,
  weight,
  dimensions,
  shippingDate,
  remarks = "NO REMARKS",
}) {
  const [paperSize, setPaperSize] = useState("A4");
  const labelRef = useRef(null);

  const generatePDF = async () => {
    // Dynamically import to reduce bundle size
    const { jsPDF } = await import("jspdf");

    if (!labelRef.current) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: paperSize,
    });

    // Get the content to be converted to PDF
    const content = labelRef.current;

    // Use html2canvas to capture the content
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 dimensions: 210 x 297 mm
    // A6 dimensions: 105 x 148 mm
    const width = paperSize === "A4" ? 210 : 105;
    const height = paperSize === "A4" ? 297 : 148;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`shipping-label-${orderId}.pdf`);
  };

  const handlePrint = () => {
    const printContents = labelRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl  font-bold">Shipping Label Preview</h2>
        <div className="flex items-center gap-4">
          <Button
            className={paperSize === "A4" && "bg-green-400 hover:bg-green-500"}
            onClick={() => setPaperSize("A4")}
          >
            A4
          </Button>
          <Button
            className={paperSize === "A6" && "bg-green-400 hover:bg-green-500"}
            onClick={() => setPaperSize("A6")}
          >
            A6
          </Button>
          {/* <Button>Selected: {paperSize}</Button> */}
          <Button onClick={generatePDF}>Export PDF</Button>
          <Button onClick={handlePrint}>Print</Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div
          ref={labelRef}
          className={`bg-white border-2 border-black rounded-md overflow-hidden ${
            paperSize === "A4"
              ? "w-full aspect-[210/297]"
              : "w-full max-w-md mx-auto aspect-[105/148]"
          }`}
        >
          <div>
            <img
              src={"/dts-logo.png"}
              alt="logo"
              style={{ width: "40%", height: "auto" }}
              className="mx-auto my-4 mb-2"
            />
            <div className="grid grid-cols-2 h-full border-b-2 border-t-2 border-black">
              {/* Ship To Section */}
              <div className="p-4 border-r-2 border-black">
                <div className="inline-block bg-black text-white px-3 py-1 font-bold mb-3">
                  SHIP TO:
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-lg">{shipTo.name}</p>
                  <p>{shipTo.address1},</p>
                  {shipTo.address2 && <p>{shipTo.address2},</p>}
                  <p>
                    {shipTo.city}, {shipTo.postalCode}, {shipTo.country}
                  </p>
                </div>
              </div>

              {/* From Section */}
              <div className="p-4">
                <div className="text-gray-700 font-bold mb-3">FROM:</div>
                <div className="space-y-1">
                  <p className="font-medium">{from.name}</p>
                  <p>{from.address1},</p>
                  {from.address2 && <p>{from.address2},</p>}
                  <p>
                    {from.city}, {from.postalCode}, {from.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="grid grid-cols-2 h-auto">
              <div className="flex flex-col">
                <div className="p-3 border-r-2 border-b-2 border-black">
                  <span className="font-bold text-gray-700">ORDER ID:</span>
                  <span className="float-right">{orderId}</span>
                </div>
                <div className="p-3 border-r-2 border-b-2 border-black">
                  <span className="font-bold text-gray-700">WEIGHT:</span>
                  <span className="float-right">{weight}</span>
                </div>
                <div className="p-3 border-r-2 border-b-2 border-black">
                  <span className="font-bold text-gray-700">DIMENSIONS:</span>
                  <span className="float-right">{dimensions}</span>
                </div>
                <div className="p-3 border-r-2 border-b-2  border-black">
                  <span className="font-bold text-gray-700">
                    SHIPPING DATE:
                  </span>
                  <span className="float-right">{shippingDate}</span>
                </div>
              </div>
              {/* Remarks Section */}
              <div className="p-4 flex flex-col">
                <div className="font-bold text-gray-700 mb-2">REMARKS:</div>
                <div>{remarks}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
