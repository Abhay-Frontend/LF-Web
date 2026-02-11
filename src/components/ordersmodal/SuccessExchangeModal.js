"use client";
import React from "react";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

const SuccessExchangeModal = ({
  product,
  orderItem,
  newSize,
  onClose = () => {},
}) => {
  return (
    <div className="fixed inset-0 bg-[#27272a] backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-[#27272a] rounded-lg max-w-md w-full p-6 shadow-xl">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          Exchange Requested!
        </h2>

        <p className="text-center text-white/60 mb-6">
          Your exchange request has been submitted successfully
        </p>

        {/* Product Info */}
        <div className="border border-white/10  rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            {product.imageUrls?.[0] && (
              <Image
                src={product.imageUrls[0]}
                alt={product.title}
                width={60}
                height={60}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-white text-sm mb-1">
                {product.title}
              </h3>
              {/* <div className="text-xs text-gray-600 space-y-1">
                <p>
                  Current Size:{" "}
                  <span className="font-medium">{orderItem.size}</span>
                </p>
                <p>
                  New Size:{" "}
                  <span className="font-medium text-green-600">{newSize}</span>
                </p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-white">
            <span className="font-semibold">What's next?</span>
            <br />
            • We'll pick up the item from your address
            <br />
            • Once quality check passes, your replacement will be shipped
            <br />
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SuccessExchangeModal;
