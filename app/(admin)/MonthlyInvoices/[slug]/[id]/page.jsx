import React from "react";
import PDFDetails from "../../components/PDFDetails/PDFDetails";

export default function page(params) {
  const email = decodeURIComponent(params.params.id);
  return (
    <div>
      <PDFDetails email={email} />
    </div>
  );
}
