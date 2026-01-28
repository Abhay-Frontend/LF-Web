"use client";
import Link from "next/link";

const SortSelector = ({
  searchQuery,
  onSortChange,
  isSortLoading,
  selectedSort,
}) => {
  const sortOptions = [
    { value: "", label: "All Products" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Customer Rating" },
    { value: "discount", label: "Discount" },
    { value: "newest", label: "Newest First" },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {!searchQuery && (
          <>
            <span className="text-sm text-white">Sort by:</span>
            <select
              onChange={onSortChange}
              value={selectedSort || ""}
              disabled={isSortLoading}
              className="text-sm bg-zinc-900 text-white/70 border border-gray-300 rounded px-3 py-1 disabled:opacity-50"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {selectedSort && (
              <span className="text-xs bg-black text-white px-2 py-1 rounded">
                {sortOptions.find((opt) => opt.value === selectedSort)?.label}
              </span>
            )}
          </>
        )}
      </div>

      {searchQuery && (
        <Link
          href="/products"
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Clear search
        </Link>
      )}
    </div>
  );
};

export default SortSelector;
