import axiosInstance from "./axiosInstance";

export const getConversations = async () => {
  const { data } = await axiosInstance.get("/messages/conversations");
  return data;
};

export const getThread = async (listingId, userId) => {
  const { data } = await axiosInstance.get(`/messages/${listingId}/${userId}`);
  return data;
};

export const sendMessageApi = async (payload) => {
  const { data } = await axiosInstance.post("/messages", payload);
  return data;
};
