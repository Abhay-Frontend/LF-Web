"use client";

import React, { useState, useEffect } from "react";
import { useLocation } from "@/hooks/useLocation";

export default function LocationRequester() {
  const { coords, error, token, requestLocation } = useLocation();
  const [popupVisible, setPopupVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [skipped, setSkipped] = useState(false); // track if user skipped

  const handleAllowLocation = () => {
    setLoading(true);
    requestLocation(); // triggers browser permission
  };

  const handleSkip = () => {
    setSkipped(true);
    setPopupVisible(false); // hide popup
  };

  // Detect success
  useEffect(() => {
    if (coords.latitude && coords.longitude) {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setPopupVisible(false), 1000);
    }
  }, [coords]);

  // Stop loading on error
  useEffect(() => {
    if (error) setLoading(false);
  }, [error]);

  if (!popupVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 px-4">
      <div className="bg-[#27272a] p-6 rounded-lg shadow-lg max-w-sm w-full text-center animate-fadeIn">
        
        {/* Icon */}
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12 text-blue-400 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zm0 0v10m0 0l-3-3m3 3l3-3"
            />
          </svg>
        </div>

        {/* Messages */}
        {!loading && !success && !error && !skipped && (
          <p className="text-white mb-4 font-medium">
            We need your location to show nearby stores.
          </p>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="text-white text-sm">Detecting your location…</p>
          </div>
        )}

        {success && (
          <p className="text-green-400 font-semibold">Location detected!</p>
        )}

        {error && (
          <div>
            <p className="text-red-500 mb-2">{error}</p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition mr-2"
              onClick={() => {
                setPopupVisible(true);
                setLoading(false);
              }}
            >
              Retry
            </button>
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              onClick={handleSkip}
            >
              Skip
            </button>
          </div>
        )}

        {/* Buttons */}
        {!loading && !success && !error && !skipped && (
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="px-6 py-2 bg-[#7A6ECC] text-white rounded hover:bg-[#6B5EAA] transition"
              onClick={handleAllowLocation}
            >
              Allow Location
            </button>
            <button
              className="px-6 py-2 bg-[#27272a] text-white rounded hover:bg-gray-600 transition"
              onClick={handleSkip}
            >
              Skip
            </button>
          </div>
        )}

        {/* Display coordinates after success */}
        {coords.latitude && coords.longitude && (
          <p className="mt-4 text-white text-sm">
            Latitude: {coords.latitude}, Longitude: {coords.longitude}
          </p>
        )}
      </div>

      {/* Fade-in animation */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
