"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";

const ProductImageGallery = ({ images = [], hasColorVariants = false }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full bg-gray-50 rounded-lg overflow-hidden h-[500px] md:h-[800px]">
        {images?.[selectedImage] ? (
          <Image
            src={images[selectedImage]}
            alt={`Product ${selectedImage + 1}`}
            fill
            className="w-full h-auto object-fit"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-300" />
        )}
      </div>
      {/* Thumbnail Grid - Hidden when both size and color variants exist */}
      {!hasColorVariants && images?.length > 0 && (
        <div className={images.length > 4 ? "overflow-x-auto" : ""}>
          <div
            className={`${
              images.length > 4 ? "flex gap-3" : "grid grid-cols-4 gap-3"
            }`}
          >
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative bg-gray-50 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === idx ? "border-black" : "border-transparent"
                } ${images.length > 4 ? "flex-shrink-0 w-24 h-24" : ""}`}
              >
                {img ? (
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={100}
                    height={100}
                    className="w-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
