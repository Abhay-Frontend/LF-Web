import React from "react";
import { X, AlertTriangle } from "lucide-react";

const PaymentStatusModal = ({
  isOpen,
  onClose,
  status, // 'success', 'failed', or 'payment_success_order_failed'
  transactionId,
  paymentMethod,
  dateTime,
  amountPaid,
  errorMessage,
  onTrackOrder,
  onContinueShopping,
}) => {
  if (!isOpen) return null;

  const isSuccess = status === "success";
  const isPaymentSuccessOrderFailed = status === "payment_success_order_failed";
  const isFailed = status === "failed";

  // Handler to copy transaction ID to clipboard
  const handleCopyTransactionId = () => {
    if (transactionId) {
      navigator.clipboard.writeText(transactionId);
      alert("Transaction ID copied to clipboard!");
    }
  };



  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#27272a]/80 backdrop-blur-sm">
    <div className="bg-zinc-900 rounded-lg shadow-black/40 max-w-md w-full mx-4 relative border border-white/10">
      
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
      >
        <X size={24} />
      </button>

      {/* Content */}
      <div className="p-6 pt-8">
        {/* Warning Icon */}
        {isPaymentSuccessOrderFailed && (
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-500/20 rounded-full p-3">
              <AlertTriangle className="text-yellow-400" size={32} />
            </div>
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2 text-center">
          {isSuccess && "Payment Completed"}
          {isFailed && "Payment Failed"}
          {isPaymentSuccessOrderFailed && "Payment Received"}
        </h2>

        <p className="text-white/60 text-sm mb-6 text-center">
          {isSuccess && "Thank you for choosing our collection."}
          {isFailed && "Unfortunately, your payment could not be processed."}
          {isPaymentSuccessOrderFailed &&
            "Your payment was successful, but we encountered an issue processing your order."}
        </p>

        {/* Error Message */}
        {isPaymentSuccessOrderFailed && errorMessage && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-300">
              <strong>Important:</strong> {errorMessage}
            </p>
          </div>
        )}

        {/* Transaction Details */}
        <div className="border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-white mb-4">
            TRANSACTION DETAILS
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">Transaction ID</span>
              <span className="text-white font-medium text-sm font-mono">
                #{transactionId || "N/A"}
              </span>
            </div>

            {paymentMethod && (
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Payment Method</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                    <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {paymentMethod}
                  </span>
                </div>
              </div>
            )}

            {dateTime && (
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Date & Time</span>
                <span className="text-white font-medium text-sm">
                  {dateTime}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-white font-semibold">
                {isSuccess || isPaymentSuccessOrderFailed
                  ? "Amount Paid"
                  : "Amount"}
              </span>
              <span
                className={`font-bold text-lg ${
                  isSuccess || isPaymentSuccessOrderFailed
                    ? "text-white"
                    : "text-red-400"
                }`}
              >
                Rs. {amountPaid || "0"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {isSuccess && (
            <>
              <button
                onClick={onTrackOrder}
                className="w-full bg-[#988BFF] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Track Your Order
              </button>
              <button
                onClick={onContinueShopping}
                className="w-full bg-zinc-900 text-white py-3 rounded-lg font-semibold border border-white/10 hover:bg-white/5 transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </>
          )}

          {isFailed && (
            <>
              <button
                onClick={onClose}
                className="w-full bg-[#988BFF] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={onContinueShopping}
                className="w-full bg-zinc-900 text-white py-3 rounded-lg font-semibold border border-white/10 hover:bg-white/5 transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </>
          )}

          {isPaymentSuccessOrderFailed && (
            <button
              onClick={handleCopyTransactionId}
              className="w-full bg-[#988BFF] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition cursor-pointer"
            >
              Copy Transaction ID
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

  // return (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm bg-opacity-50">
  //     <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
  //       {/* Close Button */}
  //       <button
  //         onClick={onClose}
  //         className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
  //       >
  //         <X size={24} />
  //       </button>

  //       {/* Content */}
  //       <div className="p-6 pt-8">
  //         {/* Warning Icon for Payment Success but Order Failed */}
  //         {isPaymentSuccessOrderFailed && (
  //           <div className="flex justify-center mb-4">
  //             <div className="bg-yellow-100 rounded-full p-3">
  //               <AlertTriangle className="text-yellow-600" size={32} />
  //             </div>
  //           </div>
  //         )}

  //         {/* Title */}
  //         <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
  //           {isSuccess && "Payment Completed"}
  //           {isFailed && "Payment Failed"}
  //           {isPaymentSuccessOrderFailed && "Payment Received"}
  //         </h2>
  //         <p className="text-gray-600 text-sm mb-6 text-center">
  //           {isSuccess && "Thank you for choosing our collection."}
  //           {isFailed && "Unfortunately, your payment could not be processed."}
  //           {isPaymentSuccessOrderFailed &&
  //             "Your payment was successful, but we encountered an issue processing your order."}
  //         </p>

  //         {/* Error Message for Payment Success but Order Failed */}
  //         {isPaymentSuccessOrderFailed && errorMessage && (
  //           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
  //             <p className="text-sm text-yellow-800">
  //               <strong>Important:</strong> {errorMessage}
  //             </p>
  //           </div>
  //         )}

  //         {/* Transaction Details */}
  //         <div className="border-t border-gray-200 pt-4">
  //           <h3 className="text-sm font-semibold text-gray-900 mb-4">
  //             TRANSACTION DETAILS
  //           </h3>

  //           <div className="space-y-3">
  //             {/* Transaction ID */}
  //             <div className="flex justify-between items-center">
  //               <span className="text-gray-600 text-sm">Transaction ID</span>
  //               <span className="text-gray-900 font-medium text-sm font-mono">
  //                 #{transactionId || "N/A"}
  //               </span>
  //             </div>

  //             {/* Payment Method */}
  //             {paymentMethod && (
  //               <div className="flex justify-between items-center">
  //                 <span className="text-gray-600 text-sm">Payment Method</span>
  //                 <div className="flex items-center gap-2">
  //                   <div className="flex gap-1">
  //                     <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
  //                     <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
  //                   </div>
  //                   <span className="text-gray-900 font-medium text-sm">
  //                     {paymentMethod}
  //                   </span>
  //                 </div>
  //               </div>
  //             )}

  //             {/* Date & Time */}
  //             {dateTime && (
  //               <div className="flex justify-between items-center">
  //                 <span className="text-gray-600 text-sm">Date & Time</span>
  //                 <span className="text-gray-900 font-medium text-sm">
  //                   {dateTime}
  //                 </span>
  //               </div>
  //             )}

  //             {/* Amount */}
  //             <div className="flex justify-between items-center pt-3 border-t border-gray-200">
  //               <span className="text-gray-900 font-semibold">
  //                 {isSuccess || isPaymentSuccessOrderFailed
  //                   ? "Amount Paid"
  //                   : "Amount"}
  //               </span>
  //               <span
  //                 className={`font-bold text-lg ${
  //                   isSuccess || isPaymentSuccessOrderFailed
  //                     ? "text-gray-900"
  //                     : "text-red-600"
  //                 }`}
  //               >
  //                 Rs. {amountPaid || "0"}
  //               </span>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Action Buttons */}
  //         <div className="mt-6 space-y-3">
  //           {isSuccess && (
  //             <>
  //               <button
  //                 onClick={onTrackOrder}
  //                 className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
  //               >
  //                 Track Your Order
  //               </button>
  //               <button
  //                 onClick={onContinueShopping}
  //                 className="w-full bg-white text-black py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
  //               >
  //                 Continue Shopping
  //               </button>
  //             </>
  //           )}

  //           {isFailed && (
  //             <>
  //               <button
  //                 onClick={onClose}
  //                 className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
  //               >
  //                 Try Again
  //               </button>
  //               <button
  //                 onClick={onContinueShopping}
  //                 className="w-full bg-white text-black py-3 rounded-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
  //               >
  //                 Continue Shopping
  //               </button>
  //             </>
  //           )}

  //           {isPaymentSuccessOrderFailed && (
  //             <>
  //               <button
  //                 onClick={handleCopyTransactionId}
  //                 className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
  //               >
  //                 Copy Transaction ID
  //               </button>
  //             </>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default PaymentStatusModal;
