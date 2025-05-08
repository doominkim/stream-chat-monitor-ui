import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getChatHistory, searchChat } from "../api/chat";
import "../styles/ChatHistory.css";

interface Game {
  name: string;
  icon: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  type: "streamer" | "user" | "donation" | "subscription" | "ban";
  message: string;
  timestamp: string;
  game: Game;
  sentiment: "positive" | "negative" | "neutral";
  captureImage?: string;
  donation?: {
    amount: number;
    message: string;
  };
  subscription?: {
    months: number;
    message: string;
  };
  ban?: {
    duration: number;
    reason: string;
  };
}

const ChatHistory: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getChatHistory(userId || "");
        setChatHistory(data);
      } catch (err) {
        setError("채팅 기록을 불러오는데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [userId]);

  useEffect(() => {
    const searchChatHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = searchTerm.trim()
          ? await searchChat(userId || "", searchTerm)
          : await getChatHistory(userId || "");
        setChatHistory(data);
      } catch (err) {
        setError("채팅 검색에 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchChatHistory, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, userId]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${remainingSeconds}초`;
    } else if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    } else {
      return `${remainingSeconds}초`;
    }
  };

  const filteredChatHistory = chatHistory.filter((message) =>
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 날짜별로 그룹화
  const groupedChatHistory = filteredChatHistory.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  return (
    <div className="chat-history-page">
      <div className="chat-card">
        <div className="chat-header">
          <h1 className="chat-title">{userId}님의 채팅 기록</h1>
          <div className="chat-search">
            <input
              type="text"
              placeholder="채팅 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="chat-list">
            {Object.entries(groupedChatHistory).map(([date, messages]) => (
              <div key={date} className="chat-date-group">
                <div className="chat-date-header">{date}</div>
                {messages.map((message) => (
                  <div key={message.id} className={`chat-item ${message.type}`}>
                    <div className="chat-content">
                      <div className="chat-user-id">{message.userId}</div>
                      {message.type === "streamer" && message.game && (
                        <div className="game-icon">
                          <img
                            src={message.game.icon}
                            alt={message.game.name}
                            className="game-icon-image"
                          />
                        </div>
                      )}
                      {message.type === "streamer" && (
                        <>
                          <div className="chat-message">{message.message}</div>
                          {message.captureImage && (
                            <div className="streamer-capture">
                              <img
                                src={message.captureImage}
                                alt="Game Capture"
                                className="streamer-capture-image"
                              />
                            </div>
                          )}
                        </>
                      )}
                      {message.type === "donation" && message.donation && (
                        <>
                          <div className="donation-badge">후원</div>
                          <div className="donation-amount">
                            {message.donation.amount.toLocaleString()}원
                          </div>
                          <div className="chat-message">{message.message}</div>
                          <div className="donation-message">
                            {message.donation.message}
                          </div>
                        </>
                      )}
                      {message.type === "subscription" &&
                        message.subscription && (
                          <>
                            <div className="subscription-badge">구독</div>
                            <div className="subscription-months">
                              {message.subscription.months}개월 구독
                            </div>
                            <div className="chat-message">
                              {message.message}
                            </div>
                            <div className="subscription-message">
                              {message.subscription.message}
                            </div>
                          </>
                        )}
                      {message.type === "ban" && message.ban && (
                        <>
                          <div className="ban-badge">차단</div>
                          <div className="ban-duration">
                            {formatDuration(message.ban.duration)}
                          </div>
                          <div className="chat-message">{message.message}</div>
                          <div className="ban-reason">{message.ban.reason}</div>
                        </>
                      )}
                      {message.type === "user" && (
                        <div className="chat-message">{message.message}</div>
                      )}
                      <div className="chat-meta">
                        <span className="timestamp">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`sentiment ${message.sentiment}`}>
                          {message.sentiment === "positive" && "긍정적"}
                          {message.sentiment === "negative" && "부정적"}
                          {message.sentiment === "neutral" && "중립적"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
