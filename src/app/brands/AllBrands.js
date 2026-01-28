"use client";
import React from "react";
import BrandDirectory from "@/components/BrandDirectory";
import usegetBrands from "@/hooks/useGetBrands";

const AllBrands = () => {
  const { brands, loading } = usegetBrands("Delhi");

  // Transform API data to match BrandDirectory props
  const formattedBrands =
    brands?.map((brand) => ({
      id: brand?.id || "",
      name: brand?.name || "",
      logo: brand?.logo || null,
    })) || [];

  return (
    <div className="min-h-screen bg-[#27272a] pt-[130px]  ">
      <BrandDirectory brands={formattedBrands} />
    </div>
  );
};

export default AllBrands;
