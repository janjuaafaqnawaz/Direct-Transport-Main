import "./form.css";

import { useState } from "react";
import { Alert } from "@mantine/core";
import { Chip } from "@nextui-org/react";
import { ErrorOutline } from "@mui/icons-material";
import { PlacesAutocomplete } from "@/components/Index";

import CustomInput from "@/components/fields/CustomInput";
import FrequentAddress from "@/components/fields/FrequentAddress";
import SelectMultipleAddresses from "@/components/select-address/SelectMultipleAddresses";

export default function AddressesSection({
  user,
  edit,
  locationsError,
  formData,
  setFormData,
  handleChange,
  handle_address,
  showFrequentOrigins,
  setShowFrequentOrigins,
  showFrequentDestinations,
  setShowFrequentDestinations,
}) {
  const [showMultipleAddresses, setShowMultipleAddresses] = useState(false);

  const toggleMultipleAddresses = () => {
    setShowMultipleAddresses((prev) => !prev);
  };

  const toggleChip = () => (
    <Chip
      className="rounded-md"
      color="primary"
      onClick={toggleMultipleAddresses}
    >
      {showMultipleAddresses ? "Single Address" : "Multiple Addresses"}
    </Chip>
  );

  const handleMultipleAddresses = (address, type) => {
    console.log(address, type);
    
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        Origin: {},
        Destination: {},
        [`Multiple${type}`]: address,
      },
    });
  };

  return (
    <>
      <div className="box">
        <h3>Pickup Details</h3>
        {toggleChip()}
        {locationsError && (
          <Alert icon={<ErrorOutline />} className="w-full">
            Please enter valid location
          </Alert>
        )}
        <CustomInput
          name="pickupCompanyName"
          label="Company Name"
          value={formData.pickupCompanyName}
          handleChange={handleChange}
        />

        {!showMultipleAddresses ? (
          <>
            <FrequentAddress
              address={formData.address.Origin}
              handleChange={(e) => handle_address("Origin", e)}
              show={() => setShowFrequentOrigins(false)}
              visible={edit}
            />
            {edit && showFrequentOrigins ? (
              <PlacesAutocomplete
                onLocationSelect={(e) => handle_address("Origin", e, true)}
                address={formData.address.Origin}
                pickup={true}
                handleCheckboxChange={(e) =>
                  setFormData({
                    ...formData,
                    savePickAddress: e.target.checked,
                  })
                }
                checkbox={formData.savePickAddress}
                saveOption={true}
              />
            ) : (
              <CustomInput
                value={formData.address.Origin.label}
                handleChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      Origin: {
                        ...formData.address.Origin,
                        label: e.target.value,
                      },
                    },
                  })
                }
              />
            )}
          </>
        ) : (
          user.role === "admin" && (
            <SelectMultipleAddresses
              handleAddresses={(address) =>
                handleMultipleAddresses(address, "Origin")
              }
            />
          )
        )}

        <CustomInput
          name="pickupReference1"
          label="Reference/Pickup Instruction"
          value={formData.pickupReference1}
          handleChange={handleChange}
        />
        <CustomInput
          name="pickupPhone"
          label="Phone number"
          value={formData.pickupPhone}
          handleChange={handleChange}
        />
      </div>

      <div className="box">
        <h3>Drop Details</h3>
        {toggleChip()}

        {locationsError && (
          <Alert icon={<ErrorOutline />} className="w-full">
            Please enter valid location
          </Alert>
        )}
        <CustomInput
          name="dropCompanyName"
          label="Company Name"
          value={formData.dropCompanyName}
          handleChange={handleChange}
        />

        {!showMultipleAddresses ? (
          <>
            <FrequentAddress
              address={formData.address.Destination}
              handleChange={(e) => handle_address("Destination", e)}
              show={() => setShowFrequentDestinations(false)}
              visible={edit}
            />
            {edit && showFrequentDestinations ? (
              <PlacesAutocomplete
                onLocationSelect={(e) => handle_address("Destination", e, true)}
                address={formData.address.Destination}
                handleCheckboxChange={(e) =>
                  setFormData({
                    ...formData,
                    saveDropAddress: e.target.checked,
                  })
                }
                checkbox={formData.saveDropAddress}
                saveOption={true}
              />
            ) : (
              <CustomInput
                value={formData.address.Destination.label}
                handleChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      Destination: {
                        ...formData.address.Destination,
                        label: e.target.value,
                      },
                    },
                  })
                }
              />
            )}
          </>
        ) : (
          user.role === "admin" && (
            <SelectMultipleAddresses
              handleAddresses={(address) =>
                handleMultipleAddresses(address, "Destination")
              }
            />
          )
        )}

        <CustomInput
          name="deliveryIns"
          label="Delivery Instructions"
          value={formData.deliveryIns}
          handleChange={handleChange}
        />
        <CustomInput
          name="deliveryPhone"
          label="Phone number"
          value={formData.deliveryPhone}
          handleChange={handleChange}
        />
      </div>
    </>
  );
}
