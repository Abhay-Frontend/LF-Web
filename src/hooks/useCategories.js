import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints";
import { useEffect, useState } from "react";

const useCategories = (query) => {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      let endPoint= endPoints.getCategories;
      if (query) {
        endPoint += `&${query}`;
      }

      const result = await axiosHttp.get(endPoint);

      if (result?.status === 200) {
        setCategories(result?.data?.data);
      }
    } catch (err) {console.error("Error fetching categories:",err);}
  };

  useEffect(() => {
    getCategories();
  }, [query]);
  return categories;
};

export default useCategories;
