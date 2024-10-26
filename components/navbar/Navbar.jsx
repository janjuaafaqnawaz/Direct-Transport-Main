"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminPages, authPages, businessPages, userPages } from "../static";
import { Hidden, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Reports from "./Reports";
import { Button, ButtonGroup } from "@mantine/core";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/api/firebase/functions/auth";

const Navbar = () => {
  const router = useRouter();
  const [userPagesToRender, setUserPagesToRender] = useState([]);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndSetData = async () => {
      try {
        const user = await fetchUserData();
        const userRole = user?.role || "auth";
        setRole(userRole);

        const pages = {
          admin: adminPages,
          business: businessPages,
          user: userPages,
          auth: authPages,
        };

        setUserPagesToRender(pages[userRole] || authPages);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndSetData();
  }, []);

  if (loading) return null; // Avoid rendering Navbar until loading is complete

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 20,
      }}
      className="navbar"
    >
      <Link href="http://courierssydney.com.au">
        <Image
          src="https://courierssydney.com.au/wp-content/uploads/2023/11/Direct-Transport-Solutions-2.png"
          alt="logo"
          width={150}
          height={150}
          className="logo"
        />
      </Link>
      <Hidden mdDown>
        <ButtonsSection
          router={router}
          userPagesToRender={userPagesToRender}
          role={role}
        />
      </Hidden>
      <Hidden mdUp>
        <MenuSection router={router} userPagesToRender={userPagesToRender} />
      </Hidden>
    </nav>
  );
};

export default Navbar;

const ButtonsSection = ({ userPagesToRender, router, role }) => (
  <ButtonGroup className="gap-[2px]">
    {userPagesToRender.map((val, ind) => (
      <Button
        key={ind}
        onClick={() => router.push(val.link)}
        variant="light"
        color="#1384e1"
      >
        {val.label}
      </Button>
    ))}
    {role === "admin" && <Reports />}
  </ButtonGroup>
);

const MenuSection = ({ userPagesToRender }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <>
      <Button variant="light" color="#1384e1" onClick={handleMenuOpen}>
        <MenuIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {userPagesToRender.map((val, ind) => (
          <Link key={ind} href={val.link} passHref>
            <MenuItem onClick={handleMenuClose} style={{ color: "grey" }}>
              {val.label}
            </MenuItem>
          </Link>
        ))}
      </Menu>
    </>
  );
};
