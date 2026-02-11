import axiosHttp from "@/utils/axioshttp";
import { endPoints } from "@/utils/endpoints";
import { useEffect, useState } from "react";

const useGetCoupons = () => {
  const [coupons, setCoupons] = useState([]);

  const getCoupon = async () => {
    try {
      const endPoint = `${endPoints.getCoupons}`;
      const result = await axiosHttp.get(endPoint);
      if (result?.status === 200) {
        setCoupons(result?.data?.data);
      }
    } catch (err) {
      //error.resposne.data.message
    }
  };

  useEffect(() => {
    getCoupon();
  }, []);
  return coupons;
};

export default useGetCoupons;
