"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCollectionCard from "@/components/homepage/CollectionCard";
import ViewAllCard from "@/components/homepage/ViewAllCard";
import useCollection from "@/hooks/useCollection";
import BannerGrid from "@/components/collections/BannerGrid";

const TrendingNowSection = () => {
  const {
    data: collections,
    loading,
    error,
  } = useCollection("displayFor=homepage&mode=quick&city=Delhi");
  const [currentPages, setCurrentPages] = useState({});
  const [sortOrders, setSortOrders] = useState({}); // Track sort order per collection
  const [showSortDropdown, setShowSortDropdown] = useState({}); // Track dropdown visibility per collection

  // Pagination: 4 products, then 4, then 3 (total 11)
  const pageItemCounts = [4, 4, 3];

  const handlePrevPage = (collectionId) => {
    setCurrentPages((prev) => ({
      ...prev,
      [collectionId]: Math.max((prev[collectionId] || 0) - 1, 0),
    }));
  };

  const handleNextPage = (collectionId, totalPages) => {
    setCurrentPages((prev) => ({
      ...prev,
      [collectionId]: Math.min((prev[collectionId] || 0) + 1, totalPages - 1),
    }));
  };

  const handleSortChange = (collectionId, sortOption) => {
    setSortOrders((prev) => ({
      ...prev,
      [collectionId]: sortOption,
    }));
    setShowSortDropdown((prev) => ({
      ...prev,
      [collectionId]: false,
    }));
  };

  const toggleSortDropdown = (collectionId) => {
    setShowSortDropdown((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));
  };

  const sortProducts = (products, sortOrder) => {
    if (!sortOrder || sortOrder === "default") return products;

    const sortedProducts = [...products];
    if (sortOrder === "lowToHigh") {
      return sortedProducts.sort((a, b) => {
        const priceA = a.basePrice || a.price || 0;
        const priceB = b.basePrice || b.price || 0;
        return priceA - priceB;
      });
    } else if (sortOrder === "highToLow") {
      return sortedProducts.sort((a, b) => {
        const priceA = a.basePrice || a.price || 0;
        const priceB = b.basePrice || b.price || 0;
        return priceB - priceA;
      });
    }
    return sortedProducts;
  };

  if (loading) {
    return (
      <div className="bg-[#27272a] py-16 px-4 sm:px-6 md:px-10">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/10 border-t-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#27272a] py-16 px-4 sm:px-6 md:px-10">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-red-500">
            Error loading collections. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#27272a]">
      {collections?.map((collection, collectionIndex) => {
        // Don't show section if no products
        if (!collection.products || collection.products.length === 0) {
          return null;
        }

        const currentPage = currentPages[collection.id] || 0;
        const totalPages = pageItemCounts.length;
        const totalProducts = collection.products.length;
        const shouldDisableChevrons = totalProducts <= 5;

        // Apply sorting before pagination
        const sortOrder = sortOrders[collection.id] || "default";
        const sortedProducts = sortProducts(collection.products, sortOrder);

        // Calculate start and end indices based on cumulative item counts
        let startIndex = 0;
        for (let i = 0; i < currentPage; i++) {
          startIndex += pageItemCounts[i];
        }
        const endIndex = startIndex + (pageItemCounts[currentPage] || 0);

        const displayedProducts = sortedProducts.slice(startIndex, endIndex);

        // Get banners from collection data
        const banners = collection.banners || [];
        const bannerCount = banners.length;

        return (
          <section
            key={collection.id}
            className="py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10"
          >
            {/* Header */}
            <div className="flex flex-row justify-between items-center gap-2 sm:gap-4 mb-8 sm:mb-10">
              <h1 className="text-[13px]  md:text-[35px] font-semibold uppercase text-white max-w-[200px] md:max-w-[500px] ">
                {collection.name}
              </h1>

              <div className="flex gap-2 sm:gap-3 ml-auto">
                {/* Sort By Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => toggleSortDropdown(collection.id)}
                    className="h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-zinc-900 rounded-lg sm:rounded-xl outline outline-1 outline-offset-[-1px] outline-white/10 inline-flex justify-center items-center gap-1 sm:gap-1.5 cursor-pointer"
                  >
                    <div className="flex flex-row justify-start items-center gap-1 sm:gap-1.5">
                      <div className="text-center justify-start text-white text-xs sm:text-sm md:text-base font-medium leading-tight sm:leading-5 tracking-wide whitespace-nowrap">
                        {sortOrders[collection.id] === "lowToHigh"
                          ? "Price: Low to High"
                          : sortOrders[collection.id] === "highToLow"
                          ? "Price: High to Low"
                          : "Sort By"}
                      </div>
                      <Image
                        src="/images/sort.svg"
                        alt="Sort"
                        width={14}
                        height={14}
                        className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                      />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showSortDropdown[collection.id] && (
                    <div className="absolute top-full mt-2 right-0 bg-zinc-900 border border-white/10 rounded-lg shadow-lg z-10 min-w-[200px]">
                      <button
                        onClick={() =>
                          handleSortChange(collection.id, "default")
                        }
                        className="w-full px-4 py-3 text-left text-sm md:text-base text-white hover:bg-black/20 transition"
                      >
                        Default
                      </button>
                      <button
                        onClick={() =>
                          handleSortChange(collection.id, "lowToHigh")
                        }
                        className="w-full px-4 py-3 text-left text-sm md:text-base text-white hover:bg-black/20 transition border-t border-white/10"
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() =>
                          handleSortChange(collection.id, "highToLow")
                        }
                        className="w-full px-4 py-3 text-left text-sm md:text-base text-white hover:bg-black/20 transition border-t border-white/10"
                      >
                        Price: High to Low
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handlePrevPage(collection.id)}
                  disabled={currentPage === 0 || shouldDisableChevrons}
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-white/10 rounded-full flex items-center justify-center cursor-pointer transition text-sm sm:text-base ${
                    currentPage === 0 || shouldDisableChevrons
                      ? "text-white/40"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <ChevronLeft
                    size={16}
                    className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                  />
                </button>

                <button
                  onClick={() => handleNextPage(collection.id, totalPages)}
                  disabled={
                    currentPage === totalPages - 1 || shouldDisableChevrons
                  }
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-white/10 rounded-full flex items-center justify-center cursor-pointer transition text-sm sm:text-base ${
                    currentPage === totalPages - 1 || shouldDisableChevrons
                      ? "text-white/40"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <ChevronRight
                    size={16}
                    className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                  />
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row sm:flex-nowrap gap-3 sm:gap-4 md:gap-6">
              {displayedProducts.map((product) => {
                // Extract variant sizes from variants array
                const availableSizes = product.variants
                  ? product.variants
                      .map((variant) => {
                        let options = [];
                        try {
                          if (typeof variant.selectedOptions === "string") {
                            options = JSON.parse(variant.selectedOptions);
                          } else if (Array.isArray(variant.selectedOptions)) {
                            options = variant.selectedOptions;
                          }
                        } catch (e) {
                          options = [];
                        }
                        const sizeOption = options.find(
                          (opt) => opt.name === "Size"
                        );
                        return sizeOption?.value || "";
                      })
                      .filter(Boolean)
                  : [];

                // Transform the product data to match CollectionCard requirements
                const transformedProduct = {
                  id: product.id,
                  name: product.title || product.name,
                  brand: product.brand?.name || product.brand,
                  price: product.basePrice || product.price,
                  originalPrice: product.mrp,
                  description: product.description || "",
                  images: product.imageUrls || [product.image],
                  hasOverlay: product.hasOverlay || false,
                  variants: product.variants || [],
                  availableSizes: availableSizes,
                };

                return (
                  <div key={product.id} className="w-full">
                    <ProductCollectionCard product={transformedProduct} />
                  </div>
                );
              })}

              {currentPage === totalPages - 1 && (
                <div className="w-full">
                  <ViewAllCard
                    onClick={() => {
                      window.open(
                        `/products?collectionId=${collection.id}&mode=quick&city=Delhi`,
                        "_blank"
                      );
                    }}
                  />
                </div>
              )}
            </div>

            {/* Banners Section */}
            {bannerCount > 0 && (
              <div className="mt-8 sm:mt-10 md:mt-12 -mx-4 sm:-mx-6 md:-mx-10">
                <BannerGrid
                  banners={banners}
                  bannerCount={bannerCount}
                  displayFor="homepage"
                />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default TrendingNowSection;
