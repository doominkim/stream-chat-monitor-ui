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
  donation?: {
    amount: number;
    message: string;
  };
  subscription?: {
    months: number;
    message: string;
  };
  ban?: {
    duration: number; // 초 단위
    reason: string;
  };
}

// 목업 데이터 생성 함수
const generateMockData = (count: number): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  const now = new Date();
  const games = [
    "league-of-legends",
    "valorant",
    "overwatch",
    "minecraft",
    "apex-legends",
    "fortnite",
    "pubg",
    "starcraft",
    "diablo",
    "lost-ark",
  ];

  const streamerMessages = [
    "안녕하세요! 오늘도 즐거운 방송 시작합니다~",
    "고맙습니다! 오늘도 시청해주셔서 감사합니다.",
    "이번 게임은 정말 재미있네요!",
    "여러분은 어떤 게임을 좋아하시나요?",
    "오늘도 즐거운 시간 보내요!",
    "시청자 여러분 덕분에 힘이 납니다!",
    "이번 시즌은 정말 기대되네요!",
    "여러분의 응원이 큰 힘이 됩니다!",
    "오늘도 즐거운 방송 되겠습니다!",
    "고맙습니다! 앞으로도 잘 부탁드립니다!",
  ];

  const userMessages = [
    "안녕하세요! 오늘도 잘 부탁드립니다!",
    "스트리머님 방송 항상 잘 보고 있습니다!",
    "오늘도 재미있는 방송 기대됩니다!",
    "이번 게임 정말 재미있네요!",
    "스트리머님 덕분에 힘이 납니다!",
    "오늘도 즐거운 시간 보내요!",
    "여러분의 응원이 큰 힘이 됩니다!",
    "오늘도 즐거운 방송 되겠습니다!",
    "고맙습니다! 앞으로도 잘 부탁드립니다!",
    "이번 시즌은 정말 기대되네요!",
  ];

  const donationMessages = [
    "항상 응원합니다!",
    "좋은 방송 감사합니다!",
    "앞으로도 좋은 방송 부탁드립니다!",
    "오늘도 즐거운 방송 감사합니다!",
    "스트리머님 덕분에 힘이 납니다!",
  ];

  const subscriptionMessages = [
    "구독 감사합니다! 앞으로도 잘 부탁드립니다!",
    "구독해주셔서 감사합니다! 더 좋은 방송으로 보답하겠습니다!",
    "구독 감사드립니다! 오늘도 즐거운 방송 되겠습니다!",
    "구독해주셔서 감사합니다! 더 열심히 하겠습니다!",
    "구독 감사합니다! 여러분이 있어서 힘이 납니다!",
  ];

  const banReasons = [
    "부적절한 언어 사용",
    "스팸 메시지",
    "타인 비방",
    "도배",
    "상업적 홍보",
  ];

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(
      now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000
    );
    const isStreamer = Math.random() < 0.3;
    const hasDonation = !isStreamer && Math.random() < 0.2;
    const hasSubscription = !isStreamer && Math.random() < 0.15; // 구독 비중 15%
    const hasBan = !isStreamer && Math.random() < 0.1; // 밴 비중 10%

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${i}`,
      userId: isStreamer
        ? "스트리머"
        : `user${Math.floor(Math.random() * 1000)}`,
      content: isStreamer
        ? streamerMessages[Math.floor(Math.random() * streamerMessages.length)]
        : userMessages[Math.floor(Math.random() * userMessages.length)],
      timestamp: timestamp.toISOString(),
      isStreamer,
      sentiment: ["positive", "negative", "neutral"][
        Math.floor(Math.random() * 3)
      ] as "positive" | "negative" | "neutral",
      game: isStreamer
        ? games[Math.floor(Math.random() * games.length)]
        : undefined,
      audioUrl: isStreamer
        ? `https://example.com/audio/${Math.floor(Math.random() * 1000)}.mp3`
        : undefined,
      donation: hasDonation
        ? {
            amount: Math.floor(Math.random() * 99000) + 1000,
            message:
              donationMessages[
                Math.floor(Math.random() * donationMessages.length)
              ],
          }
        : undefined,
      subscription: hasSubscription
        ? {
            months: Math.floor(Math.random() * 24) + 1, // 1~24개월
            message:
              subscriptionMessages[
                Math.floor(Math.random() * subscriptionMessages.length)
              ],
          }
        : undefined,
      ban: hasBan
        ? {
            duration: Math.floor(Math.random() * 3600) + 300, // 5분(300초) ~ 1시간(3600초)
            reason: banReasons[Math.floor(Math.random() * banReasons.length)],
          }
        : undefined,
    };

    messages.push(message);
  }

  return messages;
};

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

const ChatHistory = () => {
  const { userId } = useParams();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handlePlayAudio = (url: string) => {
    if (playingAudio === url) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(url);
    }
  };

  const filteredChatHistory = chatHistory
    .filter((message) =>
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

  return (
    <div className="chat-history-page">
      <div className="chat-card">
        <div className="chat-header">
          <h2 className="chat-title">{userId}님의 채팅 기록</h2>
          <div className="chat-search">
            <input
              type="text"
              placeholder="채팅 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="chat-list">
          {filteredChatHistory.map((message) => (
            <div
              key={message.id}
              className={`chat-item ${
                message.isStreamer
                  ? "streamer"
                  : message.donation
                  ? "donation"
                  : message.subscription
                  ? "subscription"
                  : message.ban
                  ? "ban"
                  : "user"
              }`}
            >
              {message.donation && <div className="donation-badge">후원</div>}
              {message.subscription && (
                <div className="subscription-badge">구독</div>
              )}
              {message.ban && <div className="ban-badge">밴</div>}
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
                {message.donation ? (
                  <>
                    <div className="donation-amount">
                      {message.donation.amount.toLocaleString()}원
                    </div>
                    <div className="chat-message">{message.content}</div>
                    <div className="donation-message">
                      {message.donation.message}
                    </div>
                  </>
                ) : message.subscription ? (
                  <>
                    <div className="subscription-months">
                      {message.subscription.months}개월 구독
                    </div>
                    <div className="chat-message">{message.content}</div>
                    <div className="subscription-message">
                      {message.subscription.message}
                    </div>
                  </>
                ) : message.ban ? (
                  <>
                    <div className="ban-duration">
                      {formatDuration(message.ban.duration)}
                    </div>
                    <div className="chat-message">{message.content}</div>
                    <div className="ban-reason">{message.ban.reason}</div>
                  </>
                ) : (
                  <div className="chat-message">{message.content}</div>
                )}
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
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
