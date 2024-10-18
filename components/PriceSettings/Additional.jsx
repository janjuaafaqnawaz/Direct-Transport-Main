"use client";

const Additional = ({ handleChange, settings }) => {
  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Additional
        </label>
        <input
          type="number"
          value={settings?.additional || 0}
          onChange={(e) =>
            handleChange("additional", parseFloat(e.target.value))
          }
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Enter the additional percentage"
        />
        <p className="mt-1 text-sm text-gray-500">Enter the additional </p>
      </div>
    </div>
  );
};

export default Additional;
