"use client";
import ProductCollectionCard from "@/components/homepage/CollectionCard";
import useCollection from "@/hooks/useCollection";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BannerGrid from "@/components/collections/BannerGrid";

const MenCollectionSection = () => {
  const query = "gender=1&displayFor=men&mode=quick&city=Delhi";
  const { data: collections,loading } = useCollection(query);
  const [displayedProductsCount, setDisplayedProductsCount] = useState({});

  const handleExploreMore = (collectionId) => {
    setDisplayedProductsCount((prev) => ({
      ...prev,
      [collectionId]: (prev[collectionId] || 8) + 8,
    }));
  };

  return (
    <div className="px-0 bg-[#27272a]">
      <div className="w-full py-4 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10">
        {collections?.map((collection) => {
          const productsToShow = displayedProductsCount[collection.id] || 8;
          const visibleProducts = collection.products?.slice(0, productsToShow);
          const hasMoreProducts = collection.products?.length > productsToShow;

          // Don't show section if no products
          if (!collection.products || collection.products.length === 0) {
            return null;
          }

          // Get banners from collection data
          const banners = collection.banners || [];
          const bannerCount = banners.length;

          return (
            <section key={collection.id} className="mb-16">
              {/* Section Title */}
              <h2 className="text-[20px] md:text-4xl font-bold text-center text-white mb-12 tracking-wide">
                {collection.name} {/* dynamic title */}
              </h2>
              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[20px] justify-items-center">
                {visibleProducts?.map((product, index) => {
                  const isLast =
                    index === visibleProducts.length - 1 &&
                    visibleProducts.length === 8;

                  if (isLast) {
                    return (
                      <div key={product.id} className="w-full">
                        <div className="relative w-full aspect-[2/3] max-h-[400px] rounded-lg overflow-hidden">
                          {/* Product Image + Overlay */}
                          <Image
                            src={product.imageUrls?.[0]}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                          <Link
                            href={`/products?collectionId=${collection.id}&mode="quick"&city=Delhi`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg md:text-xl hover:bg-black/60 backdrop-blur-[1px] transition-colors"
                          >
                            Explore All →
                          </Link>
                        </div>
                      </div>
                    );
                  }

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
                    <ProductCollectionCard
                      key={product.id}
                      product={transformedProduct}
                      onLike={() => {}}
                    />
                  );

                  // Commented out - Original ProductCollectionCard rendering
                  // return (
                  //   <ProductCollectionCard
                  //     key={product.id}
                  //     product={transformedProduct}
                  //     onLike={() => {}}
                  //   />
                  // );
                })}
              </div>
              {/* Explore More Button */}
              {/* {hasMoreProducts && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => handleExploreMore(collection.id)}
                    className="px-8 py-3 bg-black text-white font-medium rounded hover:bg-gray-800 transition cursor-pointer"
                  >
                    Explore More
                  </button>
                </div>
              )} */}
              {/* Banners Section */}
              {bannerCount > 0 && (
                <div className="mt-8 sm:mt-10 md:mt-12 -mx-4 sm:-mx-6 md:-mx-10">
                  <BannerGrid
                    banners={banners}
                    bannerCount={bannerCount}
                    displayFor="men"
                  />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default MenCollectionSection;
