import { format } from "date-fns";

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

export const calculateInvoiceDetails = (invoices, user) => {
  const { totalPriceWithGST, totalGst } = getTotalInvoicePrice(invoices);

  const paymentPercentage = Number(user?.paymentPercentage) || 1;
  const useGst = user?.includeGst;
  const totalFinalPayment = useGst
    ? Number(totalPriceWithGST)
    : Number(totalPriceWithGST) - Number(totalGst);

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const bookingsByDate = invoices.reduce((acc, booking) => {
    const formattedDate = format(parseDate(booking.date), "dd/MM/yyyy");
    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }
    acc[formattedDate].push(booking);
    return acc;
  }, {});

  const calcDayPayment = (bookings) => {
    let totalWithGst = 0;
    let totalWithoutGst = 0;

    bookings.forEach((booking) => {
      totalWithGst += booking.totalPriceWithGST;
      totalWithoutGst += booking.totalPriceWithGST - booking.gst;
    });

    return (
      ((useGst ? totalWithGst : totalWithoutGst || 0) / 100) *
      paymentPercentage
    ).toFixed(2);
  };

  // Sort the dates in ascending order
  const sortedDates = Object.keys(bookingsByDate).sort(
    (a, b) => parseDate(b) - parseDate(a)
  );

  const finalDriverPay = (
    ((totalFinalPayment || 0) / 100) *
    paymentPercentage
  ).toFixed(2);

  return {
    totalPriceWithGST,
    totalGst,
    totalFinalPayment,
    sortedDates,
    bookingsByDate,
    calcDayPayment,
    finalDriverPay,
  };
};
