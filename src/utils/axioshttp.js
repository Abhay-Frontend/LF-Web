import axios from "axios";
import { store } from "@/redux/store"; // import your Redux store
import { setLoading } from "@/redux/slices/loadingSlice";

const axiosHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

// Request Interceptor
axiosHttp.interceptors.request.use(
  (config) => {
    // Access state directly from store
    const state = store.getState();

    let token = state.user?.token;

    // if(!token && typeof window!=="undefined"){
    //   token=localStorage.getItem("token");
    // }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Show loading
    store.dispatch(setLoading(true));

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosHttp.interceptors.response.use(
  (response) => {
    // Hide loading on success
    store.dispatch(setLoading(false));
    return response;
  },
  (error) => {
    // Hide loading on error
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  }
);

export default axiosHttp;
