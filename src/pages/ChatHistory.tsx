import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/ChatHistory.css";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  isStreamer: boolean;
  game?: string;
  audioUrl?: string;
  sentiment: "positive" | "negative" | "neutral";
}

// 목업 데이터 생성 함수
const generateMockData = (count: number): ChatMessage[] => {
  const sentiments = ["positive", "negative", "neutral"];
  const games = ["league", "valorant", "overwatch", "apex", "pubg"];
  const userMessages = [
    "안녕하세요! 오늘도 재미있는 방송 감사합니다!",
    "이번 게임 정말 재미있네요!",
    "아쉽네요... 다음에는 이길 수 있을 거예요!",
    "이번 픽은 좀 아쉽네요...",
    "다음 게임은 이길 수 있을 거예요! 화이팅!",
    "스트리머님 실력이 정말 대단하네요!",
    "오늘도 즐거운 방송 감사합니다!",
    "이번 판은 운이 없었네요...",
    "다음 게임은 꼭 이기실 거예요!",
    "스트리머님 팬이에요! 항상 응원합니다!",
  ];

  const streamerMessages = [
    "안녕하세요! 오늘도 와주셔서 감사합니다!",
    "네! 오늘도 재미있게 해보겠습니다!",
    "아쉽네요... 다음에는 더 잘해보겠습니다!",
    "네... 다음에는 다른 픽으로 해볼게요",
    "감사합니다! 여러분 응원 덕분에 힘이 납니다!",
    "고마워요! 더 열심히 하겠습니다!",
    "네! 오늘도 즐거운 방송 되도록 하겠습니다!",
    "운도 실력이죠... 더 연습해야겠네요",
    "네! 다음 게임은 꼭 이겨보겠습니다!",
    "감사합니다! 여러분이 있어서 힘이 납니다!",
  ];

  return Array.from({ length: count }, (_, i) => {
    const isStreamer = Math.random() > 0.5;
    return {
      id: (i + 1).toString(),
      content: isStreamer
        ? streamerMessages[Math.floor(Math.random() * streamerMessages.length)]
        : userMessages[Math.floor(Math.random() * userMessages.length)],
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
      ).toLocaleString(),
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)] as
        | "positive"
        | "negative"
        | "neutral",
      isStreamer,
      audioUrl: isStreamer
        ? `https://example.com/audio/${i + 1}.mp3`
        : undefined,
      game: isStreamer
        ? games[Math.floor(Math.random() * games.length)]
        : undefined,
    };
  });
};

const ChatHistory = () => {
  const { userId } = useParams();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    // 헤더와 푸터 숨기기
    document.body.classList.add("hide-header-footer");
    // 초기 데이터 로드
    setChatHistory(generateMockData(50));

    return () => {
      document.body.classList.remove("hide-header-footer");
    };
  }, [userId]);

  useEffect(() => {
    if (page > 1) {
      // 추가 데이터 로드
      setTimeout(() => {
        const newData = generateMockData(50);
        setChatHistory((prev) => [...prev, ...newData]);
        if (page >= 5) {
          setHasMore(false);
        }
      }, 1000);
    }
  }, [page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.2 && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePlayAudio = (url: string) => {
    if (playingAudio === url) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(url);
    }
  };

  return (
    <div className="chat-history-page">
      <div className="chat-card">
        <div className="chat-header">
          <h2 className="chat-title">{userId}님의 채팅 기록</h2>
        </div>
        <div className="chat-list" onScroll={handleScroll}>
          {chatHistory.map((message) => (
            <div
              key={message.id}
              className={`chat-item ${
                message.isStreamer ? "streamer" : "user"
              }`}
            >
              <div className="chat-content">
                {message.isStreamer && message.game && (
                  <div className="game-icon">
                    <img
                      src={`/game-icons/${message.game}.png`}
                      alt={message.game}
                      className="game-icon-image"
                    />
                  </div>
                )}
                <div className="chat-message">{message.content}</div>
                <div className="chat-meta">
                  <span className="timestamp">{message.timestamp}</span>
                  {message.isStreamer && message.audioUrl && (
                    <button
                      className={`audio-button ${
                        playingAudio === message.audioUrl ? "playing" : ""
                      }`}
                      onClick={() => handlePlayAudio(message.audioUrl!)}
                    >
                      {playingAudio === message.audioUrl ? "정지" : "재생"}
                    </button>
                  )}
                  <span className={`sentiment ${message.sentiment}`}>
                    {message.sentiment === "positive" && "긍정적"}
                    {message.sentiment === "negative" && "부정적"}
                    {message.sentiment === "neutral" && "중립적"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {hasMore && <div className="loading-more">더 불러오는 중...</div>}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
