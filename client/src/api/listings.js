import axiosInstance from "./axiosInstance";

export const getListings = async (params = {}) => {
  const { data } = await axiosInstance.get("/listings", { params });
  return data;
};

export const getListingById = async (id) => {
  const { data } = await axiosInstance.get(`/listings/${id}`);
  return data;
};

export const createListing = async (payload) => {
  const { data } = await axiosInstance.post("/listings", payload);
  return data;
};
