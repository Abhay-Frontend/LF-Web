import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {
  openWishlistModal,
  openProductViewModal,
} from "@/redux/slices/loginmodalSlice";
import WishlistBoardModal from "../WishlistBoardModal";

const ProductCollectionCard = ({ product, onLike }) => {
  const dispatch = useDispatch();

  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  /** 🧠 Memoized images array */
  const images = useMemo(() => {
    if (product?.images?.length) return product.images;
    if (product?.image) return [product.image];
    return [];
  }, [product?.images, product?.image]);

  /** 🧠 Prices memoized */
  const price = useMemo(() => Number(product.price), [product.price]);
  const originalPrice = useMemo(
    () => Number(product.originalPrice),
    [product.originalPrice]
  );

  const showOriginalPrice = originalPrice > price;
  const discountPercentage = showOriginalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  /** 🔁 Optimized hover interval */
  useEffect(() => {
    if (!isHovering || images.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isHovering, images.length]);

  /** ♻️ Callbacks (stable references) */
  const handlePreviewClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      dispatch(
        openProductViewModal({
          id: product.id,
          title: product.name,
          imageUrls: images,
          basePrice: price,
          description: product.description || "",
          brand: product.brand,
          variants: product.variants || [],
          availableSizes: product.availableSizes || [],
        })
      );
    },
    [dispatch, product, images, price]
  );

  const handleLike = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowWishlistModal(true);
      dispatch(openWishlistModal());
      onLike?.(product.id);
    },
    [dispatch, onLike, product.id]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setCurrentImageIndex(0);
  }, []);

  const truncateText = useCallback((text, limit = 24) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  }, []);

  return (
    <>
      <div className="w-full rounded-xl flex flex-col gap-2 overflow-hidden ">
        <Link
          href={`/products/${product.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            className="relative h-[250px] sm:h-[280px] md:h-[340px] lg:h-[400px]
             p-4 bg-zinc-900 rounded-xl overflow-hidden group
             flex items-center justify-center"
            onMouseLeave={handleMouseLeave}
            onMouseEnter={() => setIsHovering(true)}
          >
            {images.length > 0 && (
              <Image
                src={images[currentImageIndex]}
                alt={product.name}
                width={400}
                height={500}
                className="max-h-full max-w-full object-contain"
              />
            )}

            <button
              onClick={handlePreviewClick}
              className="absolute left-2 bottom-2 w-[calc(100%-16px)] h-9
               bg-white/90 hover:bg-white text-black rounded-lg flex items-center justify-center
               opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <span className="text-sm font-medium">Product Preview</span>
            </button>
          </div>
        </Link>

        <div className="px-2 pb-2 flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold uppercase text-white">
                {truncateText(product.name)}
              </p>
              <p className="text-xs uppercase text-white/60">{product.brand}</p>
            </div>

            <button onClick={handleLike}>
              <Heart className="w-5 h-5 text-white/70 hover:text-white transition-colors" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm md:text-md text-white">₹{price}</span>
            {showOriginalPrice && (
              <>
                <span className="line-through opacity-50 text-sm md:text-md text-white/70">
                  ₹{originalPrice}
                </span>
                <span className="text-emerald-400 text-sm md:text-md font-medium">
                  ({discountPercentage}% OFF)
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {showWishlistModal && (
        <WishlistBoardModal
          productData={{
            id: product.id,
            imageUrls: images,
            title: product.name,
            brand: product.brand,
            basePrice: price,
            mrp: showOriginalPrice ? originalPrice : null,
            discountPercentage,
          }}
          onClose={() => setShowWishlistModal(false)}
        />
      )}
    </>
  );
};

export default React.memo(ProductCollectionCard);
