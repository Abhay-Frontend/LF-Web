import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints";
import { useEffect, useState } from "react";

const useGetCategoriesHierarchy = (options={}) => {
  const [categories, setCategories] = useState([]);
  const { city = "Delhi", mode = "quick" } = options;

  const getCategoriesHierarchy = async () => {
    try {
      const params = new URLSearchParams();
      params.append("city",city);
      params.append("mode",mode);
      const queryString = params.toString();
      const endPoint = `${endPoints.getCategoriesHierarchy}${queryString ? `?${queryString}` : ""}`;
      const result = await axiosHttp.get(endPoint);
      if (result?.status === 200) {
        setCategories(result?.data?.data);
      }
    } catch (err) {
      console.error("Error fetching categories hierarchy:", err);
    }
  };

  useEffect(() => {
    getCategoriesHierarchy();
  }, [mode,city]);

  return categories;
};

export default useGetCategoriesHierarchy;
