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

export enum ChatType {
  CHAT = "CHAT",
  DONATION = "DONATION",
  SUBSCRIPTION = "SUBSCRIPTION",
  GIFT = "GIFT",
}

export interface FindChannelChatDto {
  limit?: number;
  from?: Date;
  to?: Date;
  message?: string;
  userIdHash?: string;
  nickname?: string;
  chatType?: ChatType;
}

export interface ChatMessage {
  user: string;
  nickname: string;
  message: string;
  timestamp: string;
}

export interface ChatResponse {
  items: ChatMessage[];
  total: number;
  hasMore: boolean;
}

export const getChatMessages = async (
  channelId: string,
  chatChannelId: string,
  query: FindChannelChatDto = {}
): Promise<ChatMessage[]> => {
  try {
    const params = {
      limit: query.limit,
      chatType: query.chatType,
      from: query.from instanceof Date ? query.from.toISOString() : query.from,
    };

    const response = await apiClient.get<ChatResponse>(
      `/channel/${channelId}/chat/${chatChannelId}`,
      { params }
    );

    return response.data.items;
  } catch (error) {
    console.error("채팅 메시지 조회 실패:", error);
    return [];
  }
};

export const getTranscripts = async (
  channelId: string,
  limit: number = 100
) => {
  try {
    const response = await apiClient.get(`/channel/${channelId}/transcript`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("자막 조회 실패:", error);
    return [];
  }
};

export interface FindChatDto {
  uuid?: string;
  chatChannelId?: string;
  limit?: number;
  from?: Date;
  to?: Date;
  message?: string;
  userIdHash?: string;
  nickname?: string;
  chatType?: ChatType;
}

export const findChat = async (
  query: FindChatDto = {}
): Promise<ChatMessage[]> => {
  try {
    const params = {
      uuid: query.uuid,
      chatChannelId: query.chatChannelId,
      limit: query.limit,
      from: query.from instanceof Date ? query.from.toISOString() : query.from,
      to: query.to instanceof Date ? query.to.toISOString() : query.to,
      message: query.message,
      userIdHash: query.userIdHash,
      nickname: query.nickname,
      chatType: query.chatType,
    };

    const response = await apiClient.get<ChatResponse>("/chat", { params });
    return response.data.items;
  } catch (error) {
    console.error("채팅 조회 실패:", error);
    return [];
  }
};
