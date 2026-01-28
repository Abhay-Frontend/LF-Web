"use client";
import Image from "next/image";
import React from "react";

const SizeChartModal = ({ open, onClose, data, loading }) => {
  if (!open) return null;

  const renderTable = (raw) => {
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!Array.isArray(parsed) || parsed.length === 0)
        return <div>No size chart data.</div>;

      const headers = Object.keys(parsed[0]);

      return (
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full text-white text-sm table-auto border-collapse">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th
                    key={h}
                    className="border px-3 py-2 bg-gray-100 text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsed.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  {headers.map((h) => (
                    <td key={h} className="border px-3 py-2">
                      {row[h]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } catch (err) {
      return <div>Unable to parse size chart data.</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-[90%] max-w-3xl bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg text-black font-semibold">Size Chart</h3>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700 cursor-pointer"
          >
            Close
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-black text-center">Loading...</div>
        ) : !data ? (
          <div className="py-8 text-black text-center">
            No size chart found for this product.
          </div>
        ) : data.sizeGuideImage ? (
          <div className="flex justify-center">
            <Image
              src={data.sizeGuideImage}
              alt={data.title || "size guide"}
              width={500}
              height={500}
              className="max-h-[60vh] object-contain w-auto h-auto"
            />
          </div>
        ) : data.sizeChartData ? (
          renderTable(data.sizeChartData)
        ) : (
          <div className="py-8 text-center text-black">
            No size chart available.
          </div>
        )}
      </div>
    </div>
  );
};

export default SizeChartModal;
