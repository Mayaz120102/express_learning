import axios from "axios";

const goruAxios = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

goruAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("goruToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

goruAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("goruToken");
      window.location.href = "./login";
    }
    return Promise.reject(error);
  },
);

export default goruAxios;
