import React from "react";

export default function JourneyDetails({ invoice, minimal }) {
  if (!invoice) return;

  return (
    <>
      {invoice.address.useMultipleAddresses && (
        <div className="bg-white rounded-lg shadow-md p-6 my-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Journey Details
          </h2>

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="flex items-center">
              <span className="font-medium text-gray-700 w-32">
                Total Distance:
              </span>
              <span className="text-gray-900">
                {invoice?.distanceData?.totalDistanceKM} km
              </span>
            </p>
          </div>

          <div className="space-y-4">
            {invoice?.distanceData?.steps.map((step, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">From</span>
                    <span className="font-medium text-gray-800">
                      {step.from}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">To</span>
                    <span className="font-medium text-gray-800">{step.to}</span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Distance</span>
                    <span className="font-medium text-gray-800">
                      {step.distance}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Duration</span>
                    <span className="font-medium text-gray-800">
                      {step.duration}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {!minimal && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="flex flex-col">
                <span className="font-medium text-gray-700 mb-1">
                  Complete Journey:
                </span>
                <span className="text-gray-800 text-sm leading-relaxed">
                  {invoice?.distanceData?.readablePath}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
