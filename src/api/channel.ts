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
