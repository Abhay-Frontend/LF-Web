"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { X } from "lucide-react";
import axiosHttp from "@/utils/axioshttp";
import toast, { Toaster } from "react-hot-toast";

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const userInfo = useSelector((state) => state.user?.userInfo);
  const userId = userInfo?.id;

  const handleDeleteAccount = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    try {
      setIsDeleting(true);
      const response = await axiosHttp.post(`/auth/delete-account/${userId}`);

      toast.success(response.data?.message);

      onClose();
      localStorage.clear();
      router.push("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete account";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-zinc-900 border border-white/10 w-full max-w-sm sm:max-w-md rounded-lg shadow-lg shadow-black/40 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-lg sm:text-2xl font-bold text-white">
              Account Deletion
            </h2>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <p className="text-base sm:text-lg font-semibold text-white mb-3">
              Are you sure you want to delete your account?
            </p>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed">
              LaFetch securely maintains user data integral to onboarding
              processes. User-specific data will be permanently removed to
              ensure privacy.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-0">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:flex-1 px-4 py-3 border border-white/10 text-white/60 font-medium rounded-md hover:text-white hover:border-[#988BFF] transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="w-full sm:flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Confirm Deletion"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteAccountModal;
