import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useFilterProducts from "@/hooks/useFilters";

const useFilterLogic = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get initial filter params from URL
  const brandParam = searchParams.get("brands");
  const minPriceParam = searchParams.get("minPrice") || "0";
  const maxPriceParam = searchParams.get("maxPrice") || "10000";

  // State
  const [selectedBrands, setSelectedBrands] = useState(
    brandParam ? brandParam.split(",") : []
  );
  const [priceRange, setPriceRange] = useState({
    min: minPriceParam,
    max: maxPriceParam,
  });
  const [expandedBrands, setExpandedBrands] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(
    brandParam || minPriceParam !== "0" || maxPriceParam !== "10000"
  );
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const filterProducts = useFilterProducts(payload);

  // Toggle brand selection
  const toggleBrandSelection = (brandId) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId)
        ? prev.filter((id) => id !== brandId)
        : [...prev, brandId]
    );
  };

  // Reapply filters when page is refreshed with filter params in URL
  useEffect(() => {
    const hasBrand = brandParam && brandParam.length > 0;
    const hasPrice = minPriceParam !== "0" || maxPriceParam !== "10000";

    if (hasBrand || hasPrice) {
      const payload = {
        brandIds: brandParam ? brandParam.split(",") : [],
        minPrice: minPriceParam,
        maxPrice: maxPriceParam,
      };

      (async () => {
        setIsFilterLoading(true);
        try {
          const result = await filterProducts(payload);
          setFilteredProducts(result || []);
        } finally {
          setIsFilterLoading(false);
        }
      })();
    }
  }, [brandParam, minPriceParam, maxPriceParam]);

  // Apply filters and update URL
  const handleApplyFilters = async () => {
    setIsFilterLoading(true);

    const params = new URLSearchParams(window.location.search);

    // Brand
    if (selectedBrands.length > 0) {
      params.set("brands", selectedBrands.join(","));
    } else {
      params.delete("brands");
    }

    // Price
    if (priceRange.min !== "0") params.set("minPrice", priceRange.min);
    else params.delete("minPrice");

    if (priceRange.max !== "10000") params.set("maxPrice", priceRange.max);
    else params.delete("maxPrice");

    // Remove subcategory but keep sort param
    params.delete("subCategoryId");

    router.push(`/products?${params.toString()}`);

    const payload = {
      brandIds: selectedBrands,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    };

    try {
      const result = await filterProducts(payload);
      setFilteredProducts(result || []);
      setIsFilterApplied(true);
    } finally {
      setIsFilterLoading(false);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    router.push(`/products`);
    setSelectedBrands([]);
    setPriceRange({ min: "0", max: "10000" });
    setFilteredProducts([]);
    setIsFilterApplied(false);
  };

  return {
    // State
    selectedBrands,
    setSelectedBrands,
    priceRange,
    setPriceRange,
    expandedBrands,
    setExpandedBrands,
    filteredProducts,
    isFilterApplied,
    isFilterLoading,

    // Methods
    toggleBrandSelection,
    handleApplyFilters,
    handleClearFilters,
  };
};

export default useFilterLogic;
