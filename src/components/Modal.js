import { useState, useMemo, useEffect } from "react";
import { X, Heart } from "lucide-react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { closeProductViewModal } from "@/redux/slices/loginmodalSlice";
import Link from "next/link";
import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints";
import { addToCart } from "@/redux/slices/cartSlice";
import { getParsedSelectedOptions } from "@/utils/variantUtils";

const ProductModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.productViewModal);
  const product = useSelector((state) => state.modal.selectedProduct);
  const user = useSelector((state) => state.user.userInfo);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSizeColorOptions, setShowSizeColorOptions] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'

  // Helper function to extract sizes from variants
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

      return map[size] || size;
    };

    variants.forEach((variant) => {
      const selectedOptions = getParsedSelectedOptions(variant.selectedOptions);
      const sizeOption = selectedOptions.find((o) => o.name === "Size");
      const colorOptions = selectedOptions.filter((o) => o.name === "Color");
      const availableStock = variant.inventory?.availableStock ?? 0;

      const rawSize = sizeOption?.value ?? "";
      const sizeValue = normalizeSize(rawSize);

      // If no size option or "Default Title", treat as ONE SIZE
      const finalSizeValue = sizeValue || "ONE SIZE";
      const finalSizeLabel = sizeValue || "ONE SIZE";

      if (!sizesMap.has(finalSizeValue)) {
        sizesMap.set(finalSizeValue, {
          label: finalSizeLabel,
          value: finalSizeValue,
          variantId: variant.id,
          available: availableStock > 0,
          price: variant.price,
          colors: [],
        });
      }

      const sizeEntry = sizesMap.get(finalSizeValue);

      colorOptions.forEach((c) => {
        const colorVal = c.value;
        if (!colorVal) return;
        const existing = sizeEntry.colors.find((x) => x.value === colorVal);
        if (!existing) {
          sizeEntry.colors.push({
            label: colorVal,
            value: colorVal,
            variantId: variant.id,
            available: availableStock > 0,
            price: variant.price,
          });
        } else {
          existing.available = existing.available || availableStock > 0;
        }
      });
    });

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
      "ONE SIZE",
    ];

    const sizesArray = Array.from(sizesMap.values());

    return sizesArray.sort((a, b) => {
      const indexA = sizeOrder.indexOf(a.value);
      const indexB = sizeOrder.indexOf(b.value);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  };

  // Helper function to extract colors from variants
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
            variantId: variant.id,
            available: availableStock > 0,
            price: variant.price,
          });
        } else {
          const existing = colorsMap.get(colorValue);
          existing.available = existing.available || availableStock > 0;
        }
      });
    });

    return Array.from(colorsMap.values());
  };

  // Memoized sizes and colors
  const sizes = useMemo(() => {
    if (!product?.variants) return [];
    return extractSizesFromVariants(product.variants);
  }, [product?.variants]);

  const colors = useMemo(() => {
    if (!product?.variants) return [];
    return extractColorsFromVariants(product.variants);
  }, [product?.variants]);

  // Get colors for selected size
  const colorsForSelectedSize = useMemo(() => {
    if (!selectedSize) return colors;
    const sizeEntry = sizes.find((s) => s.value === selectedSize);
    return sizeEntry?.colors || [];
  }, [selectedSize, sizes, colors]);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(null);
      setSelectedColor(null);
      setShowSizeColorOptions(false);
      setLoading(false);
      setMessage(null);
      setMessageType(null);
    }
  }, [product?.id]);

  // Auto-dismiss message after 4 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Helper function to show message
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  // Auto-select size when there's only one size or if no sizes available (ONE SIZE)
  useEffect(() => {
    if (isOpen && product) {
      if (sizes.length > 0) {
        // Auto-select the first size (could be ONE SIZE or a regular size)
        setSelectedSize(sizes[0].value);
        setSelectedColor(null);
      }
    }
  }, [sizes, isOpen, product]);

  // Determine selected variant ID
  const getSelectedVariantId = () => {
    if (selectedColor && selectedSize && selectedSize !== "ONE SIZE") {
      const sizeEntry = sizes.find((s) => s.value === selectedSize);
      const colorEntry = sizeEntry?.colors.find(
        (c) => c.value === selectedColor
      );
      return colorEntry?.variantId;
    } else if (selectedSize && selectedSize !== "ONE SIZE") {
      const sizeEntry = sizes.find((s) => s.value === selectedSize);
      return sizeEntry?.variantId;
    } else if (selectedSize === "ONE SIZE" && product?.variants?.[0]) {
      // If ONE SIZE, use the first variant
      return product.variants[0].id;
    }
    return null;
  };

  // Replace onClose prop with dispatch
  const handleClose = () => {
    dispatch(closeProductViewModal());
  };

  if (!isOpen || !product) return null;

  const handleAddToCart = async () => {
    // If ONE SIZE product, add to cart directly
    if (selectedSize === "ONE SIZE") {
      setLoading(true);

      try {
        const variantId = getSelectedVariantId();

        if (!variantId) {
          showMessage("Unable to select variant", "error");
          setLoading(false);
          return;
        }

        // Get the available stock from the selected variant
        const selectedVariant = product.variants.find(
          (v) => v.id === variantId
        );
        const availableQuantity =
          selectedVariant?.inventory?.availableStock ?? 1;

        // If user is not logged in, store in localStorage, dispatch to Redux, and show message
        if (!user?.id) {
          localStorage.setItem("ProductId", product.id);
          localStorage.setItem("selectedVariantId", variantId);

          // Add to Redux cart state for cart sync
          dispatch(addToCart({ product, variantId, quantity: 1 }));

          showMessage("Item added to cart", "success");
          // Keep modal open for 4 seconds to show message, then close
          setTimeout(() => {
            handleClose();
          }, 4000);
          setLoading(false);
          return;
        }

        // API call for logged-in users
        const payload = {
          userId: parseInt(user.id, 10),
          productId: parseInt(product.id, 10),
          variantId: parseInt(variantId, 10),
          quantity: 1,
        };

        const result = await axiosHttp.post(
          endPoints.addProductToCart,
          payload
        );

        if (result.status === 200 || result.status === 201) {
          // Add to Redux cart state
          dispatch(addToCart({ product, variantId }));

          showMessage(
            result.data?.message || "Added to bag successfully",
            "success"
          );

          // Keep modal open for 4 seconds to show message, then close
          setTimeout(() => {
            handleClose();
          }, 4000);
        } else {
          showMessage(result.data?.message || "Something went wrong", "error");
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong";
        showMessage(errorMessage, "error");
      } finally {
        setLoading(false);
      }
      return;
    }

    // If size/color options are not shown yet, show them
    if (!showSizeColorOptions) {
      setShowSizeColorOptions(true);
      return;
    }

    if (!selectedSize) {
      showMessage("Please select a size", "error");
      return;
    }

    if (colorsForSelectedSize.length > 0 && !selectedColor) {
      showMessage("Please select a color", "error");
      return;
    }

    setLoading(true);

    try {
      const variantId = getSelectedVariantId();

      if (!variantId) {
        showMessage("Unable to select variant", "error");
        setLoading(false);
        return;
      }

      // Get the available stock from the selected variant
      const selectedVariant = product.variants.find((v) => v.id === variantId);
      const availableQuantity = selectedVariant?.inventory?.availableStock ?? 1;

      // If user is not logged in, store in localStorage, dispatch to Redux, and show message
      if (!user?.id) {
        localStorage.setItem("ProductId", product.id);
        localStorage.setItem("selectedVariantId", variantId);

        // Add to Redux cart state for cart sync
        dispatch(addToCart({ product, variantId, quantity: 1 }));

        showMessage("Item added to cart", "success");
        // Keep modal open for 4 seconds to show message, then close
        setTimeout(() => {
          handleClose();
        }, 4000);
        setLoading(false);
        return;
      }

      // API call for logged-in users
      const payload = {
        userId: parseInt(user.id, 10),
        productId: parseInt(product.id, 10),
        variantId: parseInt(variantId, 10),
        quantity: 1,
      };

      const result = await axiosHttp.post(endPoints.addProductToCart, payload);

      if (result.status === 200 || result.status === 201) {
        // Add to Redux cart state
        dispatch(addToCart({ product, variantId }));

        showMessage(
          result.data?.message || "Added to bag successfully",
          "success"
        );

        // Keep modal open for 4 seconds to show message, then close
        setTimeout(() => {
          handleClose();
        }, 4000);
      } else {
        showMessage(result.data?.message || "Something went wrong", "error");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      showMessage(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-black/10 backdrop-blur-[4px]  flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-[#27272a] w-full max-w-3xl  overflow-hidden">
        <div className="flex flex-col md:flex-row overflow-y-auto  max-h-[400px]">
          {/* Product Image */}
          <div className="md:w-1/2 w-full relative bg-gray-50 flex items-center justify-center ">
            {/* <button className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md z-10">
              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
            </button> */}

            <div className="relative w-full h-70 md:h-[400px]">
              <Image
                src={
                  product?.imageUrls
                    ? product?.imageUrls[0]
                    : "https://cdn.shopify.com/s/files/1/0553/6186/3863/products/0I1A6958copy-pichi.jpg?v=1617717071"
                }
                alt={product?.title || "product-img"}
                fill
                className="object-fill"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
            {/* Header with Close Button */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-1">
                  {product.title}
                </h2>
                <p className="text-xl text-white">Rs. {product.basePrice}</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8   flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-white mb-1 text-sm leading-snug">
                {product.description?.split(" ").slice(0, 25).join(" ") +
                  (product.description?.split(" ").length > 25 ? "..." : "")}
              </p>
            </div>

            {/* Size Selection */}
            {showSizeColorOptions && sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-black font-medium mb-2 text-sm">
                  Size: {selectedSize || "Select a size"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => {
                        setSelectedSize(size.value);
                        setSelectedColor(null); // Reset color when size changes
                      }}
                      disabled={!size.available}
                      className={`px-3 py-2 border rounded-md text-sm font-medium transition-all ${
                        selectedSize === size.value
                          ? "bg-black text-white border-black"
                          : size.available
                          ? "bg-white text-black border-gray-300 hover:border-black"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {showSizeColorOptions && colorsForSelectedSize.length > 0 && (
              <div className="mb-4">
                <label className="block text-white font-medium mb-2 text-sm">
                  Color: {selectedColor || "Select a color"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorsForSelectedSize.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setSelectedColor(color.value)}
                      disabled={!color.available}
                      className={`px-3 py-2 border rounded-md text-sm font-medium transition-all ${
                        selectedColor === color.value
                          ? "bg-black text-white border-black"
                          : color.available
                          ? "bg-white text-black border-gray-300 hover:border-black"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons in one row */}
            <div className="mb-4 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="flex-1 bg-black border border-black text-white py-2 px-5 rounded-md hover:bg-gray-800 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Adding..."
                  : showSizeColorOptions
                  ? "Add to Bag"
                  : "Add to Cart"}
              </button>

              <Link
                href={`/products/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => localStorage.setItem("ProductId", product.id)}
                className="flex-1 bg-white border border-black text-black py-2 px-4 rounded-md hover:bg-gray-50 transition-colors font-medium text-sm inline-flex items-center justify-center text-center"
              >
                View Details
              </Link>
            </div>
            {/* Message Display */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-md text-sm font-medium text-center ${
                  messageType === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
