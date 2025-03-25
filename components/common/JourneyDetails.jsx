import React from "react";

export default function JourneyDetails({ invoice, minimal }) {
  if (!invoice) return;

  return (
    <>
      {invoice.address.useMultipleAddresses && (
        <div className="bg-white rounded-lg   py-6 my-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Journey Details
          </h2>
          {/* 
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="flex items-center">
              <span className="font-medium text-gray-700 w-32">
                Total Distance:
              </span>
              <span className="text-gray-900">
                {invoice?.distanceData?.totalDistanceKM} km
              </span>
            </p>
          </div> */}

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Origins */}
                <div className="flex flex-col space-y-3">
                  {invoice?.address?.MultipleOrigin?.map((address, index) => (
                    <div key={`origin-${index}`} className="flex flex-col">
                      <span className="text-sm text-gray-500">
                        Origin {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium text-gray-800">
                        {address?.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right Column: Destinations */}
                <div className="flex flex-col space-y-3">
                  {invoice?.address?.MultipleDestination?.map(
                    (address, index) => (
                      <div
                        key={`destination-${index}`}
                        className="flex flex-col"
                      >
                        <span className="text-sm text-gray-500">
                          Destination {String.fromCharCode(65 + index)}
                        </span>
                        <span className="font-medium text-gray-800">
                          {address?.label}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
