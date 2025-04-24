import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sentiment: string;
}

const mockChatHistory: ChatMessage[] = [
  {
    id: "1",
    content: "안녕하세요! 오늘도 재미있는 방송 감사합니다!",
    timestamp: "2024-03-20 19:00:00",
    sentiment: "positive",
  },
  {
    id: "2",
    content: "이번 게임 정말 재미있네요!",
    timestamp: "2024-03-20 19:05:00",
    sentiment: "positive",
  },
  {
    id: "3",
    content: "아쉽네요... 다음에는 이길 수 있을 거예요!",
    timestamp: "2024-03-20 19:10:00",
    sentiment: "neutral",
  },
  {
    id: "4",
    content: "이번 픽은 좀 아쉽네요...",
    timestamp: "2024-03-20 19:15:00",
    sentiment: "negative",
  },
  {
    id: "5",
    content: "다음 게임은 이길 수 있을 거예요! 화이팅!",
    timestamp: "2024-03-20 19:20:00",
    sentiment: "positive",
  },
];

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 임시로 mock 데이터 사용
    setChatHistory(mockChatHistory);
    setLoading(false);
  }, [userId]);

  if (loading) {
    return (
      <main>
        <div className="user-container">
          <div className="loading">로딩 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="user-container">
        <div className="user-header">
          <div className="user-info">
            <div className="user-avatar">{userId?.charAt(0).toUpperCase()}</div>
            <div className="user-name">{userId}</div>
          </div>
          <button
            className="button button-secondary"
            onClick={() => navigate("/search")}
          >
            돌아가기
          </button>
        </div>

        <div className="chat-list">
          {chatHistory.map((message) => (
            <div key={message.id} className="chat-item">
              <div className="chat-message">{message.content}</div>
              <div className="chat-meta">
                <span className="timestamp">{message.timestamp}</span>
                <span className={`sentiment ${message.sentiment}`}>
                  {message.sentiment === "positive" && "긍정적"}
                  {message.sentiment === "negative" && "부정적"}
                  {message.sentiment === "neutral" && "중립적"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default UserDetail;
