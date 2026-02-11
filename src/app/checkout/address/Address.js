"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import OrderSummary from "@/components/OrderSummary";
import AddressCard from "@/components/AddressCard";
import AddressModal from "@/components/AddressModal";
import DeleteConfirmModal from "@/components/DeleteModal";
import PaymentStatusModal from "@/components/ordersmodal/PayementConfirmationModal";
import axiosHttp from "@/utils/axioshttp";
import useGetCoupons from "@/hooks/useGetCoupons";
import Link from "next/link";
import Footer from "@/components/footer";
import { setCartItems } from "@/redux/slices/cartSlice";
import toast from "react-hot-toast";   

const CheckOutAddress = () => {
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalData, setPaymentModalData] = useState({});
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const getCoupons = useGetCoupons();
  const userInfo = useSelector((state) => state.user?.userInfo);
  const cartItemsFromRedux = useSelector((state) => state.cart?.items || []);
  const appliedCoupon = useSelector((state) => state.cart?.appliedCoupon);
  const userId = userInfo?.id;
  const dispatch = useDispatch();
  const router = useRouter();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if already loaded
        if (window.Razorpay) {
          setRazorpayLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
      fetchAddresses();
      // Load saved checkout from memory (using state instead of localStorage)
      try {
        const saved = sessionStorage.getItem(`lafetch_checkout_${userId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.selectedAddressId)
            setSelectedAddressId(parsed.selectedAddressId);
          if (parsed.orderTotal) setOrderTotal(parsed.orderTotal);
        }
      } catch (e) {}
    }
  }, [userId]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axiosHttp.get(`/cart-items/${userId}`);
      if (response.data.status === 200 && response.data.data) {
        const transformedData = response.data.data.map((item) => ({
          id: item.id,
          cartItemId: item.id,
          productId: item.productId,
          variantId: item.variantId,
          name: item.product.title,
          price: item.pricing?.unitPrice || item.product_variant.price, // Use unitPrice from pricing
          originalPrice:
            item.product.mrp ||
            item.product.basePrice ||
            item.product_variant.price, // MRP
          quantity: item.quantity || 1, // Use quantity directly from API
        }));

        setProducts(transformedData);

        // Keep Redux cart items in sync for selection state only
        try {
          const payload = transformedData.map((m) => ({
            ...m,
            cartItemId: m.cartItemId,
            variantId: m.variantId || null,
            selected:
              (
                cartItemsFromRedux.find(
                  (ci) => ci.cartItemId === m.cartItemId
                ) || {}
              ).selected ?? true,
          }));
          dispatch(setCartItems(payload));
        } catch (e) {}
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axiosHttp.get(`/profile/addresses/${userId}`);
      if (response.data.status === 200 && response.data.data) {
        setAddresses(response.data.data);
        // Auto-select default address
        const defaultAddress = response.data.data.find(
          (addr) => addr.isDefaultAddress
        );
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        }
      }
    } catch (error) {}
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = (addressId) => {
    setDeletingAddressId(addressId);
    setIsDeleteModalOpen(true);
  };

  const handleSaveAddress = async (formData) => {
    try {
      if (editingAddress) {
        // Update existing address
        const response = await axiosHttp.put(`/profile/address/`, {
          ...formData,
          addressId: editingAddress.id,
        });
        if (response.data.status === 200) {
          fetchAddresses();
          setIsAddressModalOpen(false);
        }
      } else {
        // Create new address
        const response = await axiosHttp.post(`/profile/address/`, formData);
        if (response.data.status === 200 || response.data.status === 201) {
          fetchAddresses();
          setIsAddressModalOpen(false);
        }
      }
    } catch (error) {
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      const response = await axiosHttp.delete(
        `/profile/address/${deletingAddressId}`
      );
      if (response.data.status === 200) {
        fetchAddresses();
        setIsDeleteModalOpen(false);
        setDeletingAddressId(null);
        // If deleted address was selected, clear selection
        if (selectedAddressId === deletingAddressId) {
          setSelectedAddressId(null);
        }
      }
    } catch (error) {
      toast.error("Failed to delete address. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!selectedAddressId) {
      toast.error("Please select an address to proceed.");
      return;
    }

    // Check if Razorpay is loaded
    if (!razorpayLoaded || !window.Razorpay) {
      toast.error("Payment gateway is loading. Please try again in a moment.");
      return;
    }

    try {
      // Step 1: Fetch latest cart items
      const cartResp = await axiosHttp.get(`/cart-items/${userId}`);
      const cartData = (cartResp.data && cartResp.data.data) || [];

      if (cartData.length === 0) {
        toast.error("Your cart is empty. Please add items to proceed.");
        return;
      }

      // Build items array for initiate-payment using cart API data
      const items = cartData.map((item) => {
        const quantity = item.quantity || 1;
        const unitPrice = Number(item.product_variant?.price || 0);
        const itemTotal = unitPrice * quantity;

        return {
          productId: item.productId,
          variantId: item.variantId,
          quantity,
          unitPrice: unitPrice,
          discount: 0,
          total: itemTotal,
        };
      });

      // Calculate totals from cart data
      const totalMRP = cartData.reduce((s, it) => {
        const qty = it.quantity || 1;
        const mrp = Number(it.product?.mrp || it.product?.basePrice || 0);
        return s + mrp * qty;
      }, 0);

      const subtotalBeforeCoupon = items.reduce(
        (s, it) => s + (it.total || 0),
        0
      );

      // Calculate coupon discount
      let couponDiscount = 0;
      if (appliedCoupon && appliedCoupon.discountType) {
        const discountPercent = parseFloat(
          appliedCoupon.discountType.replace("%", "")
        );
        const discountAmount = (subtotalBeforeCoupon * discountPercent) / 100;
        couponDiscount = Math.min(
          discountAmount,
          appliedCoupon.maxDiscountCap || discountAmount
        );
      }

      const paymentTotal = subtotalBeforeCoupon - couponDiscount;

      // Step 2: Call /initiate-payment API
      const initiatePayload = {
        userId: userId,
        shippingAddressId: selectedAddressId,
        items: items,
        totalMRP: Number(totalMRP.toFixed(2)),
        couponDiscount: Number(couponDiscount.toFixed(2)),
        total: Number(paymentTotal.toFixed(2)),
        paymentMethod: "prepaid",
      };

      const initiateResp = await axiosHttp.post(
        `/initiate-payment`,
        initiatePayload
      );

      if (
        !initiateResp.data ||
        (initiateResp.data.status !== 200 && initiateResp.data.status !== 201)
      ) {
        throw new Error(
          initiateResp.data?.message || "Failed to initiate payment"
        );
      }

      const { orderId, paymentId, providerOrderId } = initiateResp.data.data;

      if (!providerOrderId) {
        throw new Error("Provider order ID not received from server");
      }

      // Step 3: Store payment details in sessionStorage
      const paymentData = {
        orderId,
        paymentId,
        providerOrderId,
        selectedAddressId,
        items,
        total: +paymentTotal.toFixed(2),
        totalMRP,
        userId,
      };

      try {
        sessionStorage.setItem(
          `lafetch_payment_${userId}`,
          JSON.stringify(paymentData)
        );
      } catch (e) {}

      // Step 4: Open Razorpay payment gateway
      const amountInPaise = Math.round(paymentTotal * 100);

      // Verify Razorpay key is available
      const razorpayKey = process.env.NEXT_PUBLIC_RAZOR_PAY_KEY_ID;

      if (!razorpayKey) {
        toast.error("Payment configuration error. Please contact support.");
        return;
      }

      const options = {
        key: razorpayKey,
        amount: amountInPaise,
        currency: "INR",
        name: "LaFetch",
        description: "Order Payment",
        image: "/logo.png",
        order_id: providerOrderId,
        prefill: {
          name: userInfo?.fullName || "",
          email: userInfo?.email || "",
          contact: userInfo?.phone || "",
        },
        notes: {
          address: "LaFetch order payment",
        },
        theme: { color: "#988BFF" },
        handler: async function (response) {
          try {
            // Validate Razorpay response
            if (!response.razorpay_payment_id) {
              throw new Error("Payment ID is missing from Razorpay response");
            }

            // Retrieve payment data from sessionStorage
            const storedData = sessionStorage.getItem(
              `lafetch_payment_${userId}`
            );
            if (!storedData) {
              throw new Error("Payment data not found in storage");
            }

            const paymentInfo = JSON.parse(storedData);

            // Step 5: Call /place-order API with payment response
            const placeOrderPayload = {
              orderId: paymentInfo.orderId,
              paymentInfo: {
                providerOrderId:
                  response.razorpay_order_id || paymentInfo.providerOrderId,
                providerPaymentId: response.razorpay_payment_id,
                providerSignature: response.razorpay_signature || "",
              },
            };

            const placeResp = await axiosHttp.post(
              `/place-order`,
              placeOrderPayload
            );

            if (
              placeResp.data &&
              (placeResp.data.status === 200 || placeResp.data.status === 201)
            ) {
              // Clear stored payment and checkout data
              try {
                sessionStorage.removeItem(`lafetch_payment_${userId}`);
                sessionStorage.removeItem(`lafetch_checkout_${userId}`);
              } catch (e) {}

              // Open payment confirmation modal with success
              setPaymentModalData({
                status: "success",
                transactionId: response.razorpay_payment_id,
                paymentMethod: "Razorpay",
                dateTime: new Date().toLocaleString(),
                amountPaid: paymentInfo?.total || paymentTotal || 0,
              });
              setIsPaymentModalOpen(true);
            } else {
              // Payment successful but order placement failed
              setPaymentModalData({
                status: "payment_success_order_failed",
                transactionId: response.razorpay_payment_id || "N/A",
                paymentMethod: "Razorpay",
                dateTime: new Date().toLocaleString(),
                amountPaid: paymentInfo?.total || paymentTotal || 0,
                errorMessage:
                  "Payment completed successfully but order could not be placed. Please contact support with your transaction ID.",
              });
              setIsPaymentModalOpen(true);
            }
          } catch (err) {
            // Payment successful but error occurred during order placement
            setPaymentModalData({
              status: "payment_success_order_failed",
              transactionId: response?.razorpay_payment_id || "N/A",
              paymentMethod: "Razorpay",
              dateTime: new Date().toLocaleString(),
              amountPaid: paymentTotal || 0,
              errorMessage:
                "Payment completed successfully but order could not be placed. Please contact support with your transaction ID.",
            });
            setIsPaymentModalOpen(true);
          }
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled. You can try again when ready.");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        // Open failure modal with available details
        setPaymentModalData({
          status: "failed",
          transactionId: response.error?.code || "N/A",
          paymentMethod: "Razorpay",
          dateTime: new Date().toLocaleString(),
          amountPaid: 0,
        });
        setIsPaymentModalOpen(true);
      });

      rzp.open();
    } catch (err) {
      toast.error(
        "Could not start payment: " + (err.message || "Please try again later.")
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#27272a] flex items-center justify-center text-lg text-white">
        Loading your cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#27272a] pt-[130px] pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm">
          <Link href="/checkout/bag" className="text-white/60">
            BAG
          </Link>
          <span className="text-white/30">--------</span>
          <Link
            href="/checkout/address"
            className="text-white underline decoration-[#988BFF] decoration-[2px] font-bold"
          >
            ADDRESS
          </Link>
          <span className="text-white/30">--------</span>
          <span className="text-white/60">PAYMENT</span>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Address Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  SELECT ADDRESS
                </h2>
                <p className="text-sm text-white/60">
                  {addresses.length} Saved Address
                  {addresses.length !== 1 ? "es" : ""}
                </p>
              </div>
              <button
                onClick={handleAddNewAddress}
                className="flex items-center gap-2 px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 cursor-pointer transition"
              >
                <span className="text-xl">+</span>
                Add New Address
              </button>
            </div>

            {/* Default Address Section */}
            {addresses.filter((addr) => addr.isDefaultAddress).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white/60 mb-3">
                  DEFAULT ADDRESS
                </h3>
                {addresses
                  .filter((addr) => addr.isDefaultAddress)
                  .map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      isSelected={selectedAddressId === address.id}
                      onSelect={() => setSelectedAddressId(address.id)}
                      onEdit={() => handleEditAddress(address)}
                      onDelete={() => handleDeleteAddress(address.id)}
                    />
                  ))}
              </div>
            )}

            {/* Other Addresses Section */}
            {addresses.filter((addr) => !addr.isDefaultAddress).length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white/60 mb-3">
                  OTHER ADDRESS
                </h3>
                {addresses
                  .filter((addr) => !addr.isDefaultAddress)
                  .map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      isSelected={selectedAddressId === address.id}
                      onSelect={() => setSelectedAddressId(address.id)}
                      onEdit={() => handleEditAddress(address)}
                      onDelete={() => handleDeleteAddress(address.id)}
                    />
                  ))}
              </div>
            )}

            {/* No Addresses Message */}
            {addresses.length === 0 && (
              <div className="bg-zinc-900 border border-white/10 rounded-lg p-8 text-center">
                <p className="text-white/60 mb-4">No saved addresses found</p>
                <button
                  onClick={handleAddNewAddress}
                  className="px-6 py-2 bg-[#988BFF] text-black rounded hover:opacity-90"
                >
                  Add Your First Address
                </button>
              </div>
            )}
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:col-span-1 flex flex-col">
            <OrderSummary
              products={products}
              coupons={getCoupons}
              onAmountChange={(amount) => setOrderTotal(amount)}
            />

            {/* Proceed to Pay Button */}
            <button
              onClick={handleRazorpayPayment}
              disabled={!razorpayLoaded}
              className={`mt-6 w-full px-4 py-3 font-semibold rounded transition ${
                razorpayLoaded
                  ? "bg-[#988BFF] text-black cursor-pointer hover:opacity-90"
                  : "bg-white/20 text-white/40 cursor-not-allowed"
              }`}
            >
              {razorpayLoaded ? "Proceed to Pay" : "Loading Payment Gateway..."}
            </button>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        onSave={handleSaveAddress}
        editAddress={editingAddress}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingAddressId(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />

      {/* Payment Confirmation Modal */}
      <PaymentStatusModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        status={paymentModalData.status}
        transactionId={paymentModalData.transactionId}
        paymentMethod={paymentModalData.paymentMethod}
        dateTime={paymentModalData.dateTime}
        amountPaid={paymentModalData.amountPaid}
        errorMessage={paymentModalData.errorMessage}
        onTrackOrder={() => {
          setIsPaymentModalOpen(false);
          router.push("/account/orders");
        }}
        onContinueShopping={() => {
          setIsPaymentModalOpen(false);
          router.push("/products");
        }}
      />
    </div>
  );
};

export default CheckOutAddress;
