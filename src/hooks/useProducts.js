import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints";
import { useEffect, useState, useCallback } from "react";

const useProducts = ({query,city,mode}={}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getProducts = useCallback(
    async (pageNumber = 1, isLoadMore = false) => {
      //quick guard
      if(!city && mode!=="quick"){
        setLoading(false);
        setHasMore(false);
        setProducts([]);
        return;
      }
      // Skip if query is null (search or subCategory is active)
      if (query === undefined) {
        setLoading(false);
        setHasMore(false);
        setProducts([]);
        return;
      }

      try {
        if (pageNumber === 1) {
          setLoading(true);
        }

        let endPoint =  `${endPoints.getProducts}&mode=${mode}&city=${city}`;
        if (query) {
          endPoint += `&${query}`;
        } 
        endPoint+=`&page=${pageNumber}`;

        const result = await axiosHttp.get(endPoint);

        if (result?.status === 200) {
          const newProducts = result?.data?.data?.products || [];

          if (isLoadMore) {
            // Append new products to existing ones
            setProducts((prevProducts) => [...prevProducts, ...newProducts]);
          } else {
            // First load - replace products
            setProducts(newProducts);
          }

          // Check if there are more products to load
          setHasMore(newProducts.length > 0 && newProducts.length === 20);
          setPage(pageNumber);
        } else {
          if (!isLoadMore) {
            setProducts([]);
          }
          setHasMore(false);
        }
      } catch (err) {
        if (!isLoadMore) {
          setProducts([]);
        }
        setHasMore(false);
      } finally {
        if (pageNumber === 1) {
          setLoading(false);
        } 
      }
    },
    [query,city]
  );

  // Initial load when query changes
  useEffect(() => {
    setPage(1);
    getProducts(1, false);
  }, [query]);

  const loadMore = useCallback(() => {
    if (hasMore) {
      getProducts(page + 1, true);
    }
  }, [page, hasMore, getProducts]);

  return { products, loading, hasMore, loadMore };
};

export default useProducts;
