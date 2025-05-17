import apiClient from "./client";

export interface Channel {
  id: number;
  uuid: string;
  channelName: string;
  channelImageUrl: string;
  channelDescription: string;
  openLive: boolean;
  follower: number;
  isChatCollected: boolean;
  isAudioCollected: boolean;
  isCaptureCollected: boolean;
  isEnabledAi: boolean;
  channelLive: {
    id: number;
    liveId: number;
    liveTitle: string;
    chatChannelId: string | null;
    chatActive: boolean;
    status: boolean;
    liveCategory: {
      id: number;
      categoryType: string;
      liveCategory: string;
      liveCategoryValue: string;
    };
  };
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

export const getChannel = async (channelId: string): Promise<Channel> => {
  try {
    const response = await apiClient.get(`/channel/${channelId}`);
    return response.data;
  } catch (error) {
    console.error("채널 조회 실패:", error);
    throw error;
  }
};

export interface Transcript {
  id: number;
  createdAt: string;
  text: string;
}

export const getTranscripts = async (
  channelId: string,
  offset: number,
  limit: number = 20
): Promise<{ items: Transcript[]; total: number; hasMore: boolean }> => {
  try {
    const response = await apiClient.get(
      `/channel/${channelId}/transcript?limit=${limit}&sort=ASC`
    );
    return response.data;
  } catch (error) {
    console.error("자막 조회 실패:", error);
    throw error;
  }
};
