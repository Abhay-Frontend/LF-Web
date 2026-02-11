"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axiosHttp from "@/utils/axioshttp";
import Link from "next/link";
import { addSearch } from "@/redux/slices/searchSlice";

export default function NavbarSearchComponent({
  searchQuery,
  setSearchQuery,
  isOpen,
  setIsOpen,
}) {
  const searchDropdownRef = useRef(null);
  const recentSearches = useSelector((state) => state.search.recentSearches);
  const dispatch = useDispatch();
  const router = useRouter();

  const [suggestions, setSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const trendingSearches = [
    "Poplin Shirts",
    "Sweater Vests",
    "Tank Tops",
    "Muscle Tanks",
    "Thermal Shirts",
  ];

  // Fetch suggestions on search query change
  useEffect(() => {
    if (!searchQuery.trim()) return setSuggestions([]);

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const res = await axiosHttp.post(
          `product-suggestion?key=${searchQuery}`
        );
        setSuggestions(res.data.data || []);
      } catch (error) {
        setSuggestions([]);
      }
      setIsLoadingSuggestions(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const anchorRef = useRef(null);
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsOpen(false);
      dispatch(addSearch(searchQuery.trim()));
      // Programmatically click the anchor to navigate
      if (anchorRef.current) {
        anchorRef.current.click();
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const trimmedSuggestion = suggestion.trim();
    setIsOpen(false);
    dispatch(addSearch(trimmedSuggestion));
    // Navigation is now handled by anchor tag, so no router.push
  };

  if (!isOpen) return null;

  return (
    <div className="w-full max-h-screen bg-[#27272a] z-[1000] fixed top-15 left-0">
      {/* Search Input Area */}
      <div className="w-full h-auto min-h-20 md:h-24 px-4 sm:px-8 md:px-12 lg:px-16 py-4 md:py-7  inline-flex justify-between items-center">
        <div className="flex-1 flex justify-start items-center gap-4 md:gap-8 lg:gap-32">
          <div className="hidden sm:flex justify-start items-center gap-4 md:gap-14">
            <Link href="/" className="mt-[2px] md:mt-0 flex items-center gap-1">
            <div className="flex items-center gap-2">
               <Image
                src="/images/logo_white.png"
                alt="Logo"
                width={200}
                height={160}
              />
            </div>
             
            </Link>
          </div>
          <div className="flex-1 py-0.5 border-b border-white flex justify-between items-center gap-2">
            <div className="flex-1 flex justify-start items-center gap-1 sm:gap-2">
              <div className="flex justify-start items-center gap-2 sm:gap-5">
                <div className="flex justify-start items-center gap-2 sm:gap-4">
                  <div className="w-6 h-6 sm:w-9 sm:h-9 relative rounded">
                    <Search className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search To Explore More"
                className="text-left justify-start text-white placeholder-white/40
                            text-xs sm:text-sm font-medium uppercase leading-4
                            border-none outline-none bg-transparent flex-1 min-w-0"
                autoFocus
              />
              {/* Hidden anchor for Enter key navigation */}
              <a
                href={
                  searchQuery.trim()
                    ? `/products?key=${searchQuery.trim()}`
                    : "#"
                }
                ref={anchorRef}
                style={{ display: "none" }}
                tabIndex={-1}
                aria-hidden="true"
              >
                Go
              </a>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-center justify-start text-white hover:text-white/70 text-xs sm:text-sm font-semibold uppercase leading-4 cursor-pointer whitespace-nowrap"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Area */}
      <div
        ref={searchDropdownRef}
        className="w-full px-4 sm:px-8 md:px-16 lg:px-32 xl:px-44 pt-4 sm:pt-7 pb-8 sm:pb-14 bg-zinc-800 inline-flex justify-center items-start gap-6 md:gap-10"
      >
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-3.5">
          <div className="self-stretch flex flex-col md:inline-flex md:flex-row justify-start items-start gap-6 md:gap-0">
            {/* Recent Searches */}
            <div className="w-full md:w-auto md:pr-8 inline-flex flex-col justify-start items-start gap-3.5">
              <div className="justify-start text-white/70 text-xs sm:text-sm font-normal">
                {suggestions.length > 0 ? "Suggestions" : "Recent Searches"}
              </div>
              <div className="w-full md:max-w-[500px] inline-flex justify-start items-start gap-2 sm:gap-3.5 flex-wrap content-start">
                {isLoadingSuggestions ? (
                  <div className="justify-start text-white/70 text-xs sm:text-sm font-normal">
                    Loading...
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((suggestion, index) => (
                    <a
                      key={index}
                      href={`/products?key=${suggestion.trim()}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="group h-auto sm:h-7 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-zinc-700 rounded flex justify-center items-center gap-1 cursor-pointer hover:bg-zinc-600 transition-colors transition-all duration-200"
                    >
                      <div className="flex justify-center items-start gap-2.5">
                        <div className="justify-start text-white/70 group-hover:text-[#7A6ECC] text-xs sm:text-sm font-normal">
                          {suggestion}
                        </div>
                      </div>
                    </a>
                  ))
                ) : recentSearches.length > 0 ? (
                  recentSearches.map((search, index) => (
                    <a
                      key={index}
                      href={`/products?key=${search.trim()}`}
                      onClick={() => handleSuggestionClick(search)}
                      className="group h-auto sm:h-7 px-2 sm:px-2.5 py-1 sm:py-1.5 bg-zinc-700 rounded flex justify-center items-center gap-1 cursor-pointer hover:bg-zinc-600 transition-colors transition-all duration-200"
                    >
                      <div className="flex justify-center items-start gap-2.5">
                        <div className="justify-start text-white/70 group-hover:text-[#7A6ECC] text-xs sm:text-sm font-normal">
                          {search}
                        </div>
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="justify-start text-white/70 text-xs sm:text-sm font-normal">
                    No recent searches
                  </div>
                )}
              </div>
            </div>

            {/* Trending Searches */}
            <div className="w-full md:w-auto md:pl-8 md:border-l-[0.50px] border-white/20 inline-flex flex-col justify-start items-start gap-3.5">
              <div className="justify-start text-white/70 text-xs sm:text-sm font-normal">
                Trending Searches
              </div>
              <div className="inline-flex justify-start items-start gap-1">
                <div className="w-full sm:w-56 self-stretch px-3 sm:px-4 py-2.5 sm:py-3.5 bg-zinc-700 flex justify-start items-start gap-2.5">
                  <div className="flex-1 inline-flex flex-col justify-start items-start gap-3.5">
                    <div className="flex flex-col justify-start items-start gap-1.5">
                      {trendingSearches.map((item, index) => (
                        <a
                          key={index}
                          href={`/products?key=${item.trim()}`}
                          onClick={() => handleSuggestionClick(item)}
                          className="group inline-flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-70 transition-opacity"
                        >
                          <div className="justify-start group-hover:text-[#7A6ECC] text-white/70 text-xs sm:text-sm font-normal">
                            {item}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
