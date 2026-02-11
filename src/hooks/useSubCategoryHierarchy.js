import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints";
import { useEffect, useState } from "react";

const useCategoryProducts = (category, options={}) => {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);

  const {city="Delhi", mode="quick"} = options;

  const fetchCategoryProducts = async () => {
    try {
      setIsCategoryLoading(true);
      //const params = new URLSearchParams();

      // Endpoint remains SAME 
      const endPoint = `${endPoints.getProductsByCategory}=${category}&city=${city}&mode=${mode}`;

      const response = await axiosHttp.get(endPoint);

      if (response?.status === 200) {
        setCategoryProducts(response?.data?.data);
      } else {
        setCategoryProducts([]);
      }
    } catch (error) {
      setCategoryProducts([]);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [category,city,mode]);

  return { categoryProducts, isCategoryLoading };
};

export default useCategoryProducts;
