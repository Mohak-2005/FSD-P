import axiosInstance, { setAccessToken } from "./axiosInstance";

export const register = async (payload) => {
  const { data } = await axiosInstance.post("/auth/register", payload);
  setAccessToken(data.accessToken);
  return data;
};

export const login = async (payload) => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  setAccessToken(data.accessToken);
  return data;
};

export const logout = async () => {
  await axiosInstance.post("/auth/logout");
  setAccessToken(null);
};

export const getMe = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};
