export default async function GstCharges(price, gst) {
  let gst_charges;
  gst_charges = (price * gst) / 100;

  return gst_charges;
}
