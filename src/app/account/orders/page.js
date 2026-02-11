"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OrderCard from "@/components/ordersmodal/MyOrders";
import axiosHttp from "@/utils/axioshttp";
import { useSelector, useDispatch } from "react-redux";

import ReviewOrderModal from "@/components/ordersmodal/ReviewOrder";
import CancelOrderModal from "@/components/ordersmodal/CancelOrder";
import ReturnModal from "@/components/ordersmodal/ReturnOrder";
import ExchangeOrderModal from "@/components/ordersmodal/ExchangeOrder";
import OrderDetailView from "@/components/ordersmodal/OrderDetailView";

import {
  openReturnModal,
  closeReturnModal,
  openCancelModal,
  closeCancelModal,
  openExchangeModal,
  closeExchangeModal,
} from "@/redux/slices/loginmodalSlice";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const userInfo = useSelector((state) => state.user?.userInfo);
  const userId = userInfo?.id;
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) router.push("/");
  }, [userId, router]);

  const {
    openReturnModal: isReturnOpen,
    cancelModal: isCancelOpen,
    exchangeModal: isExchangeOpen,
    selectedProduct,
  } = useSelector((state) => state.modal);

  const fetchOrders = async () => {
    try {
      const response = await axiosHttp.get(`/order-history/${userId}`);
      if (response.data.status === 200) {
        setOrders(response.data.data.reverse());
      }
    } catch {}
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderAction = (order, actionType) => {
    setSelectedOrder(order);
    if (actionType === "return") dispatch(openReturnModal(order));
    if (actionType === "cancel") dispatch(openCancelModal(order));
    if (actionType === "review") setActiveModal("review");
    if (actionType === "exchange") dispatch(openExchangeModal(order));
  };

  const handleCardClick = (orderId) => {
    setSelectedOrderId(orderId);
    setViewMode("detail");
  };

  const handleBack = () => {
    setSelectedOrderId(null);
    setViewMode("list");
  };

  if (viewMode === "detail" && selectedOrderId) {
    return (
      <>
        <OrderDetailView
          orderId={selectedOrderId}
          onBack={handleBack}
          axiosHttp={axiosHttp}
        />

        {isReturnOpen && (
          <ReturnModal
            order={selectedProduct}
            onClose={() => dispatch(closeReturnModal())}
            onSuccess={fetchOrders}
          />
        )}

        {isCancelOpen && (
          <CancelOrderModal
            order={selectedProduct}
            onClose={() => dispatch(closeCancelModal())}
            onSuccess={fetchOrders}
          />
        )}

        {isExchangeOpen && (
          <ExchangeOrderModal
            order={selectedProduct}
            onClose={() => dispatch(closeExchangeModal())}
            onSuccess={fetchOrders}
          />
        )}
      </>
    );
  }

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) =>
          order.status?.toLowerCase().includes(selectedStatus)
        );

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen bg-[#27272a]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Orders</h1>

        {/* STATUS FILTER */}
        <div className="flex flex-wrap gap-3 mt-4 mb-6">
          {[
            "all",
            "pending",
            "confirmed",
            "delivered",
            "cancelled",
            "returned",
            "exchanged",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 text-sm rounded-full border transition cursor-pointer ${
                selectedStatus === status
                  ? "bg-[#988BFF] text-black border-[#988BFF]"
                  : "bg-zinc-900 text-white/60 border-white/10 hover:shadow-md hover:shadow-black/40"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <p className="text-white/40">
          Track, return, cancel, review, or exchange your orders
        </p>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="bg-zinc-900 border border-white/10 rounded-lg p-8 text-center">
          <p className="text-white/60 font-medium">
            No order details found for{" "}
            <span className="capitalize text-white">
              {selectedStatus === "all" ? "all orders" : selectedStatus}
            </span>
          </p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order.id}
            onClick={() => handleCardClick(order.id)}
            className="transition hover:shadow-lg hover:shadow-black/40"
          >
            <OrderCard order={order} onAction={handleOrderAction} />
          </div>
        ))
      )}

      {isReturnOpen && (
        <ReturnModal
          order={selectedProduct}
          onClose={() => dispatch(closeReturnModal())}
          onSuccess={fetchOrders}
        />
      )}

      {isCancelOpen && (
        <CancelOrderModal
          order={selectedProduct}
          onClose={() => dispatch(closeCancelModal())}
          onSuccess={fetchOrders}
        />
      )}

      {isExchangeOpen && (
        <ExchangeOrderModal
          order={selectedProduct}
          onClose={() => dispatch(closeExchangeModal())}
          onSuccess={fetchOrders}
        />
      )}

      {activeModal === "review" && (
        <ReviewOrderModal
          order={selectedOrder}
          onClose={() => setActiveModal(null)}
          onSuccess={fetchOrders}
        />
      )}
    </div>
  );
};

export default MyOrders;
