import React, { useState } from "react";
import ManageInvoices from "@/components/tableSort/ManageInvoices/ManageInvoices";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

export default function TodayBookings({ invoice }) {
  const [activeFilteredTab, setActiveFilteredTab] = useState("todaysBookings");

  // Function to filter invoices based on the active tab
  const filterInvoices = () => {
    if (activeFilteredTab === "Active") {
      return invoice.filter((item) => !item.driverName);
    }
    if (activeFilteredTab === "Allocated") {
      return invoice.filter(
        (item) =>
          item.driverName &&
          item.currentStatus !== "delivered" &&
          item.currentStatus !== "returned"
      );
    }
    if (activeFilteredTab === "Completed") {
      return invoice.filter(
        (item) =>
          item?.currentStatus === "delivered" ||
          item?.currentStatus === "returned"
      );
    }
    return invoice;
  };

  const filteredInvoices = filterInvoices();

  return (
    <div>
      <Tabs
        aria-label="Booking tabs"
        color="primary"
        selectedKey={activeFilteredTab}
        onSelectionChange={setActiveFilteredTab}
        className="max-w-[97vw] ml-[1.3vw]"
        fullWidth
      >
        <Tab key="Active" title="Active" />
        <Tab key="Allocated" title="Allocated" />
        <Tab key="Completed" title="Completed" />
      </Tabs>
      <Card>
        <CardBody>
          <ManageInvoices
            isVisibleReadyDate={true}
            invoice={filteredInvoices}
            title={"Booking"}
          />
        </CardBody>
      </Card>
    </div>
  );
}
