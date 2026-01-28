"use client";
import React, { useState, useEffect, useRef } from "react";
import useCategories from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";

const ShopCategories = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef(null);
  const query = "type=category&gender=2";
  const fetchCategories = useCategories(query);

  useEffect(() => {
    if (fetchCategories && fetchCategories.length > 0) {
      setIsLoading(false);
    }
  }, [fetchCategories]);

  useEffect(() => {
    checkScrollButtons();
  }, [fetchCategories, isLoading]);

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 300;
      const newScrollLeft =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(checkScrollButtons, 300);
    }
  };

  const CategorySkeleton = () => (
    <div className="flex flex-col items-center min-w-[140px] md:min-w-[215px]">
      <div className="w-[120px] h-[120px] md:w-[195px] md:h-[195px] bg-zinc-700 rounded-full animate-pulse"></div>
      <div className="h-4 bg-zinc-600 rounded w-3/4 mt-4 animate-pulse"></div>
    </div>
  );

  const showArrows =
    !isLoading && fetchCategories && fetchCategories.length > 6;

  return (
    <section className="w-full py-8  bg-[#27272a]">
      <div className=" px-2 md:px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider">
            SHOP BY CATEGORIES
          </h2>
        </div>

        {/* Categories Container with Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          {showArrows && canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200"
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="black"
                className="w-5 h-5 md:w-6 md:h-6 cursor-pointer text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          {/* Scrollable Categories */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollButtons}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-8 md:px-12"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <CategorySkeleton key={index} />
                ))
              : fetchCategories.map((category) => (
                  <Link
                    href={`/categories?catId=${category.id}`}
                    key={category.id}
                    className="flex flex-col items-center min-w-[140px] md:min-w-[215px]"
                  >
                    <div className="relative group cursor-pointer transform transition-transform duration-300">
                      <div className="w-[120px] h-[120px] md:w-[195px] md:h-[195px] rounded-full overflow-hidden bg-zinc-800">
                        <Image
                          src={category.image || "/placeholder.png"}
                          alt={category.name}
                          width={250}
                          height={250}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    {/* Category Name */}
                    <h3 className="text-white text-center font-semibold text-sm md:text-base lg:text-lg mt-4 px-4 leading-tight">
                      {category.name}
                    </h3>
                  </Link>
                ))}
          </div>

          {/* Right Arrow */}
          {showArrows && canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 md:p-3 transition-all duration-200"
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="black"
                className="w-5 h-5 md:w-6 md:h-6 cursor-pointer text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Add this style tag to hide scrollbar */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
};

export default ShopCategories;
