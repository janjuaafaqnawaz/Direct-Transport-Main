"use client";
import { Text, Container, ThemeIcon, SimpleGrid } from "@mantine/core";
import classes from "./ClientServices.module.css";
import Link from "next/link";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import { logout } from "@/api/firebase/functions/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TrackBookingIcon from "@mui/icons-material/TrackChanges";
import JobInquiryIcon from "@mui/icons-material/Help";
import PriceJobIcon from "@mui/icons-material/MonetizationOn";
import AddressesIcon from "@mui/icons-material/LocationOn";
import InvoicesIcon from "@mui/icons-material/Receipt";
import { IconTruckDelivery } from "@tabler/icons-react";
import { Quote } from "lucide-react";

const clearSiteData = async () => {
  try {
    // Clear Cache Storage
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((cache) => caches.delete(cache)));
    }

    // Clear LocalStorage and SessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Clear IndexedDB
    if (window.indexedDB) {
      const databases = await indexedDB.databases();
      databases.forEach((db) => {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      });
    }
  } catch (err) {
    console.error("Error clearing site data:", err);
  }
};

export default function ClientServices() {
  const router = useRouter();
  const [userRole, setUserRole] = useState([]);

  useEffect(() => {
    try {
      const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
      const role = userDoc.role || null;
      setUserRole(role);
    } catch (error) {
      clearSiteData();
      console.log(error);
    }
  }, []);

  const logoutUser = async () => {
    await logout();
    router.push(`/Signin`);
  };

  const clientServicesLinks = [
    {
      title: "Price The Job",
      description: "Place a Booking",
      link: "/PriceTheJob",
      icon: <PriceJobIcon className="size-12" />,
    },
    {
      title: "Track Booking",
      description: "Track your recent bookings",
      link: "/TrackBooking",
      icon: <TrackBookingIcon className="size-10" />,
    },
    {
      title: "My Quotes",
      description: "Go to My Quotes",
      link: "/MyQuotes",
      icon: <Quote className="size-10" />,
    },
    userRole === "business" || userRole === "admin"
      ? {
          title: "Place Booking",
          description: "Place Booking",
          link: "/PlaceTheBooking",
          icon: <IconTruckDelivery className="size-10" />,
        }
      : {},
    {
      title: "Invoices",
      description: "View invoices",
      link: "/RecentInvoices",
      icon: <InvoicesIcon className="size-10" />,
    },
    {
      title: "Addresses",
      description: "Manage frequent addresses",
      link: "/FrequentAddresses",
      icon: <AddressesIcon className="size-10" />,
    },

    {
      title: "Logout",
      description: "Log Out",
      link: "#",
      icon: <LogoutIcon className="size-10" />,
      logout: true,
    },
    {
      title: "Job Inquiry",
      description: "Enquire on a specific booking",
      link: "/JobInquiry",
      icon: <JobInquiryIcon className="size-10" />,
    },
  ];

  const items = clientServicesLinks
    .filter((item) => Object.keys(item).length > 0)
    .map((item, index) => (
      <Link
        href={item?.link || "/"}
        key={index}
        onClick={() => (item?.logout ? logoutUser() : null)}
        passHref
        style={{ textDecoration: "none" }}
      >
        <div className={`${classes.item} ${classes.link}`}>
          <ThemeIcon
            variant="light"
            color="#1384e1"
            className={classes.itemIcon}
            size={70}
            radius="md"
          >
            {item?.icon}
          </ThemeIcon>

          <div>
            <Text
              fw={700}
              fz="lg"
              style={{ color: "black" }}
              className={classes.itemTitle}
            >
              {item?.title}
            </Text>
            <Text c="dimmed" size="sm">
              {item?.description}
            </Text>
          </div>
        </div>
      </Link>
    ));

  return (
    <Container size={700} className={classes.wrapper}>
      <Text className={classes.supTitle}>Client Services</Text>

      <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={50} mt={30}>
        {items}
      </SimpleGrid>
    </Container>
  );
}
