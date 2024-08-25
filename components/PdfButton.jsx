"use client";

import Button from "@/components/PDF/Button";

const PdfButton = ({ invoice }) => {
  return (
    <>
      <Button booking={invoice} />
    </>
  );
};

export default PdfButton;
