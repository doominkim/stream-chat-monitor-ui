import apiClient from "./client";

interface UserInfo {
  userId: string;
  nickname: string;
  profileImageUrl: string;
}

export const getUserInfo = async (sessionId: string): Promise<UserInfo> => {
  const response = await apiClient.get<UserInfo>(
    `/auth/me?sessionId=${sessionId}`
  );
  return response.data;
};
