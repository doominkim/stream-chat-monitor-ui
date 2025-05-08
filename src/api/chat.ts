import apiClient from "./client";

export const getChatHistory = async (userId: string) => {
  try {
    const response = await apiClient.get(`/chat/${userId}`);
    return response.data;
  } catch (error) {
    console.error("채팅 기록 조회 실패:", error);
    throw error;
  }
};

export const searchChat = async (userId: string, query: string) => {
  try {
    const response = await apiClient.get(`/chat/${userId}/search`, {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("채팅 검색 실패:", error);
    throw error;
  }
};

export const getChatStats = async (userId: string) => {
  try {
    const response = await apiClient.get(`/chat/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error("채팅 통계 조회 실패:", error);
    throw error;
  }
};
