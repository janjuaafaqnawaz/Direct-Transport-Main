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

const Navbar = () => {
  const router = useRouter();
  const [userPagesToRender, setUserPagesToRender] = useState([]);
  const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
  const role = userDoc.role || null;

  useEffect(() => {
    const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
    const role = userDoc.role || null;
    const pages = {
      admin: adminPages,
      business: businessPages,
      user: userPages,
      auth: authPages,
    };
    setUserPagesToRender(pages[role] || authPages);
  }, []);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <Link href={userPagesToRender ? "http://courierssydney.com.au" : "/"}>
        <Image
          src={
            "https://courierssydney.com.au/wp-content/uploads/2023/11/Direct-Transport-Solutions-2.png"
          }
          alt="logo"
          width={150}
          height={150}
          style={{ width: "80%", height: "auto" }}
        />
      </Link>
      <Hidden mdDown>
        <ButtonsSection role={role} userPagesToRender={userPagesToRender} />
      </Hidden>
      <Hidden mdUp>
        <MenuSection role={role} userPagesToRender={userPagesToRender} />
      </Hidden>
    </nav>
  );
};

export default Navbar;

const ButtonsSection = ({ userPagesToRender, role }) => (
  <div>
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
      {role === "admin" ? <Reports /> : null}
    </ButtonGroup>
  </div>
);

const MenuSection = ({ userPagesToRender }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
          <Link style={{ textDecoration: "none" }} key={ind} href={val.link}>
            <MenuItem style={{ color: "grey" }} onClick={handleMenuClose}>
              {val.label}
            </MenuItem>
          </Link>
        ))}
      </Menu>
    </>
  );
};
