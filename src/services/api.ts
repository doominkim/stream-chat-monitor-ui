interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sentiment: string;
}

export const getChatHistory = async (
  userId: string
): Promise<ChatMessage[]> => {
  try {
    const response = await fetch(`http://localhost:3000/api/chat/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch chat history");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};
