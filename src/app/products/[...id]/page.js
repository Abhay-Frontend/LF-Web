"use client";
import React, { useMemo, useState, useEffect } from "react";
import useProductsById from "@/hooks/useProductById";
import ProductImageGallery from "@/components/ProductImages";
import ProductInfo from "@/components/ProductHeader";
import ProductActions from "@/components/ProductActions";
import Navbar from "@/app/(navbar)/Navbar";
import ProductDetails from "@/components/ProductDetails";
import ReviewCard from "@/components/ReviewCard";
import ProductDelivery from "@/components/ProductDelivery";
import axiosHttp from "@/utils/axioshttp";
import Footer from "@/components/footer";
import { getParsedSelectedOptions } from "@/utils/variantUtils";
import WriteReviewModal from "@/components/WriteReviewModal";

const extractSizesFromVariants = (variants) => {
  if (!variants || !Array.isArray(variants)) return [];

  const sizesMap = new Map();
  const normalizeSize = (size = "") => {
    const map = {
      Small: "S",
      Medium: "M",
      Large: "L",
      "X-Large": "XL",
      "XX-Large": "XXL",
      "XXX-Large": "3XL",
    };

    return map[size] || size; // fallback if already S, M, L, XL etc.
  };

  variants.forEach((variant) => {
    const selectedOptions = getParsedSelectedOptions(variant.selectedOptions);

    const sizeOption = selectedOptions.find((o) => o.name === "Size");
    const colorOptions = selectedOptions.filter((o) => o.name === "Color");
    const availableStock = variant.inventory?.availableStock ?? 0;

    const rawSize = sizeOption?.value ?? "";
    const sizeValue = normalizeSize(rawSize);

    // If size doesn't exist, create an entry
    if (!sizesMap.has(sizeValue)) {
      sizesMap.set(sizeValue, {
        label: sizeValue || "",
        value: sizeValue || "",
        variantId: variant.id,
        shopifyVariantId: variant.shopifyVariantId,
        available: availableStock > 0,
        price: variant.price,
        compareAtPrice: variant.compareAtPrice,
        colors: [],
      });
    }

    const sizeEntry = sizesMap.get(sizeValue);

    // Attach all color options found on this variant to the size entry
    colorOptions.forEach((c) => {
      const colorVal = c.value;
      if (!colorVal) return;
      const existing = sizeEntry.colors.find((x) => x.value === colorVal);
      if (!existing) {
        sizeEntry.colors.push({
          label: colorVal,
          value: colorVal,
          // color hex removed; show label instead
          variantId: variant.id,
          shopifyVariantId: variant.shopifyVariantId,
          available: availableStock > 0,
          price: variant.price,
        });
      } else {
        // If any variant for this color/size has stock, mark available
        existing.available = existing.available || availableStock > 0;
      }
    });
  });

  // Convert map to array and sort sizes (preserve empty size last)
  const sizeOrder = [
    "XXS",
    "XS",
    "S",
    "M",
    "M/L",
    "L",
    "XL",
    "XXL",
    "2XL",
    "3XL",
  ];

  const sizesArray = Array.from(sizesMap.values());

  return sizesArray.sort((a, b) => {
    const indexA = sizeOrder.indexOf(a.value);
    const indexB = sizeOrder.indexOf(b.value);
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
  });
};

// ✅ Helper to extract unique colors from variants (global fallback)
const extractColorsFromVariants = (variants) => {
  if (!variants || !Array.isArray(variants)) return [];

  const colorsMap = new Map();

  variants.forEach((variant) => {
    const selectedOptions = getParsedSelectedOptions(variant.selectedOptions);
    const colorOptions = selectedOptions.filter((o) => o.name === "Color");
    const availableStock = variant.inventory?.availableStock ?? 0;

    colorOptions.forEach((colorOption) => {
      const colorValue = colorOption?.value;
      if (!colorValue) return;

      if (!colorsMap.has(colorValue)) {
        colorsMap.set(colorValue, {
          label: colorValue,
          value: colorValue,
          // no hex mapping; we'll display the name directly
          variantId: variant.id,
          shopifyVariantId: variant.shopifyVariantId,
          available: availableStock > 0,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
        });
      } else {
        const existing = colorsMap.get(colorValue);
        existing.available = existing.available || availableStock > 0;
      }
    });
  });

  return Array.from(colorsMap.values());
};

export default function ProductPage({ params }) {
  const unwrappedParams = React.use(params);
  const { product: data, loading, error } = useProductsById(unwrappedParams.id);

  // Clear selectedVariantId when product changes
  useEffect(() => {
    if (data?.id) {
      localStorage.removeItem("selectedVariantId");
    }
  }, [data?.id]);
  const [deliveryInfo, setDeliveryInfo] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Extract sizes
  const sizes = useMemo(() => {
    if (!data?.variants) return [];
    return extractSizesFromVariants(data.variants);
  }, [data?.variants]);

  // ✅ Extract colors
  const colors = useMemo(() => {
    if (!data?.variants) return [];
    return extractColorsFromVariants(data.variants);
  }, [data?.variants]);

  // ✅ Get selected variant from localStorage
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (data?.variants?.length) {
      const storedVariantId = localStorage.getItem("selectedVariantId");
      const foundVariant = data.variants.find(
        (variant) => variant.id === Number(storedVariantId)
      );

      // If no stored variant, default to first variant
      setSelectedVariant(foundVariant || data.variants[0]);
    }
  }, [data]);

  // ✅ Use variant price dynamically (fallback to first variant)
  const variantPrice =
    selectedVariant?.price ?? data?.variants?.[0]?.price ?? 0;

  // Bind gallery images to the selected variant's image if available
  const galleryImages = useMemo(() => {
    const base = Array.isArray(data?.imageUrls) ? data.imageUrls : [];
    const variantImg =
      selectedVariant?.imageSrc || selectedVariant?.image || null;
    if (variantImg) {
      // put selected variant image first, then the rest (remove duplicates)
      const rest = base.filter((u) => u !== variantImg);
      return [variantImg, ...rest];
    }
    return base;
  }, [selectedVariant, data?.imageUrls]);

  // ✅ Calculate discount
  const discount = useMemo(() => {
    if (data?.mrp && variantPrice) {
      const mrp = parseFloat(data.mrp);
      const price = parseFloat(variantPrice);
      if (mrp > price) {
        return Math.round(((mrp - price) / mrp) * 100);
      }
    }
    return 0;
  }, [data?.mrp, variantPrice]);

  const handleCheckPincode = async (pin) => {
    try {
      const storedVariantId = localStorage.getItem("selectedVariantId");
      const variantId = storedVariantId || sizes?.[0]?.variantId;

      if (!variantId || !pin || pin.length !== 6) return;

      const payload = { variantId, deliveryPostalCode: pin };
      const response = await axiosHttp.post("/check-serviceability", payload);

      if (response?.data?.status === 200 && response?.data?.data) {
        const { courier, estimatedDate, estimatedDays } = response.data.data;

        setDeliveryInfo([
          {
            icon: "truck",
            title: "Delivery Details",
            description: `Estimated Date: ${estimatedDate}\nEstimated Days: ${estimatedDays}`,
          },
        ]);
      } else {
        setDeliveryInfo([
          {
            icon: "truck",
            title: "Delivery Info",
            description: response?.data?.message || "Something went wrong.",
          },
        ]);
      }
    } catch (error) {
      const backendMessage = error?.response?.data?.message;
      if (typeof backendMessage === "string") {
        setDeliveryInfo([
          {
            icon: "truck",
            title: "Delivery Info",
            description: backendMessage,
          },
        ]);
      } else {
        setDeliveryInfo([
          {
            icon: "truck",
            title: "Delivery Info",
            description: "Could not fetch delivery info.",
          },
        ]);
      }
    }
  };

  const getReviews = async () => {
    try {
      const response = await axiosHttp.get(`/reviews?productId=${data.id}`);
      // Support API shape where review(s) are returned in response.data.data
      if (response?.data?.status === 200) {
        const payload = response.data.data;
        if (Array.isArray(payload)) {
          setReviews(payload);
        } else if (payload) {
          // single review object -> wrap in array
          setReviews([payload]);
        } else if (response.data.reviews) {
          // fallback for older shape
          setReviews(response.data.reviews);
        }
      }
    } catch (error) {}
  };

  // ✅ Check if variants have both size AND color
  const hasColorVariants = useMemo(() => {
    if (!data?.variants || !Array.isArray(data.variants)) return false;
    return data.variants.some((variant) => {
      const selectedOptions = getParsedSelectedOptions(variant.selectedOptions);
      const hasSize = selectedOptions.some((o) => o.name === "Size");
      const hasColor = selectedOptions.some((o) => o.name === "Color");
      return hasSize && hasColor;
    });
  }, [data?.variants]);

  // Fetch reviews when product data becomes available
  useEffect(() => {
    if (data?.id) {
      getReviews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  // Handle message display
  const handleMessage = (msg) => {
    setMessage(msg);
    // Auto clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-130px)] mt-[130px] px-4">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {error.status === 404 ? error.message : "Error"}
            </h1>
            {/* <p className="text-2xl font-bold text-gray-900 mb-4">
              {error.message}
            </p> */}
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-3 bg-black cursor-pointer text-white rounded hover:bg-gray-800 transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );

  const handleAddToBag = () => {};
  const handleAddToWishlist = () => {};

  return (
    <div className="bg-[#27272a]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 mt-[120px] ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Images */}
          <ProductImageGallery
            images={galleryImages}
            hasColorVariants={hasColorVariants}
          />

          {/* Right - Product Details */}
          <div className="space-y-6">
            <ProductInfo
              title={data.title}
              brand={data.brand?.name || data.brand?.businessName || ""}
              rating={4.5}
              reviews={data.variants?.length || 0}
              price={variantPrice}
              variants={data.variants}
              mrp={data.mrp}
              discount={discount}
              sizes={sizes}
              colors={colors}
              variantId={selectedVariant?.id || sizes?.[0]?.variantId}
              brandId={data.brandId}
              superCatId={data.superCatId}
              catId={data.catId}
              subcatId={data.subCatId}
              onVariantChange={setSelectedVariant}
            />

            {/* Quantity Selector - shows when variant is selected */}
            {selectedVariant && (
              <div className="space-y-2">
                <label className="text-sm  font-semibold  text-white">
                  Quantity
                </label>
                <div className="flex items-center border border-white rounded w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors text-white/70 font-medium"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-6 py-2 font-medium text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 hover:bg-gray-100 transition-colors text-white/70 font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Display message below Add to Bag */}
            {message && (
              <div
                className={`p-3 rounded text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {message.text}
              </div>
            )}
            <ProductActions
              onAddToBag={handleAddToBag}
              onAddToWishlist={handleAddToWishlist}
              productData={data}
              productId={data?.id}
              quantity={quantity}
              isInStock={
                selectedVariant
                  ? Boolean(
                      selectedVariant.available ??
                        selectedVariant.inventory?.availableStock > 0
                    )
                  : Boolean(
                      data?.variants?.some(
                        (v) => v.inventory?.availableStock > 0
                      )
                    )
              }
              onMessage={handleMessage}
            />

            <ProductDelivery
              pincode=""
              deliveryInfo={deliveryInfo}
              onCheckPincode={handleCheckPincode}
            />

            <ProductDetails
              type={data.type}
              title={data.title}
              brand={data.description}
            />
          </div>
        </div>

        {/* Reviews */}
        <div className="pt-[50px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT - Empty */}
            <div></div>

            {/* RIGHT - Reviews with Button */}
            <div>
              <div className="flex items-center justify-between mb-6">
                {reviews && reviews.length > 0 && (
                  <h2 className="text-lg font-semibold text-white">Reviews</h2>
                )}
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors font-medium cursor-pointer"
                >
                  Write a Review
                </button>
              </div>
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {reviews && reviews.length > 0 ? (
                  reviews.slice(0, 5).map((r) => {
                    const created = r.createdAt ? new Date(r.createdAt) : null;
                    const timeAgo = (() => {
                      if (!created) return "just now";
                      const diff = Date.now() - created.getTime();
                      const mins = Math.floor(diff / 60000);
                      if (mins < 1) return "just now";
                      if (mins < 60) return `${mins} min ago`;
                      const hours = Math.floor(mins / 60);
                      if (hours < 24) return `${hours} hr ago`;
                      const days = Math.floor(hours / 24);
                      return `${days} day ago`;
                    })();

                    return (
                      <ReviewCard
                        key={r.id || `${r.userId}-${r.createdAt}`}
                        name={r.user.fullName}
                        rating={r.rating}
                        timeAgo={timeAgo}
                        comment={r.comment}
                      />
                    );
                  })
                ) : (
                  <div className="text-gray-500  p-[50px]"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Write Review Modal */}
      {showReviewModal && (
        <WriteReviewModal
          product={data}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            getReviews();
            setShowReviewModal(false);
          }}
        />
      )}
    </div>
  );
}
