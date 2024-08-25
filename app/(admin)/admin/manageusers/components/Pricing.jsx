"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Switch,
} from "@nextui-org/react";
import PriceSettings from "@/components/PriceSettings";
import { useState, useEffect } from "react";
import { updateDoc } from "@/api/firebase/functions/upload";

export default function CustomPrice({ user }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [priceSettings, setPriceSettings] = useState(
    user?.CustomPrice || {
      gst: {
        GST: 10,
      },
      minWaitTime: {
        minWaitTimeRate: 0.75,
      },
      minServices: {
        HT: "20",
        "1T": "30",
        Courier: "10",
        "2T": "90",
      },
      services: {
        "2T": "90",
        "1T": "1.80",
        HT: "1.20",
        Courier: "0.90",
      },
      truckServices: {
        "12T": "160",
        "6T": "130",
        "2T": "90",
        "8T": "140",
        "4T": "120",
        "1T": "2",
      },
    }
  );
  const [usePrice, setUsePrice] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsePrice(user.usePrice);
    }
  }, [user]);

  console.log(usePrice);

  const handleSave = async () => {
    setLoading(true);
    const updatedUser = {
      ...user,
      priceSettings,
      usePrice,
    };
    try {
      await updateDoc("users", user.email, updatedUser);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save settings", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-1"></div>
      <Button color="primary" className="h-9 rounded-md" onPress={onOpen}>
        Rates
      </Button>
      <Modal
        size="full"
        scrollBehavior="outside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="h-max"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="w-full flex justify-between items-center">
                  <h2>Custom Price</h2>
                  {/* <Switch isSelected={usePrice} onValueChange={setUsePrice} /> */}
                </div>
              </ModalHeader>
              <ModalBody>
                <PriceSettings
                  priceSettings={priceSettings}
                  setPriceSettings={setPriceSettings}
                >
                  <div className="mr-auto ">
                    <Button
                      color="danger"
                      onPress={onClose}
                      className="mx-2"
                      disabled={loading}
                    >
                      Close
                    </Button>
                    <Button
                      className="mx-2"
                      color="primary"
                      onPress={handleSave}
                      isLoading={loading}
                    >
                      Save
                    </Button>
                  </div>
                </PriceSettings>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
