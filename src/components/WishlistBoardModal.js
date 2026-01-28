"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import useAddProductToBoard from "@/hooks/useAddProductToBoard";
import useCreateBoard from "@/hooks/useCreateBoard";
import useGetBoard from "@/hooks/useGetBoard";
import { useDispatch, useSelector } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import { closeWishlistModal } from "@/redux/slices/loginmodalSlice";

const CreateBoardModal = ({ productData, onClose }) => {
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modal.wishlistModal); // Update selector to match slice

  const handleClose = () => {
    dispatch(closeWishlistModal());
    onClose(); // Call the onClose prop to reset the card's state
  };
  const user = useSelector((state) => state.user.userInfo);

  const {
    addProductToBoard,
    loading: addProductLoading,
    error: addProductError,
  } = useAddProductToBoard();
  const {
    createBoard,
    loading: createBoardLoading,
    error: createBoardError,
  } = useCreateBoard();

  const query = user?.id;
  const { data: getBoards, refetch: fetchBoards } = useGetBoard(query);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;

    setIsCreating(true);
    try {
      const userId = user?.id;
      const payload = {
        userId: parseInt(userId, 10),
        name: newBoardName.trim(),
      };

      const response = await createBoard(payload);
      setNewBoardName("");
      toast.success(response?.data?.message || "Board created successfully!");

      // refresh list
      fetchBoards();
    } catch (error) {
      const apiMessage = error?.response?.data?.message;

      if (apiMessage === "Unauthorized!") {
        toast.error("Please login to create a board");
      } else {
        toast.error(apiMessage || "Something went wrong. Please try again.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleContinue = async () => {
    if (!selectedBoard || !productData) return;

    setIsAddingProduct(true);
    try {
      const response = await addProductToBoard(selectedBoard.id, productData);

      if (response?.success) {
        toast.success(response.message || "Added to board successfully");
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        toast.error(response?.message || "Failed to add product to board");
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to add product to board");
      setTimeout(() => {
        handleClose();
      }, 2000);
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleBoardSelect = (board) => {
    setSelectedBoard((prev) => (prev?.id === board.id ? null : board));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[4px] flex items-center justify-center min-h-screen p-4">
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative bg-[#27272a] w-full max-w-3xl mx-auto flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[500px]">
        {/* Left Panel */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 md:gap-3">
                CREATE BOARD
              </h2>
              <p className="text-xs md:text-sm text-white/60">
                Create your own collection
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-white/60 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Create New Board Section */}
          <div className="mb-4 md:mb-6">
            <h3 className="text-xs md:text-sm font-medium text-white mb-2 md:mb-3">
              Create New Board
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Write Name"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 text-sm placeholder-white/50 focus:outline-none focus:border-gray-400 text-white"
                onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
              />
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim() || isCreating}
                className="px-4 py-2 bg-whte text-black text-sm font-medium bg-white flex items-center gap-1 cursor-pointer"
              >
                <Plus size={16} />
                {isCreating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>

          {/* Or Divider */}
          <div className="flex items-start justify-start mb-1 md:mb-2">
            <span className="text-xs md:text-sm text-white font-medium">
              OR
            </span>
          </div>
          {/* Existing Boards */}
          <div className="mb-4 md:mb-6">
            <h3 className="text-xs md:text-sm font-medium text-white/60 mb-2 md:mb-3">
              Select Existing Board
            </h3>
            <div className="space-y-2 max-h-[120px] md:max-h-[150px] overflow-y-auto">
              {!getBoards ? (
                <div className="text-center py-4 text-white">
                  Loading boards...
                </div>
              ) : getBoards.length === 0 ? (
                <div className="text-center py-4 text-white">
                  No boards found
                </div>
              ) : (
                getBoards.map((board) => (
                  <div
                    key={board.id}
                    onClick={() => handleBoardSelect(board)}
                    className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 border cursor-pointer transition-colors ${
                      selectedBoard?.id === board.id
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex-1">
                      <h4 className="text-xs md:text-sm font-medium text-gray-900">
                        {board.name}
                      </h4>
                    </div>
                    <span className="text-xs md:text-sm text-gray-400">
                      {board.productCount || 0}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!selectedBoard || isAddingProduct || addProductLoading}
            className="w-full bg-white text-black py-2 md:py-3 text-sm md:text-base font-medium disabled:cursor-not-allowed"
          >
            {isAddingProduct || addProductLoading
              ? "Adding Product..."
              : "Continue"}
          </button>
        </div>

        {/* Right Panel - Product Preview */}
        <div className="w-full md:w-80 bg-gray-50 p-4 flex flex-col border-t md:border-t-0 md:border-l border-gray-200">
          {productData ? (
            <div className="flex flex-col max-h-full">
              <div className="flex-shrink-0 mb-3 md:mb-4 flex items-center justify-center">
                {productData.imageUrls?.[0] ? (
                  <Image
                    src={productData.imageUrls[0]}
                    alt={productData.title || "Product Image"}
                    width={250}
                    height={250}
                    className="object-contain max-w-full max-h-[180px] md:max-h-[220px]"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                {productData.rating > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <span className="text-xs md:text-sm font-medium text-black">
                        {productData.rating}
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i < Math.floor(productData.rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>

                    {productData.reviewCount > 0 && (
                      <span className="text-xs text-gray-500">
                        | {productData.reviewCount}
                      </span>
                    )}
                  </div>
                )}

                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">
                  {typeof productData.brand === "object"
                    ? productData.brand?.name ||
                      productData.brand?.businessName ||
                      ""
                    : productData.brand}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">
                  {productData.title}
                </p>

                <div className="mt-auto">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base md:text-lg font-bold text-gray-900">
                      Rs. {productData.basePrice}
                    </span>
                    {(() => {
                      const basePrice = Number(productData.basePrice);
                      const mrp = Number(productData.mrp);

                      const showDiscount = mrp > 0 && basePrice < mrp;

                      const discountPercentage = showDiscount
                        ? Math.round(((mrp - basePrice) / mrp) * 100)
                        : 0;

                      return showDiscount ? (
                        <>
                          <span className="text-xs md:text-sm text-gray-500 line-through">
                            Rs. {mrp}
                          </span>
                          <span className="text-xs md:text-sm text-green-600 font-medium">
                            ({discountPercentage}% OFF)
                          </span>
                        </>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white">
              No product selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBoardModal;
