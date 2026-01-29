"use client";
import ListingCard from "@/components/ListingCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useCategoryProducts from "@/hooks/useSubCategoryHierarchy";

const CategoryPage = () => {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("catId"); // <-- get id from URL

  const { categoryProducts, isCategoryLoading } =
    useCategoryProducts(categoryId);

  // Show loader while data is being fetched
  if (isCategoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Return null only if loading is complete but no data exists
  if (!isCategoryLoading && !categoryProducts) {
    return null;
  }

  return (
    <div className="bg-[#27272a]">
      <div className="w-full md:px-[100px] md:py-0 px-4 p-12  mt-[120px] md:mt-[128px]  ">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-lg md:text-3xl font-bold text-white mb-2">
            {categoryProducts.name}
          </h1>
        </div>

        {/* Subcategories */}
        <div className="space-y-12">
          {categoryProducts.children
            ?.filter((subcategory) => subcategory.products?.length > 0)
            .map((subcategory) => {
              const firstFiveProducts = subcategory.products?.slice(0, 5);

              return (
                <div
                  key={subcategory.id}
                  className="border-b border-gray-200 pb-12 last:border-b-0"
                >
                  {/* Subcategory Name */}
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-lg md:text-2xl font-semibold text-white uppercase tracking-wide">
                      {subcategory.name}
                    </h2>

                    {/* Desktop View All */}
                    {subcategory.products?.length > 5 && (
                      <Link
                        href={`/products?subCatId=${subcategory.id}`}
                        className="hidden lg:block text-white border-b border-[#808080] text-sm "
                      >
                        View All →
                      </Link>
                    )}
                  </div>

                  {/* Products */}
                  {firstFiveProducts?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-5  md:grid-cols-4 lg:grid-cols-5 md:gap-5">
                      {firstFiveProducts.map((product) => (
                        <ListingCard
                          key={product.id}
                          id={product.id}
                          imageUrls={product.imageUrls}
                          title={product.title}
                          brand={product.brand?.name || ""}
                          rating={product.rating}
                          reviewCount={product.numReviews}
                          basePrice={product.basePrice}
                          mrp={product.mrp}
                          discountPercentage={
                            product.mrp && product.basePrice
                              ? Math.round(
                                  ((product.mrp - product.basePrice) /
                                    product.mrp) *
                                    100
                                )
                              : null
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-white text-lg">
                        No products available in this subcategory
                      </p>
                    </div>
                  )}

                  {/* Mobile View All */}
                  {subcategory.products?.length > 5 && (
                    <div className="mt-4 text-center lg:hidden">
                      <Link
                        href={`/products?subCatId=${subcategory.id}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        View All Products
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
