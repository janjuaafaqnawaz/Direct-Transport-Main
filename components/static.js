import TrackBookingIcon from "@mui/icons-material/TrackChanges";
import JobInquiryIcon from "@mui/icons-material/Help";
import PriceJobIcon from "@mui/icons-material/MonetizationOn";
import AddressesIcon from "@mui/icons-material/LocationOn";
import InvoicesIcon from "@mui/icons-material/Receipt";
import { getFormattedDateStr } from "@/api/DateAndTime/index";
import { formattedDateCurrent } from "@/api/DateAndTime/format";

const clientServiceslinks = [
  {
    title: "Price The Job",
    description: "Place a Booking",
    link: "/PriceTheJob",
    icon: <PriceJobIcon />,
  },
  {
    title: "Track Booking",
    description: "Track your recent bookings",
    link: "/TrackBooking",
    icon: <TrackBookingIcon />,
  },
  {
    title: "Job Inquiry",
    description: "Enquire on a specific booking",
    link: "/JobInquiry",
    icon: <JobInquiryIcon />,
  },

  {
    title: "Addresses",
    description: "Manage frequent addresses",
    link: "/FrequentAddresses",
    icon: <AddressesIcon />,
  },
  {
    title: "Invoices",
    description: "View invoices",
    link: "/RecentInvoices",
    icon: <InvoicesIcon />,
  },
];

const getServiceDescription = (service) => {
  const currentHour = new Date().getHours();
  switch (service) {
    case "Standard":
      return currentHour >= 13
        ? "4 - 6hrs completion time"
        : "Not allowed for same day delivery booked after 1pm.";
    case "Express":
      return currentHour >= 14
        ? "2-3hrs time frame"
        : "Not allowed for same day delivery booked after 2pm.";
    case "Direct":
      return "Pickup and deliver ASAP.";
    default:
      return "";
  }
};
const getServiceOptions = (bookingDateStr, bookingTimeStr) => {
  // console.log(bookingDateStr, bookingTimeStr, today.toDateString(),6+64);
  let serviceOptions = [
    { value: "Standard", disc: getServiceDescription("Standard") },
    { value: "Express", disc: getServiceDescription("Express") },
    { value: "Direct", disc: getServiceDescription("Direct") },
  ];

  // Parse booking date and time
  const dateParts = bookingDateStr?.split("/");
  const timeParts = bookingTimeStr?.split(":");

  if (!dateParts || !timeParts) {
    console.error("Invalid date or time format", dateParts, timeParts);
    return serviceOptions;
  }

  const [day, month, year] = dateParts.map(Number);
  const [hours, minutes] = timeParts.map(Number);

  const bookingDate = new Date(year, month - 1, day, hours, minutes);
  const bookingHour = bookingDate.getHours();

  const isSameDay = bookingDate.toDateString() === getFormattedDateStr();

  if (isSameDay) {
    if (bookingHour >= 13) {
      // If booking hour is 13:00 or later, remove the "Standard" option
      serviceOptions = serviceOptions.filter(
        (option) => option.value !== "Standard"
      );
    }
    if (bookingHour >= 14) {
      // If booking hour is 14:00 or later, lock the "Express" option
      serviceOptions = serviceOptions.filter(
        (option) => option.value !== "Standard"
      );
      serviceOptions = serviceOptions.filter(
        (option) => option.value !== "Express"
      );
    }
  }

  return serviceOptions;
};

// // Test the function
// console.log(getServiceOptions("31/05/2024", "04:52"));

// console.log(getServiceOptions());

const serviceOptions = [
  {
    value: "Standard",
    disc: "4 - 6hrs completion time",
    disc2: "Service Not Available After 3pm",
  },
  {
    value: "Express",
    disc: "2-3hrs time frame",
    disc2: "Not available after 4pm",
  },
  {
    value: "Direct",
    disc: "Pickup and deliver ASAP.",
    disc2: "Deliveries between 7am - 5pm",
  },
  {
    value: "After Hours",
    disc: "Deliveries between 5pm - 7am",
    disc2: "",
  },
  {
    value: "Weekend Deliveries",
    disc: "Weekend work",
    disc2: "",
  },
];

const suburbOption = [
  { value: "Suburb 1" },
  { value: "Suburb 2" },
  { value: "Suburb 3" },
];

const adminPages = [
  { link: "/ClientServices", label: "Client Services" },
  { link: "/PlaceTheBooking", label: "Place Booking" },
  { link: "/admin/Manage/Bookings", label: "Bookings" },
  { link: "/admin/Settings/Same-Day", label: "Same Day" },
  { link: "/admin/Settings/Next-Day", label: "Next Day" },
  { link: "/admin/Manage/Users", label: "Users" },
  { link: "/admin/Manage/Drivers", label: "Drivers" },
  { link: "/MonthlyInvoices", label: "Monthly Invoices" },
  { link: "/admin/Settings/Regional", label: "Regional" },
];

const userPages = [
  { link: "/PriceTheJob", label: "Price A Job" },
  { link: "/ClientServices", label: "Client Services" },
  { link: "/FrequentAddresses", label: "Frequent Addresses" },
  { link: "/RecentInvoices", label: "Recent Invoices" },
];

const businessPages = [
  { link: "/ClientServices", label: "Client Services" },
  { link: "/PlaceTheBooking", label: "Place Booking" },
  { link: "/PriceTheJob", label: "Price A Job" },
  { link: "/FrequentAddresses", label: "Frequent Addresses" },
  { link: "/RecentInvoices", label: "Recent Invoices" },
];

const authPages = [
  { link: "/Signin", label: "Sign In" },
  { link:"https://directtransport.com.au/account-opening/", label: "Sign Up" },
];

const statuses = [
  { val: "allocated", status: "Allocated" },
  { val: "pickedup", status: "Picked Up" },
  { val: "delivered", status: "Delivered" },
  { val: "returned", status: "Returned" },
  { val: "cancelled", status: "Cancelled" },
  { val: "Arrived At Drop", status: "Arrived at drop" },
  { val: "Arrived At Pickup", status: "Arrived at pickup" },
];

const goodsDescriptionOption = [
  { value: "Aluminum" },
  { value: "Bags" },
  { value: "Box" },
  { value: "Coil" },
  { value: "Conduit" },
  { value: "Crate" },
  { value: "Drum" },
  { value: "Envelope" },
  { value: "Hoses" },
  { value: "Ladder" },
  { value: "Pail" },
  { value: "Pallet" },
  { value: "Pipes" },
  { value: "Rack" },
  { value: "Rolls" },
  { value: "Satchel" },
  { value: "Skid" },
  { value: "Steel" },
  { value: "Timber" },
  { value: "Tubes" },
  { value: "Tyres" },
];

const initialFormData = {
  contact: "",
  email: "",
  service: "Standard",
  date: formattedDateCurrent,
  time: "12:00 AM",
  dropReference1: "",
  pickupReference1: "",
  items: [],
  distanceData: {},
  address: {
    Origin: {},
    Destination: {},
  },
  deliveryIns: "",
  internalReference: "",
  pickupCompanyName: "",
  dropCompanyName: "",
};

export {
  adminPages,
  userPages,
  authPages,
  getServiceOptions,
  clientServiceslinks,
  suburbOption,
  statuses,
  businessPages,
  goodsDescriptionOption,
  serviceOptions,
  initialFormData,
};
