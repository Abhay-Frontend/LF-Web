"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ShopByCategory({ categories: externalCategories }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const categories = externalCategories || [
    {
      id: 1,
      name: "Men",
      image: "/images/men.png",
      href: "/shop/men",
    },
    {
      id: 2,
      name: "Women",
      image: "/images/women.png",
      href: "/shop/women",
    },
    {
      id: 3,
      name: "Essentials",
      image: "/images/Accesories.png",
      href: "/shop/accessories",
    },
  ];

  const getCardWidth = (index) => {
    if (hoveredIndex === null) return "flex-1";
    if (hoveredIndex === index) return "flex-[2]";
    return "flex-[0.6]";
  };

  return (
    <div className="w-full max-h-screen bg-[#27272a] px-4 sm:px-8 md:px-10 pt-10  md:pt-[20px] lg:pt-[50px] pb-8 p-[20px] ">
      <div className="mb-6 sm:mb-8 md:mb-10">
        <h1 className="text-white text-2xl  md:text-[38px] font-semibold uppercase">
          Shop by Category
        </h1>
      </div>

      <div className="flex gap-2 sm:gap-3 md:gap-5 h-64 sm:h-80 md:h-[400px] lg:h-[450px]">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={category.href}
            className={`${getCardWidth(
              index
            )} relative rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[20px] overflow-hidden transition-all duration-500 ease-in-out cursor-pointer group bg-zinc-800`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Image */}
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 sm:opacity-40 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />

            {/* Category Label */}
            <div
              className={`absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-10 left-4 sm:left-6 md:left-8 flex items-center gap-1 md:gap-2 transition-all duration-500 md:opacity-0 md:translate-y-4 ${
                hoveredIndex === index
                  ? "md:opacity-100 md:translate-y-0 opacity-100"
                  : "opacity-100 md:group-hover:opacity-100 md:group-hover:translate-y-0"
              }`}
            >
              <h2 className="text-white text-[10px] md:text-3xl  font-semibold uppercase">
                {category.name}
              </h2>

              {/* Arrow is now visual-only */}
              <div className="w-5  md:w-10 h-5  md:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10 group-hover:bg-white/20 transition">
                <ArrowRight className="w-4 md:w-6 h-4 md:h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
