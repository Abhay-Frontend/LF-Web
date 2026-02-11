"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(userData || {});

  useEffect(() => {
    if (userData) setFormData(userData);
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#27272a] w-full max-w-md mx-4 rounded shadow-xl">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">EDIT PROFILE</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            </div>
          ) : (
            <div>
              {/* First Name */}
              <div className="mb-4">
                <label className="block text-sm  text-white mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-white/10 rounded focus:ring-2 focus:ring-black outline-none  text-white"
                />
              </div>

              {/* Last Name */}
              <div className="mb-4">
                <label className="block text-sm  text-white mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-white/10 rounded focus:ring-2 focus:ring-black outline-none  text-white"
                />
              </div>

              {/* Phone (Non-editable) */}
              <div className="mb-4">
                <label className="block text-sm  text-white mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  disabled
                  className="w-full px-3 py-2 border border-white/10 rounded bg-gray-800 cursor-not-allowed text-white"
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm  text-white mb-2">Email </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-white/10 rounded focus:ring-2 focus:ring-black outline-none  text-white"
                />
                <span className="text-green-500 text-xs">
                  You will receive updates at the email address listed above.
                </span>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-white mb-3">
                  Gender
                </label>
                <div className="flex gap-6">
                  {["male", "female", "other"].map((gender) => (
                    <label
                      key={gender}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={() => handleGenderChange(gender)}
                        className="w-4 h-4 text-white  border-white/10 focus:ring-black"
                      />
                      <span className="text-sm  text-white capitalize">
                        {gender}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-white/10 rounded hover:bg-gray-50 transition-colors text-white cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
