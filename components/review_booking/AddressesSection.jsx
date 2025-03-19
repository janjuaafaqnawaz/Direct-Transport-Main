import { Alert } from "@mantine/core";
import React from "react";
import "./form.css";
import { PlacesAutocomplete } from "@/components/Index";
import FrequentAddress from "@/components/fields/FrequentAddress";
import CustomInput from "@/components/fields/CustomInput";
import { ErrorOutline } from "@mui/icons-material";
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
  return (
    <>
      <div className="box">
        <h3>Pickup Details</h3>
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
              setFormData({ ...formData, savePickAddress: e.target.checked })
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
                  Destination: {
                    ...formData.address.Origin,
                    label: e.target.value,
                  },
                },
              })
            }
          />
        )}

        {user.role === "admin" && <SelectMultipleAddresses />}

        <CustomInput
          name="pickupReference1"
          label="Reference/Pickup Instruction"
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
              setFormData({ ...formData, saveDropAddress: e.target.checked })
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
        {user.role === "admin" && <SelectMultipleAddresses />}
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
