import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

  const generateMockData = (count: number): ChatMessage[] => {
    const messages: ChatMessage[] = [];
    const now = new Date();
    const streamerMessages = [
      "안녕하세요! 오늘도 즐거운 방송 시작합니다~",
      "이번 게임은 정말 재미있네요!",
      "여러분의 응원이 힘이 됩니다!",
      "오늘도 좋은 하루 되세요!",
      "다음 방송도 기대해주세요!",
    ];

    const userMessages = [
      "안녕하세요!",
      "좋은 방송이네요!",
      "응원합니다!",
      "다음 방송도 기대합니다!",
      "오늘도 좋은 하루 되세요!",
    ];

    const games: Game[] = [
      {
        name: "리그 오브 레전드",
        icon: "https://static-cdn.jtvnw.net/ttv-boxart/21779-188x250.jpg",
      },
      {
        name: "발로란트",
        icon: "https://static-cdn.jtvnw.net/ttv-boxart/516575-188x250.jpg",
      },
      {
        name: "오버워치",
        icon: "https://static-cdn.jtvnw.net/ttv-boxart/488552-188x250.jpg",
      },
      {
        name: "서든어택",
        icon: "https://static-cdn.jtvnw.net/ttv-boxart/460630-188x250.jpg",
      },
      {
        name: "카트라이더",
        icon: "https://static-cdn.jtvnw.net/ttv-boxart/27471_IGDB-188x250.jpg",
      },
    ];

    const captureImages = [
      "https://static-cdn.jtvnw.net/previews-ttv/live_user_riotgames-{width}x{height}.jpg",
      "https://static-cdn.jtvnw.net/previews-ttv/live_user_valorant-{width}x{height}.jpg",
      "https://static-cdn.jtvnw.net/previews-ttv/live_user_overwatchleague-{width}x{height}.jpg",
      "https://static-cdn.jtvnw.net/previews-ttv/live_user_playbattlegrounds-{width}x{height}.jpg",
      "https://static-cdn.jtvnw.net/previews-ttv/live_user/kartrider-{width}x{height}.jpg",
    ].map((url) => url.replace("{width}x{height}", "300x200"));

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(
        now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
      );
      const game = games[Math.floor(Math.random() * games.length)];
      const isStreamer = Math.random() < 0.3;
      const hasCapture = isStreamer && Math.random() < 0.5;
      const captureImage = hasCapture
        ? captureImages[Math.floor(Math.random() * captureImages.length)]
        : undefined;

      if (isStreamer) {
        messages.push({
          id: `streamer-${i}`,
          userId: "스트리머",
          type: "streamer",
          message:
            streamerMessages[
              Math.floor(Math.random() * streamerMessages.length)
            ],
          timestamp: timestamp.toISOString(),
          game,
          captureImage,
          sentiment:
            Math.random() < 0.7
              ? "positive"
              : Math.random() < 0.5
              ? "neutral"
              : "negative",
        });
      } else {
        const isDonation = Math.random() < 0.3;
        const isSubscription = !isDonation && Math.random() < 0.2;
        const isBan = !isDonation && !isSubscription && Math.random() < 0.1;
        const userId = `user${Math.floor(Math.random() * 1000)}`;

        if (isDonation) {
          const amount = Math.floor(Math.random() * 100000) + 1000;
          messages.push({
            id: `donation-${i}`,
            userId,
            type: "donation",
            message:
              userMessages[Math.floor(Math.random() * userMessages.length)],
            timestamp: timestamp.toISOString(),
            game,
            donation: {
              amount,
              message: `정말 감사합니다! ${amount.toLocaleString()}원 후원해주셔서 감사합니다!`,
            },
            sentiment: "positive",
          });
        } else if (isSubscription) {
          const months = Math.floor(Math.random() * 12) + 1;
          messages.push({
            id: `subscription-${i}`,
            userId,
            type: "subscription",
            message:
              userMessages[Math.floor(Math.random() * userMessages.length)],
            timestamp: timestamp.toISOString(),
            game,
            subscription: {
              months,
              message: `${months}개월 구독 감사합니다!`,
            },
            sentiment: "positive",
          });
        } else if (isBan) {
          const duration = Math.floor(Math.random() * 3600) + 60;
          messages.push({
            id: `ban-${i}`,
            userId,
            type: "ban",
            message:
              userMessages[Math.floor(Math.random() * userMessages.length)],
            timestamp: timestamp.toISOString(),
            game,
            ban: {
              duration,
              reason: "부적절한 채팅",
            },
            sentiment: "negative",
          });
        } else {
          messages.push({
            id: `user-${i}`,
            userId,
            type: "user",
            message:
              userMessages[Math.floor(Math.random() * userMessages.length)],
            timestamp: timestamp.toISOString(),
            game,
            sentiment:
              Math.random() < 0.7
                ? "positive"
                : Math.random() < 0.5
                ? "neutral"
                : "negative",
          });
        }
      }
    }

    return messages;
  };

  useEffect(() => {
    // 페이지 타이틀 설정
    document.title = `${userId}님의 채팅 기록 - Stream Chat Monitor`;

    // 헤더와 푸터 숨기기
    document.body.classList.add("hide-header-footer");
    // 초기 데이터 로드
    const initialData = generateMockData(15); // 15개로 줄임
    const sortedData = [...initialData].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setChatHistory(sortedData);

    return () => {
      document.title = "Stream Chat Monitor"; // 컴포넌트 언마운트 시 기본 타이틀 복원
      document.body.classList.remove("hide-header-footer");
    };
  }, [userId]);

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
        <div className="chat-list">
          {filteredChatHistory.map((message) => (
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
                {message.type === "subscription" && message.subscription && (
                  <>
                    <div className="subscription-badge">구독</div>
                    <div className="subscription-months">
                      {message.subscription.months}개월 구독
                    </div>
                    <div className="chat-message">{message.message}</div>
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
                    {new Date(message.timestamp).toLocaleString()}
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
      </div>
    </div>
  );
};

export default ChatHistory;
