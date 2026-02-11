"use client";
import React, { useState } from "react";
import axiosHttp from "@/utils/axioshttp";
import { useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";

const ReviewOrderModal = ({
  order,
  onClose = () => {},
  onSuccess = () => {},
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Logged in user info
  const userInfo = useSelector((state) => state.user?.userInfo);
  const userId = userInfo?.id;

  // Bind data correctly based on current API structure
  const orderItemId = order?.id;
  const product = order?.product;
  const variantId = order?.variantId;

  const productImage =
    product?.imageUrls?.[0] ||
    product?.image ||
    "https://via.placeholder.com/80";
  const productTitle = product?.title || "Product";
  const productDesc = product?.shortDescription || product?.description || "";
  const productPrice = order?.unitPrice;

  // Rating Handlers
  const handleStarClick = (star) => setRating(star);
  const handleStarHover = (star) => setHoveredRating(star);
  const handleStarLeave = () => setHoveredRating(0);

  const handleCancel = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  // Submit review API
  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        userId,
        orderItemId,
        variantId,
        rating,
        comment,
      };

      const response = await axiosHttp.post(`/review`, payload);

      if (response.data.status === 201) {
        toast.success(response.data.message);
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#27272a] backdrop-blur-sm bg-opacity-50 p-4 z-[999]">
      <div
        className="bg-[#27272a] rounded-lg shadow-lg overflow-hidden"
        style={{ width: "513px", height: "600px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg text-white font-semibold">
            Rate & Review Product
          </h2>
          <button
            onClick={handleCancel}
            className="text-white/40 hover:text-white text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Product Info */}
        <div className="px-6 py-4 border-b">
          <div className="flex gap-4">
            <Image
              src={productImage}
              alt={productTitle}
              width={64}
              height={100}
              className="w-16 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-1 text-white">
                {productTitle}
              </h3>
              <p className="text-xs text-gray-500 mb-2 text-white/40">
                {productDesc?.split(" ").slice(0, 30).join(" ") +
                  (productDesc?.split(" ").length > 30 ? "..." : "")}
              </p>

              <p className="text-sm font-semibold text-white">
                Rs. {productPrice}
              </p>

              {/* Show Order ID */}
              <p className="text-xs text-white mt-1">
                Order ID:{" "}
                <span className="text-white font-medium">#{orderItemId}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="px-6 py-6">
          <h3 className="text-sm font-semibold mb-3 text-white">RATING</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
                className="focus:outline-none transition-colors cursor-pointer"
              >
                <svg
                  className="w-10 h-10"
                  fill={star <= displayRating ? "#FFD700" : "#E5E7EB"}
                  stroke={star <= displayRating ? "#FFD700" : "#9CA3AF"}
                  strokeWidth="1"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Comment Section */}
        <div className="px-6 pb-6">
          <h3 className="text-sm font-semibold mb-3 text-white">
            SHARE YOUR EXPERIENCE
          </h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review here..."
            className="w-full bg-zinc-800 h-32 px-4 py-3 text-white border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-black resize-none text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-3 border border-white/10 text-white/60 rounded hover:bg-zinc-800 transition-colors font-medium cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-[#988BFF] text-white rounded hover:shadow-black/40 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderModal;
