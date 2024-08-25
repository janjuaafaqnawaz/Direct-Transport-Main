export default function getTotalInvoicePrice(invoices) {
  // Assuming invoices is an array of objects with a 'price' property
  const totalPrice = invoices.reduce((accumulator, invoice) => {
    return accumulator + parseInt(invoice.totalPrice);
  }, 0);
  const totalGst = invoices.reduce((accumulator, invoice) => {
    return accumulator + invoice.gst;
  }, 0);
  const totalTolls = invoices.reduce((accumulator, invoice) => {
    return accumulator + invoice.totalTollsCost || 0;
  }, 0);
  const totalUnloading = invoices.reduce((accumulator, invoice) => {
    return accumulator + invoice.unloading || 0;
  }, 0);
  console.log({ totalPrice, totalGst, totalTolls, totalUnloading });

  return {
    totalPrice: totalPrice.toFixed(2),
    totalGst: totalGst.toFixed(2),
    totalTolls: totalTolls.toFixed(2),
    totalUnloading: totalUnloading.toFixed(2),
  };
}
