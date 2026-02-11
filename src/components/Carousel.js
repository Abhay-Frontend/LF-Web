"use client";
import React from "react";
import Image from "next/image";

const BannerCarousel = ({ image }) => {
  return (
    <div className="w-full bg-white relative">
      <div className="w-full">
        <div className="relative h-[140px] md:h-[400px]  w-full overflow-hidden">
          {image && image!=="" && (
            <Image
            src={image}
            alt="Banner"
            fill
            className="object-fill w-full h-full"
            loading="lazy"
            sizes="100vw"
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerCarousel;
