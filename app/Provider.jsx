"use client";

import { MantineProvider } from "@mantine/core";
import { NextUIProvider } from "@nextui-org/react";
import NextTopLoader from "nextjs-toploader";
import { PhotoProvider } from "react-photo-view";
import { ToastContainer } from "react-toastify";

import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "react-photo-view/dist/react-photo-view.css";
import "./globals.css";

export default function Providers({ children }) {
  return (
    <NextUIProvider>
      <MantineProvider>
        <PhotoProvider>
          {children}
          <NextTopLoader color="#1383e1" />
        </PhotoProvider>
        <ToastContainer />
      </MantineProvider>
    </NextUIProvider>
  );
}
