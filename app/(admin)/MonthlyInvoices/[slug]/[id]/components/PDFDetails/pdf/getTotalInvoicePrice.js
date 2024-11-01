export default function getTotalInvoicePrice(invoices) {
  // Assuming invoices is an array of objects with a 'price' property
  const totalPrice = invoices.reduce((accumulator, invoice) => {
    return accumulator + parseInt(invoice.totalPrice);
  }, 0);
  const totalGst = invoices.reduce((accumulator, invoice) => {
    return accumulator + invoice.gst;
  }, 0);
  const totalTolls = invoices.reduce((accumulator, invoice) => {
    return accumulator + Number(invoice.totalTollsCost || 0) || 0;
  }, 0);
  const totalUnloading = invoices.reduce((accumulator, invoice) => {
    return accumulator + invoice.unloading || 0;
  }, 0);

  const totalPriceWithGST = invoices.reduce((accumulator, invoice) => {
    return accumulator + invoice.totalPriceWithGST || 0;
  }, 0);

  return {
    totalPrice: totalPrice.toFixed(2),
    totalGst: totalGst.toFixed(2),
    totalTolls: Number(totalTolls).toFixed(2),
    totalUnloading: totalUnloading.toFixed(2),
    totalPriceWithGST: totalPriceWithGST.toFixed(2),
  };
}
