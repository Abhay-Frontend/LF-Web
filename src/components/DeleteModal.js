import React from "react";

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Remove Item",
  message = "Are you sure you want to remove this item from your cart?",
  confirmText = "Remove",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-lg max-w-md w-full p-6 shadow-lg">
        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>

        {/* Message */}
        <p className="text-white/60 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 border border-white/20 text-white rounded hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Removing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
