import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001",
  withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     console.log(error.response, originalRequest._retry, "responseee");

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // Call backend to refresh tokens (cookies are auto-sent)
//         await axiosInstance.post("/auth/refresh-token");

//         // Retry the original request
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Refresh failed → log out
//         console.error("Refresh failed", refreshError);
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.request.use(
  (config) => {
    // const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }

    return config;
  },
  (err) => Promise.reject(err)
);
export default axiosInstance;
