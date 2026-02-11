import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

const AddressModal = ({ isOpen, onClose, onSave, editAddress = null }) => {
  const userInfo = useSelector((state) => state.user?.userInfo);
  const userId = userInfo?.id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userId: userId || "",
      contactName: "",
      contactPhone: "",
      line1: "",
      line2: "",
      country: "India",
      state: "",
      city: "",
      postalCode: "",
      isDefaultAddress: false,
      type: "home",
    },
  });

  useEffect(() => {
    if (editAddress) {
      reset({ ...editAddress, userId, addressId: editAddress.id });
    } else {
      reset({
        userId: userId || "",
        contactName: "",
        contactPhone: "",
        line1: "",
        line2: "",
        country: "India",
        state: "",
        city: "",
        postalCode: "",
        isDefaultAddress: false,
        type: "home",
      });
    }
  }, [editAddress, isOpen, reset, userId]);

  const onSubmit = (data) => {
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#27272a] backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">
              {editAddress ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-[#b3a9ff] cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Details */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white mb-3">
                PERSONAL DETAILS
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-white mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    {...register("contactName", {
                      required: "Name is required",
                    })}
                    className={`w-full px-3 py-2 border rounded focus:outline-none ${
                      errors.contactName
                        ? "border-red-500"
                        : "border-gray-300 focus:border-gray-400"
                    } text-black`}
                  />
                  {errors.contactName && (
                    <span className="text-red-500 text-sm">
                      {errors.contactName.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-white mb-1">
                    Phone*
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter 10 digit mobile number"
                    maxLength={10}
                    {...register("contactPhone", {
                      required: "Phone is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10 digit mobile number",
                      },
                    })}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    className={`w-full px-3 py-2 border rounded focus:outline-none ${
                      errors.contactPhone
                        ? "border-red-500"
                        : "border-gray-300 focus:border-gray-400"
                    } text-black`}
                  />

                  {errors.contactPhone && (
                    <span className="text-red-500 text-sm">
                      {errors.contactPhone.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Postal Details */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">
                POSTAL DETAILS
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    placeholder="House no, Building name, Street"
                    {...register("line1", { required: "Address is required" })}
                    className={`w-full px-3 py-2 border rounded focus:outline-none ${
                      errors.line1
                        ? "border-red-500"
                        : "border-gray-300 focus:border-gray-400"
                    } text-black`}
                  />
                  {errors.line1 && (
                    <span className="text-red-500 text-sm">
                      {errors.line1.message}
                    </span>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Area, Landmark (Optional)"
                    {...register("line2")}
                    className="w-full px-3 py-2 border border-white/20 rounded focus:outline-none focus:border-gray-400 text-black"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-white mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      placeholder="Locality/Town"
                      {...register("city", { required: "City is required" })}
                      className={`w-full px-3 py-2 border rounded focus:outline-none ${
                        errors.city
                          ? "border-red-500"
                          : "border-gray-300 focus:border-gray-400"
                      } text-black`}
                    />
                    {errors.city && (
                      <span className="text-red-500 text-sm">
                        {errors.city.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-1">
                      State*
                    </label>
                    <input
                      type="text"
                      placeholder="State"
                      {...register("state", { required: "State is required" })}
                      className={`w-full px-3 py-2 border rounded focus:outline-none ${
                        errors.state
                          ? "border-red-500"
                          : "border-gray-300 focus:border-gray-400"
                      } text-black`}
                    />
                    {errors.state && (
                      <span className="text-red-500 text-sm">
                        {errors.state.message}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-white mb-1">
                      Zip Code*
                    </label>
                    <input
                      type="text"
                      placeholder="Zip Code"
                      {...register("postalCode", {
                        required: "Zip Code is required",
                      })}
                      className={`w-full px-3 py-2 border rounded focus:outline-none ${
                        errors.postalCode
                          ? "border-red-500"
                          : "border-gray-300 focus:border-gray-400"
                      } text-black`}
                    />
                    {errors.postalCode && (
                      <span className="text-red-500 text-sm">
                        {errors.postalCode.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Save As */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">
                SAVE AS
              </h3>
              <div className="flex gap-4">
                {["home", "office", "other"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={type}
                      {...register("type", { required: true })}
                      className="w-4 h-4 mr-2"
                    />
                    <span className="text-sm text-white">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Default Address Checkbox */}
            <div className="mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("isDefaultAddress")}
                  className="w-4 h-4 mr-2"
                />
                <span className="text-sm text-white">
                  Make this as my default address
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gray-200 text-white rounded hover:bg-gray-300 cursor-pointer"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
