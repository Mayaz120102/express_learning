import axios from "axios";

//create axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

//adding interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // console.log("TOKEN:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

//response interceptor main part
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        //call refresh api
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/users/refresh-token`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = res.data.accessToken;

        //save new token
        localStorage.setItem("accessToken", newAccessToken);

        //attach new token and retry request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (err) {
        console.log("Refresh Token expired");

        //logout user if refresh fails
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
