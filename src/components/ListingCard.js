import { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import CreateBoardModal from "./WishlistBoardModal";
import { useDispatch } from "react-redux";
import { openWishlistModal } from "@/redux/slices/loginmodalSlice";
import Link from "next/link";
import Image from "next/image";

const ListingCard = ({
  imageUrls,
  title,
  brand,
  rating,
  reviewCount,
  basePrice,
  mrp,
  discountPercentage,
  id,
}) => {
  const [showModal, setShowModal] = useState(false); // Add this state
  const dispatch = useDispatch();

  const handleWishlistClick = () => {
    setShowModal(true); // Set this card's modal to show
    dispatch(openWishlistModal());
  };

  const productData = {
    id,
    imageUrls,
    title,
    brand,
    rating,
    reviewCount,
    basePrice,
    mrp,
    discountPercentage,
  };

  return (
    <>
      <div className="relative overflow-hidden md:w-[220px] md:h-[430px] flex flex-col">
        {/* Product Image with Link */}
        <Link
          href={`/products/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => localStorage.setItem("ProductId", id)}
        >
          <div className="relative bg-gray-50 overflow-hidden group flex-shrink-0 h-[300px] cursor-pointer">
            {imageUrls?.[0] ? (
              <Image
                src={imageUrls[0]}
                alt={title || "Product"}
                fill
                className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-300" />
            )}
          </div>
        </Link>

        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Wishlist Icon */}
          <button
            onClick={handleWishlistClick}
            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
          >
            <Heart
              size={16}
              className={`text-black transition-colors duration-200 cursor-pointer`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-3 justify-between">
          {/* Rating */}
          {rating && Number(rating) > 0 ? (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-900">
                  {rating}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-xs ${
                        i < Math.floor(rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {reviewCount && Number(reviewCount) > 0 && (
                <span className="text-xs text-gray-500">| {reviewCount}</span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mb-1"></p>
          )}

          {/* Brand */}
          {brand && (
            <p className="text-xs text-white/70 font-medium uppercase tracking-wide mb-1">
              {brand}
            </p>
          )}

          {/* Title */}
          <h3
            className="text-sm font-medium text-white mb-3 leading-tight"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title || "Product Title"}
          </h3>

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-base font-bold text-white">
                Rs. {basePrice}
              </span>

              {mrp > basePrice && mrp > 0 && (
                <>
                  <span className="text-sm text-white line-through">
                    Rs. {mrp}
                  </span>

                  {discountPercentage > 0 && (
                    <span className="text-xs text-green-600 font-medium">
                      ({discountPercentage}% OFF)
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Only render modal if showModal is true for this card */}
      {showModal && (
        <CreateBoardModal
          productData={productData}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default ListingCard;
