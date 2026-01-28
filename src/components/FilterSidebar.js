"use client";
import { useRef, useEffect, useState } from "react";

const FilterSidebar = ({
  isFilterOpen,
  setIsFilterOpen,
  brands,
  selectedBrands,
  toggleBrandSelection,
  expandedBrands,
  setExpandedBrands,
  priceRange,
  setPriceRange,
  superCategories,
  selectedSuperCategory,
  onSuperCategoryChange,
  sizes,
  selectedSizes,
  toggleSizeSelection,
  expandedSizes,
  setExpandedSizes,
  colors,
  selectedColors,
  toggleColorSelection,
  expandedColors,
  setExpandedColors,
  onApplyFilters,
  onClearFilters,
  isLoading,
}) => {
  const filterRef = useRef(null);
  const [tempPriceMin, setTempPriceMin] = useState(priceRange.min);
  const [tempPriceMax, setTempPriceMax] = useState(priceRange.max);

  // CLOSE FILTER PANEL ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isFilterOpen &&
        filterRef.current &&
        !filterRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen, setIsFilterOpen]);

  return (
    <>
      {/* BACKDROP BLUR */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/10 bg-opacity-50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        ></div>
      )}

      {/* FILTER SIDEBAR */}
      <div
        ref={filterRef}
        className={`
          fixed lg:static top-0 left-0 h-full lg:h-auto 
          w-72 bg-zinc-900 p-6 border-r border-gray-400 overflow-y-auto z-50 md:z-8  
          transform transition-transform duration-300
          ${
            isFilterOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <button
          className="lg:hidden mb-4 text-white hoveer:text-white/70 font-bold text-lg"
          onClick={() => setIsFilterOpen(false)}
        >
          ✕ Close
        </button>

        <h2 className="text-xl font-bold mb-6 uppercase tracking-wide text-white">
          Filters
        </h2>

        {/* Super Category Filter */}
        {superCategories && superCategories.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              Category
            </h3>
            <div className="space-y-2">
              {superCategories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center space-x-2 text-sm text-white/70"
                >
                  <input
                    type="radio"
                    name="superCategory"
                    value={cat.id}
                    checked={selectedSuperCategory === cat.id}
                    onChange={() => onSuperCategoryChange(cat.id)}
                    className="w-4 h-4 accent-[#988BFF]"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Brand Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-2">Brand</h3>
          <div className="space-y-2">
            {brands
              .slice(0, expandedBrands ? brands.length : 5)
              .map((brand) => (
                <label
                  key={brand.id}
                  className="flex items-center space-x-2 text-sm text-white/70"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.id)}
                    onChange={() => toggleBrandSelection(brand.id)}
                    className="w-4 h-4 accent-[#988BFF]"
                  />
                  <span>{brand.name}</span>
                </label>
              ))}
          </div>
          {brands.length > 5 && (
            <button
              onClick={() => setExpandedBrands(!expandedBrands)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              {expandedBrands ? "View Less" : "View More"}
            </button>
          )}
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-2">
            Price Range
          </h3>

          <div className="space-y-3">
            {/* Min Price Input */}
            <div>
              <label className="text-sm text-white/70 mb-1 block">
                Min Price
              </label>
              <input
                type="number"
                value={tempPriceMin}
                onChange={(e) => setTempPriceMin(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-black"
              />
            </div>

            {/* Max Price Input */}
            <div>
              <label className="text-sm text-white/70 mb-1 block">
                Max Price
              </label>
              <input
                type="number"
                value={tempPriceMax}
                onChange={(e) => setTempPriceMax(e.target.value)}
                placeholder="10000"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-black"
              />
            </div>

            {/* Apply Button */}
            <button
              onClick={() => {
                setPriceRange({ min: tempPriceMin, max: tempPriceMax });
                onApplyFilters();
              }}
              disabled={isLoading}
              className="w-full bg-black text-white py-2 rounded cursor-pointer disabled:opacity-50 hover:bg-gray-800 transition-colors font-semibold text-sm"
            >
              Apply Price Range
            </button>
          </div>
        </div>

        {/* Size Filter */}
        {sizes && sizes.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">Size</h3>
            <div className="space-y-2">
              {sizes.slice(0, expandedSizes ? sizes.length : 5).map((size) => (
                <label
                  key={size}
                  className="flex items-center space-x-2 text-sm text-white/70"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => toggleSizeSelection(size)}
                    className="w-4 h-4 accent-[#988BFF]"
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
            {sizes.length > 5 && (
              <button
                onClick={() => setExpandedSizes(!expandedSizes)}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                {expandedSizes ? "View Less" : "View More"}
              </button>
            )}
          </div>
        )}

        {/* Color Filter */}
        {colors && colors.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">Color</h3>
            <div className="space-y-2">
              {colors
                .slice(0, expandedColors ? colors.length : 5)
                .map((color) => (
                  <label
                    key={color}
                    className="flex items-center space-x-2 text-sm text-white/70"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColorSelection(color)}
                      className="w-4 h-4 accent-[#988BFF]"
                    />
                    <span>{color}</span>
                  </label>
                ))}
            </div>
            {colors.length > 5 && (
              <button
                onClick={() => setExpandedColors(!expandedColors)}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                {expandedColors ? "View Less" : "View More"}
              </button>
            )}
          </div>
        )}

        <button
          onClick={onClearFilters}
          disabled={isLoading}
          className="w-full border border-gray-300 py-2 rounded text-white cursor-pointer disabled:opacity-50"
        >
          Clear Filters
        </button>
      </div>
    </>
  );
};

export default FilterSidebar;
