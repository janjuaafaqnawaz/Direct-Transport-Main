"use client";

import { useState } from "react";
import { PlacesAutocomplete } from "@/components/Index";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SelectMultipleAddresses({
  value = [],
  handleAddresses,
  removeAddress,
}) {
  const [currentAddress, setCurrentAddress] = useState(null);

  const handleAddressSelect = (location) => {
    if (location?.label) {
      setCurrentAddress(location);
    }
  };

  const handleAddAddress = () => {
    if (
      currentAddress &&
      !value.some((addr) => addr.label === currentAddress.label)
    ) {
      handleAddresses([...value, currentAddress]);
      setCurrentAddress(null); // Reset input after adding
    }
  };

  return (
    <div className="mb-6 w-full">
      <div>
        <p className="text-sm font-medium">Select Multiple Addresses</p>
        <div className="flex items-center">
          <div className="flex-1">
            <PlacesAutocomplete onLocationSelect={handleAddressSelect} />
          </div>
          <Button
            onClick={handleAddAddress}
            disabled={!currentAddress}
            className="ml-2 mt-2"
          >
            Add
          </Button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="space-y-1 w-full">
          <div className="flex flex-col space-y-1 w-full">
            {value.map((address, index) => (
              <Badge
                key={index}
                className="flex w-full items-center gap-1 py-2 px-3 bg-gray-200 text-black"
              >
                <span className="text-sm">
                  ({index + 1}) {address.label}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 ml-auto w-4 p-0 hover:bg-transparent"
                  onClick={() => removeAddress(address.label)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove</span>
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
