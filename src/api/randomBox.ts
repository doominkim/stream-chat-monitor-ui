import { Channel } from "./channel";

export interface BoxItem {
  id: number;
  name: string;
  probability: number;
  image: string;
  price: number;
}

export interface RandomBoxResponse {
  item: BoxItem;
  message: string;
}

export const getRandomBoxItems = async (
  channelId: string
): Promise<BoxItem[]> => {
  const response = await fetch(`/api/channels/${channelId}/random-box/items`);
  if (!response.ok) {
    throw new Error("Failed to fetch random box items");
  }
  return response.json();
};

export const openRandomBox = async (
  channelId: string,
  amount: number
): Promise<RandomBoxResponse> => {
  const response = await fetch(`/api/channels/${channelId}/random-box/open`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount }),
  });
  if (!response.ok) {
    throw new Error("Failed to open random box");
  }
  return response.json();
};
