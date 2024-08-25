export default function transformDataToTableFormat(invoices) {
  console.log(invoices);

  const transformedData = invoices.map((invoice) => {
    const { date, docId, address, service, totalPrice } = invoice;

    // Helper function to restrict string length
    const restrictLength = (str, maxLength) => str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

    const originLabel = restrictLength(address?.Origin?.label || "N/A", 10);
    const destinationLabel = restrictLength(address?.Destination?.label || "N/A", 10);

    return [
      date || "N/A",
      docId || "N/A",
      originLabel,
      destinationLabel,
      service || "N/A",
      `$${totalPrice || 0}`,
      `$${invoice.totalTollsCost || 0}`,
      `$${invoice.unloading || 0}`,
      `$${(invoice.gst || 0).toFixed(2)}`,
      `${(
        Number(totalPrice ?? 0) +
        Number(invoice?.totalTollsCost ?? 0) +
        Number(invoice?.gst ?? 0)
      ).toFixed(2)}`,
    ];
  });

  return transformedData;
}
