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

//media services - instructor-services

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (ProgressEvent) => {
      const percentCompleted = Math.round(
        (ProgressEvent.loaded * 100) / ProgressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  return data;
}
