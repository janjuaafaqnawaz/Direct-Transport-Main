"use client";

import React from "react";

const TruckWaitTimeRate = ({ handleChange, settings }) => {
  return (
    <div>
      <ul>
        {Object.entries(settings).map(([key, value]) => (
          <li key={key} className="mb-4">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                {key}
              </span>
              <input
                type="number"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={`Enter rate for ${key}`}
              />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                $
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TruckWaitTimeRate;
