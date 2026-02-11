import React from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  RotateCcw,
  RefreshCw,
  Star,
  Download,
} from "lucide-react";
import Image from "next/image";

const OrderCard = ({ order, onAction, onClick }) => {
  const {
    id,
    orderId,
    product,
    order: orderDetails,
    quantity,
    total,
    invoiceUrl,
  } = order;
  const productImage = product?.imageUrls?.[0];
  const status = order.status;

  const getActionButtons = (status) => {
    const lower = status.toLowerCase();
    if (lower === "pending") return [];

    switch (lower) {
      case "confirmed":
      case "order confirmed":
        return [{ label: "Cancel", type: "cancel", variant: "outline" }];
      case "delivered":
        return [
          { label: "Return", type: "return", variant: "outline" },
          { label: "Exchange", type: "exchange", variant: "outline" },
        ];
      default:
        return [];
    }
  };

  const getStatusConfig = (status) => {
    const lower = status.toLowerCase();
    if (lower.includes("delivered"))
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    if (lower.includes("cancelled"))
      return { icon: XCircle, color: "text-red-600", bgColor: "bg-red-50" };
    if (lower.includes("return"))
      return {
        icon: RotateCcw,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
      };
    if (lower.includes("exchange"))
      return { icon: RefreshCw, color: "text-blue-600", bgColor: "bg-blue-50" };
    return { icon: Package, color: "text-gray-600", bgColor: "bg-gray-50" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const actionButtons = getActionButtons(status);
  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const isDelivered = status.toLowerCase() === "delivered";

  return (
  <div className="border-b border-white/10 p-4 mb-4 cursor-pointer bg-zinc-900 hover:shadow-black/40 transition">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-full ${statusConfig.bgColor}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
        </div>
        <div>
          <span className="font-medium text-white capitalize block">
            {status}{" "}
            <span className="text-white/40">
              • {formatDate(orderDetails?.orderedAt)}
            </span>
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="text-right">
        {isDelivered && (
          <div className="flex flex-col items-end">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onAction(order, "review");
              }}
              className="flex items-center gap-1 text-sm text-[#988BFF] hover:opacity-90 mb-2 ml-auto cursor-pointer"
            >
              <Star className="w-4 h-4" />
              <span>Rate & Review Product</span>
            </div>

            {invoiceUrl && (
              <a
                onClick={(e) => e.stopPropagation()}
                href={invoiceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-[#988BFF] hover:opacity-90 mb-2 ml-auto cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Invoice</span>
              </a>
            )}
          </div>
        )}
        <p className="text-sm text-white/40">
          Order ID:{" "}
          <span className="text-white font-medium">#{orderId}</span>
        </p>
      </div>
    </div>

    {/* Product Info */}
    <div className="flex gap-4">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Image
          src={productImage}
          alt={product?.title || "Product"}
          width={80}
          height={80}
          className="w-20 h-20 object-cover rounded-md border border-white/10"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-white mb-1">
          {product?.title || "Product Name"}
        </h3>
        <p className="text-sm text-white/60 mb-2 line-clamp-2">
          {product?.shortDescription ||
            (product?.description
              ? product.description.substring(0, 100) + "..."
              : "")}
        </p>

        <div className="flex items-center gap-4 text-sm text-white/60">
          <span>
            Qty:{" "}
            <span className="font-medium text-white">{quantity}</span>
          </span>
          <span className="font-semibold text-white">
            Rs. {total}
          </span>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    {actionButtons.length > 0 && (
      <div
        className="flex gap-2 justify-end mt-4 pt-3"
        onClick={(e) => e.stopPropagation()}
      >
        {actionButtons.map((button) => (
          <button
            key={button.type}
            onClick={() => onAction(order, button.type)}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-[5px]
              ${
                button.variant === "primary"
                  ? "bg-[#988BFF] text-black hover:opacity-90"
                  : "border border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
              }`}
          >
            {button.label}
          </button>
        ))}
      </div>
    )}
  </div>
);

  // return (
  //   <div className="border-b border-gray-500 p-4 mb-4   cursor-pointer">
  //     {/* Header */}
  //     <div className="flex items-start justify-between mb-3">
  //       <div className="flex items-center gap-2">
  //         <div className={`p-1.5 rounded-full ${statusConfig.bgColor}`}>
  //           <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
  //         </div>
  //         <div>
  //           <span className="font-medium text-gray-800 capitalize block">
  //             {status} <span>• {formatDate(orderDetails?.orderedAt)}</span>
  //           </span>
  //         </div>
  //       </div>

  //       {/* Right side */}
  //       <div className="text-right">
  //         {isDelivered && (
  //           <div className="flex flex-col items-end">
  //             <div
  //               onClick={(e) => {
  //                 e.stopPropagation(); // prevent card click
  //                 onAction(order, "review");
  //               }}
  //               className="flex items-center gap-1 text-sm text-[#988BFF] hover:text-blue-700 mb-2 ml-auto cursor-pointer"
  //             >
  //               <Star className="w-4 h-4" />
  //               <span>Rate & Review Product</span>
  //             </div>

  //             {invoiceUrl && (
  //               <a
  //                 onClick={(e) => e.stopPropagation()}
  //                 href={invoiceUrl}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="flex items-center gap-1 text-sm text-[#988BFF] hover:text-blue-700 mb-2 ml-auto cursor-pointer"
  //               >
  //                 <Download className="w-4 h-4" />
  //                 <span>Download Invoice</span>
  //               </a>
  //             )}
  //           </div>
  //         )}
  //         <p className="text-sm text-gray-500">
  //           Order ID: <span className="text-black font-medium">#{orderId}</span>
  //         </p>
  //       </div>
  //     </div>

  //     {/* Product Info */}
  //     <div className="flex gap-4">
  //       {/* Product Image */}
  //       <div className="flex-shrink-0">
  //         <Image
  //           src={productImage}
  //           alt={product?.title || "Product"}
  //           width={80}
  //           height={80}
  //           className="w-20 h-20 object-cover rounded-md border border-gray-200"
  //         />
  //       </div>

  //       {/* Product Details */}
  //       <div className="flex-1">
  //         <h3 className="font-semibold text-gray-900 mb-1">
  //           {product?.title || "Product Name"}
  //         </h3>
  //         <p className="text-sm text-gray-600 mb-2 line-clamp-2">
  //           {product?.shortDescription ||
  //             (product?.description
  //               ? product.description.substring(0, 100) + "..."
  //               : "")}
  //         </p>

  //         <div className="flex items-center gap-4 text-sm text-gray-600">
  //           <span>
  //             Qty: <span className="font-medium text-gray-900">{quantity}</span>
  //           </span>
  //           <span className="font-semibold text-gray-900">Rs. {total}</span>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Action Buttons */}
  //     {actionButtons.length > 0 && (
  //       <div
  //         className="flex gap-2 justify-end mt-4 pt-3"
  //         onClick={(e) => e.stopPropagation()} // stop card click
  //       >
  //         {actionButtons.map((button) => (
  //           <button
  //             key={button.type}
  //             onClick={() => onAction(order, button.type)}
  //             className={`px-4 py-2 text-sm font-medium transition-colors rounded-[5px]
  //               ${
  //                 button.variant === "primary"
  //                   ? "bg-blue-600 text-white hover:bg-blue-700"
  //                   : "border border-black text-black hover:bg-gray-50"
  //               }`}
  //           >
  //             {button.label}
  //           </button>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // );
};

export default OrderCard;
