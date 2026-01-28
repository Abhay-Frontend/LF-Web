import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints";
import { useEffect, useState } from "react";

const usegetBrands = (city="Delhi") => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const getBrands = async () => {
    try {
      //const result = await axiosHttp.get(endPoints.getBrands);
      const result = await axiosHttp.get(endPoints.getBrandsByCity,{
        params:{city},
      });
      if (result?.status === 200) {
      
        setBrands(result?.data?.data||[]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, [city]);

  return { brands, loading };
};

export default usegetBrands;
