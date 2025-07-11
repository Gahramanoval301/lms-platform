// auth services

import axiosInstance from "../api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}
export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);
  console.log(data);
  return data;
}
export async function checkAuthUserService() {
  const { data } = await axiosInstance.get("/auth/check-auth");
  return data;
}
