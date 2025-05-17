import apiClient from "./client";

export interface Channel {
  id: string;
  name: string;
  platform: string;
  isActive: boolean;
}

export const getChannels = async (): Promise<Channel[]> => {
  try {
    const response = await apiClient.get(`/channel`);
    return response.data;
  } catch (error) {
    console.error("채널 목록 조회 실패:", error);
    throw error;
  }
};
