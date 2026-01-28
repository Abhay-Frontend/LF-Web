"use client";
import Link from "next/link";
import ProductCollectionCard from "@/components/homepage/CollectionCard";
import useProducts from "@/hooks/useProducts";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

const NewInSection = () => {
  const query = "gender=1";
  const fetchproducts = useProducts(query);
  const { products = [] } = useProducts(query);
  const topProducts = products.slice(0, 8);

  return (
    <section className="py-10 px-4 bg-[#27272a]">
      <div className="w-full md:p-[20px] lg:p-[50px]">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-12 tracking-wide">
          NEW IN
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[20px] justify-items-center">
          {topProducts.map((product, index) => {
            const isLast = index === topProducts.length - 1;

            if (isLast) {
              return (
                <div key={product.id} className="w-full">
                  <div className="relative w-full aspect-[2/3] md:max-h-[400px]  rounded-lg overflow-hidden">
                    {/* Product Image + Overlay */}
                    <Image
                      src={product.imageUrls?.[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    <Link
                      href="/products?superCatId=1" // explore page
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

            // Default card
            return (
              <ProductCollectionCard
                key={product.id}
                product={transformedProduct}
                onLike={() => {}}
              />
            );
          })}
        </div>
      </div>
      {/* Toaster Component */}
      <Toaster />
    </section>
  );
};

export default NewInSection;
