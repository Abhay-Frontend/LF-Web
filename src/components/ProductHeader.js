"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Share2, Star } from "lucide-react";
import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints";
import SizeChartModal from "@/components/SizeChartModal";

const ProductInfo = ({
  title,
  brand,
  rating,
  reviews,
  mrp,
  sizes,
  colors,
  brandId,
  superCatId,
  catId,
  subcatId,
  onVariantChange,
  price,
  variants,
}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [sizeChartData, setSizeChartData] = useState(null);
  const [sizeChartLoading, setSizeChartLoading] = useState(false);

  // ✅ Initialize selected size, color and variant from localStorage or first available
  useEffect(() => {
    // Do not select any size or color by default
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedVariant(null);
    // If only colors exist (no sizes), allow color selection as before
    if ((!sizes || sizes.length === 0) && colors && colors.length > 0) {
      setSelectedColor(null);
      setSelectedVariant(null);
    }
  }, [sizes, colors, variants]);

  // ✅ Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size.value);

    // pick first available color for this size if present
    const colorForSize =
      (size.colors || []).find((c) => c.available) ||
      (size.colors || [])[0] ||
      null;
    setSelectedColor(colorForSize ? colorForSize.value : null);
    // Prefer full variant object from `variants` prop
    let resolved = null;
    if (colorForSize?.variantId && Array.isArray(variants)) {
      resolved = variants.find((v) => v.id === Number(colorForSize.variantId));
    }
    if (!resolved && size?.variantId && Array.isArray(variants)) {
      resolved = variants.find((v) => v.id === Number(size.variantId));
    }

    setSelectedVariant(resolved || colorForSize || size);

    const storeId = resolved?.id ?? colorForSize?.variantId ?? size?.variantId;
    if (storeId) localStorage.setItem("selectedVariantId", storeId);
    setShowSizeError(false);
  };

  // ✅ Handle color selection
  const handleColorSelect = (color) => {
    setSelectedColor(color.value);
    // resolve full variant for this color when possible
    let resolved = null;
    if (color?.variantId && Array.isArray(variants)) {
      resolved = variants.find((v) => v.id === Number(color.variantId));
    }

    setSelectedVariant(resolved || color);

    const storeId = resolved?.id ?? color?.variantId;
    if (storeId) localStorage.setItem("selectedVariantId", storeId);
    setShowSizeError(false);
  };
  // Error state for size selection
  const [showSizeError, setShowSizeError] = useState(false);

  // notify parent when selectedVariant changes
  useEffect(() => {
    if (onVariantChange) onVariantChange(selectedVariant);
  }, [selectedVariant, onVariantChange]);

  // ✅ Compute price based on selected variant, with fallbacks
  const variantPrice = useMemo(() => {
    if (selectedVariant?.price) return selectedVariant.price;
    // Prefer the first variant price from the full variants array if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const firstVariantPrice = variants[0]?.price;
      if (
        typeof firstVariantPrice !== "undefined" &&
        firstVariantPrice !== null
      )
        return firstVariantPrice;
    }
    if (typeof price !== "undefined" && price !== null) return price;
    return sizes?.[0]?.price || 0;
  }, [selectedVariant, sizes, price, variants]);

  // ✅ Compute discount
  const discount = useMemo(() => {
    const mrpVal = Number(mrp);
    const priceVal = Number(variantPrice);

    if (mrpVal > 0 && priceVal > 0 && mrpVal > priceVal) {
      return Math.round(((mrpVal - priceVal) / mrpVal) * 100);
    }

    return 0;
  }, [mrp, variantPrice]);

  // ✅ Check if we have sizes and/or colors to display
  const hasSizes = sizes && sizes.length > 0;
  const hasColors = colors && colors.length > 0;

  // displayedColors: if both sizes & colors exist, show colors for selected size; otherwise show global colors
  const displayedColors = (() => {
    if (hasSizes) {
      const chosen = sizes.find((s) => s.value === selectedSize) || sizes[0];
      return (chosen?.colors || []).map((c) => ({ ...c }));
    }
    return (colors || []).map((c) => ({ ...c }));
  })();

  // Handler for actions that require size selection
  const requireSizeSelection = (action) => {
    if (hasSizes && !selectedSize) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    if (typeof action === "function") action();
  };

  return (
    <div className=" pb-1">
      {/* Header */}
      <div className="space-y-3 mb-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-normal text-white mt-1">{title}</h1>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wide">
              {brand}
            </h2>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2 py-0.5 bg-teal-700 text-white rounded text-xs font-semibold">
            <span>{rating}</span>
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-sm text-gray-500">{reviews} Ratings</span>
        </div> */}
      </div>

      {/* Pricing */}
      <div className="flex items-baseline gap-2 mb-5">
        {/* Always show variant price */}
        <span className="text-2xl font-bold text-white">
          ₹{variantPrice}
        </span>

        {/* Show MRP + Discount ONLY if MRP > 0 AND MRP > Price */}
        {mrp != null &&
          mrp !== "" &&
          Number(mrp) > 0 &&
          Number(mrp) > Number(variantPrice) && (
            <>
              <span className="text-base text-white/70 line-through">
                MRP ₹{mrp}
              </span>

              <span className="text-base text-green-500 font-semibold">
                ({discount}% OFF)
              </span>
            </>
          )}
      </div>

      <div className="text-sm text-[#9c90ff] font-semibold mb-6">
        Inclusive of all taxes
      </div>

      {/* Size Selection - Show only if sizes exist */}
      {hasSizes && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Select Size
            </h3>
            <button
              onClick={async () => {
                try {
                  setSizeChartLoading(true);
                  const resp = await axiosHttp.get(
                    `${endPoints.fetchSizeChart}?brandId=${brandId}&superCatId=${superCatId}&catId=${catId}&subCatId=${subcatId}`
                  );
                  setSizeChartData(resp?.data?.data ?? null);
                  setSizeChartOpen(true);
                } catch (err) {
                  setSizeChartData(null);
                  setSizeChartOpen(true);
                } finally {
                  setSizeChartLoading(false);
                }
              }}
              className="text-sm text-[#9c90ff] font-bold hover:text-[#9c90ff] cursor-pointer"
            >
              SIZE CHART &gt;
            </button>
          </div>

          <div className="flex flex-wrap gap-4">
            {sizes.map((size) => (
              <div key={size.value} className="flex flex-col items-center">
                <button
                  onClick={() => handleSizeSelect(size)}
                  disabled={!size.available}
                  className={`min-w-[60px] px-4 py-3 border text-sm font-semibold transition-all rounded-md cursor-pointer
            ${
              !size.available
                ? "bg-zinc-900 text-gray-300 border-gray-200 line-through cursor-not-allowed"
                : selectedSize === size.value
                ? "border-pink-600 text-pink-600 bg-zinc-900"
                : "border-gray-300 text-gray-700 bg-zinc-900 hover:border-gray-400"
            }`}
                >
                  {size.label ? size.label : "ONE SIZE"}
                </button>
              </div>
            ))}
          </div>
          {showSizeError && (
            <div className="text-xs text-red-500 mt-2 font-semibold">
              Please select a size.
            </div>
          )}
        </div>
      )}

      {/* Color Selection - Show only if colors exist */}
      {hasColors && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">
              Select Color
            </h3>
          </div>

          <div className="flex items-center gap-4">
            {displayedColors && displayedColors.length > 0 ? (
              displayedColors.map((color) => (
                <div key={color.value} className="flex flex-col items-center">
                  <button
                    onClick={() => handleColorSelect(color)}
                    disabled={!color.available}
                    title={color.label}
                    className={`min-w-[56px] px-2 h-9 rounded-full border-2 transition-all flex items-center justify-center text-xs font-semibold ${
                      !color.available
                        ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-300"
                        : selectedColor === color.value
                        ? "ring-2 ring-pink-500 border-white text-pink-600"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {color.label}
                  </button>

                  {/* <div className="text-[11px] text-gray-600 mt-1">
                    {color.hex}
                  </div> */}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No colors available</div>
            )}
          </div>
        </div>
      )}

      <SizeChartModal
        open={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        data={sizeChartData}
        loading={sizeChartLoading}
      />
    </div>
  );
};

export default ProductInfo;
