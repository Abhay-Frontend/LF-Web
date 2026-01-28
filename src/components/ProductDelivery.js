"use client";
import React, { useState } from "react";
import { MapPin, Truck, RefreshCw, Shield } from "lucide-react";

const DeliveryOptions = ({ pincode, deliveryInfo, onCheckPincode }) => {
  const [pin, setPin] = useState(pincode || "");
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (onCheckPincode && pin.length === 6) {
      setLoading(true);
      await onCheckPincode(pin);
      setLoading(false);
    }
  };

  // ✅ Handle Enter key
  const handleKeyDown = async (e) => {
    if (e.key === "Enter" && pin.length === 6) {
      await handleCheck();
    }
  };

  // ✅ Make sure deliveryInfo is always an array
  const safeDeliveryInfo = Array.isArray(deliveryInfo) ? deliveryInfo : [];

  return (
    <div className="pt-5 space-y-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-wide">
        Delivery Options
      </h3>

      {/* Pincode input */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 border border-white/10 rounded px-3 py-2.5">
          <MapPin className="w-4 h-4 text-white/70" />
          <input
            type="text"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            onKeyDown={handleKeyDown}
            placeholder="Enter pincode"
            className="flex-1 outline-none text-sm text-white"
            maxLength={6}
          />
        </div>
        <button
          onClick={handleCheck}
          className={`px-5 py-2.5 text-[#9c90ff] font-bold text-sm hover:bg-pink-50 transition-colors ${
            pin.length !== 6 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading || pin.length !== 6}
        >
          {loading ? "Checking..." : "CHECK"}
        </button>
      </div>

      {/* ✅ Delivery Info */}
      {safeDeliveryInfo.length > 0 ? (
        <div className="space-y-3 pt-2">
          {safeDeliveryInfo.map((info, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm">
              {info.icon === "truck" && (
                <Truck className="w-4 h-4 text-white/70 mt-0.5 flex-shrink-0" />
              )}
              {info.icon === "refresh" && (
                <RefreshCw className="w-4 h-4 text-white/70 mt-0.5 flex-shrink-0" />
              )}
              {info.icon === "shield" && (
                <Shield className="w-4 h-4 text-white/70 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className="font-semibold text-white">{info.title}</p>
                {info.description && (
                  <div className="text-white/70 mt-1 text-sm">
                    {info.description.split("\n").map((line, index) => (
                      <p key={index} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // ✅ Fallback when no delivery info
        <p className="text-xs text-white/70 italic">
          Enter a valid pincode to check delivery details.
        </p>
      )}
    </div>
  );
};

export default DeliveryOptions;
