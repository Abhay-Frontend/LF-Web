"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setAppliedCoupon, clearAppliedCoupon } from "@/redux/slices/cartSlice";
import { X } from "lucide-react";
import Link from "next/link";
 
const OrderSummary = ({
  products,
  onProceed,
  coupons = [],
  onAmountChange,
  isUserLoggedIn = true,
  onProceedWithoutLogin = null,
}) => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const appliedCoupon = useSelector((state) => state.cart?.appliedCoupon);
  const [showModal, setShowModal] = useState(false);

  const totalMrp = products.reduce(
    (sum, p) => sum + (p.originalPrice || 0) * p.quantity,
    0
  );

  // Total Variant Price
  const totalVariantPrice = products.reduce(
    (sum, p) => sum + (p.price || 0) * p.quantity,
    0
  );

  // Subtotal = (MRP - Selling Price)
  const subtotal = totalVariantPrice;

  const deliveryCharges = 0;
  const convenienceFee = 0;

  // Coupon Calculation
  const calculateDiscount = (coupon) => {
    if (!coupon || !coupon.discountType) return 0;

    const discountPercent = parseFloat(coupon.discountType.replace("%", ""));
    const discountAmount = (subtotal * discountPercent) / 100;

    return Math.min(discountAmount, coupon.maxDiscountCap || discountAmount);
  };

  const totalDiscount = appliedCoupon ? calculateDiscount(appliedCoupon) : 0;

  const totalPrice =
    subtotal + deliveryCharges + convenienceFee - totalDiscount;

  const handleApplyCoupon = (coupon) => {
    dispatch(setAppliedCoupon(coupon));
    setShowModal(false);
  };

  const handleRemoveCoupon = () => {
    dispatch(clearAppliedCoupon());
  };

  const isAddressPage = pathname === "/checkout/address";

  // Auto-remove coupon if cart value falls below minimum
  useEffect(() => {
    if (
      appliedCoupon &&
      appliedCoupon.minCartValue &&
      subtotal < appliedCoupon.minCartValue
    ) {
      dispatch(clearAppliedCoupon());
    }
  }, [subtotal, appliedCoupon, dispatch]);

  useEffect(() => {
    if (onAmountChange) {
      onAmountChange(totalPrice);
    }
  }, [totalPrice, onAmountChange]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 top-4">
      {/* COUPON SECTION */}
      {!isAddressPage && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-black">COUPONS</span>
            <button
              onClick={() => setShowModal(true)}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              VIEW MORE
            </button>
          </div>

          {appliedCoupon ? (
            <div className="border rounded p-2 text-sm text-black bg-green-100">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{appliedCoupon.name}</span>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-red-600 text-xs underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Code: <span className="font-mono">{appliedCoupon.code}</span>
              </p>
              <p className="text-xs text-green-700 mt-1 font-medium">
                ✓ Coupon Applied
              </p>
            </div>
          ) : coupons.length > 0 ? (
            <p className="text-gray-600 text-sm">
              {coupons.length} coupon{coupons.length > 1 ? "s" : ""} available
            </p>
          ) : (
            <p className="text-gray-500 text-sm">No coupons available</p>
          )}
        </div>
      )}

      {/* ORDER DETAILS */}
      <div className="border-t pt-4">
        <h3 className="font-semibold mb-4 text-black">ORDER DETAILS</h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-black">Total MRP</span>
            <span className="font-semibold text-black">
              ₹{totalMrp.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-black">Subtotal</span>
            <span className="font-semibold text-black">
              ₹{subtotal.toFixed(2)}
            </span>
          </div>

          {/* <div className="flex justify-between">
            <span className="text-black">GST (18%)</span>
            <span className="font-semibold text-black">₹{gst.toFixed(2)}</span>
          </div> */}

          {totalDiscount > 0 && (
            <div className="flex justify-between text-black">
              <span>Coupon Discount</span>
              <span>- ₹{totalDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-black">Delivery Charges</span>
            <span className="text-green-600">
              {deliveryCharges === 0 ? "Free" : `₹${deliveryCharges}`}
            </span>
          </div>

          {/* <div className="flex justify-between">
            <span className="text-black">Convenience Fee</span>
            <span className="text-black">
              {convenienceFee === 0 ? "₹0" : `₹${convenienceFee}`}
            </span>
          </div> */}
        </div>

        {/* TOTAL */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t">
          <span className="font-semibold text-black">Total Price</span>
          <span className="font-bold text-lg text-black">
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* PROCEED */}
      {!isAddressPage &&
        (isUserLoggedIn ? (
          <Link
            href="/checkout/address"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-medium mt-4 inline-block text-center"
          >
            Proceed to Checkout
          </Link>
        ) : (
          <button
            onClick={onProceedWithoutLogin}
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors font-medium mt-4 cursor-pointer"
          >
            Proceed to Checkout
          </button>
        ))}

      {/* COUPON MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-96 max-h-[80vh] overflow-y-auto shadow-lg relative p-6">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-semibold text-black mb-4">
              Available Coupons
            </h2>

            {coupons.length > 0 ? (
              <div className="space-y-4">
                {coupons.map((coupon) => {
                  const isCouponDisabled = subtotal < coupon.minCartValue;
                  return (
                    <div
                      key={coupon.id}
                      className={`border rounded p-3 ${
                        isCouponDisabled
                          ? "bg-gray-100 opacity-75"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-black">
                            {coupon.name}
                          </h4>
                          <p className="text-xs text-gray-600">
                            Code:{" "}
                            <span className="font-mono">{coupon.code}</span>
                          </p>
                        </div>
                        <button
                          onClick={() => handleApplyCoupon(coupon)}
                          disabled={isCouponDisabled}
                          className={`text-xs underline ${
                            isCouponDisabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 cursor-pointer"
                          }`}
                        >
                          Apply
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {coupon.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        Discount: {coupon.discountType}
                      </p>
                      {isCouponDisabled && (
                        <p className="text-xs text-red-600 mt-2 font-medium">
                          Min cart value: ₹{coupon.minCartValue}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No coupons available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
