import React from "react";

const AddressCard = ({ address, isSelected, onSelect, onEdit, onDelete }) => {
  return (
    <div className="bg-zinc-900 border border-white/10 rounded-lg p-4 mb-4 hover:border-[#988BFF] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Radio Button */}
          <input
            type="radio"
            checked={isSelected}
            onChange={onSelect}
            className="mt-1 w-4 h-4 cursor-pointer accent-[#988BFF]"
          />

          <div className="flex-1">
            {/* Address Type */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-white text-base capitalize">
                {address.type || "Home"}
              </h3>
              {address.isDefaultAddress && (
                <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded">
                  Default
                </span>
              )}
            </div>

            {/* Contact Name */}
            <p className="text-sm text-white mb-1 font-medium">
              {address.contactName}
            </p>

            {/* Address Lines */}
            <p className="text-sm text-white/60 mb-1">
              {address.line1}
              {address.line2 && `, ${address.line2}`}
            </p>

            <p className="text-sm text-white/60 mb-1">
              {address.city}, {address.state} - {address.postalCode}
            </p>

            <p className="text-sm text-white/60 mb-2">{address.country}</p>

            {/* Mobile Number */}
            <p className="text-sm text-white font-medium">
              Mobile: {address.contactPhone}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="text-sm text-white/60 hover:text-[#988BFF] flex items-center gap-1 ml-4 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
      </div>

      {/* Delete Button */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <button
          onClick={onDelete}
          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
