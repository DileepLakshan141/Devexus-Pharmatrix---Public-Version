import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "https://devexus-backend-service-production.up.railway.app/pharmatrix-api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
