import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/UserDetail.css";

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sentiment: string;
  isStreamer: boolean;
  audioUrl?: string;
  game?: string;
}

interface UserInfo {
  followSince: string;
  subscriptionTier: number;
  badges: string[];
  activeTime: {
    start: string;
    end: string;
  };
  favoriteGames: {
    name: string;
    icon: string;
    watchTime: string;
  }[];
  analysis: {
    toxicityScore: number;
    reportCount: number;
    warningCount: number;
    lastWarningDate?: string;
    commonViolations: string[];
    positivePoints: string[];
  };
  personality: {
    type: string;
    description: string;
    traits: {
      name: string;
      value: number;
      icon: string;
    }[];
    characteristics: string[];
    matchingStreamers: string[];
  };
}

// 더 많은 목업 데이터 생성
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
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)],
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

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [userInfo] = useState<UserInfo>({
    followSince: "2023-01-15",
    subscriptionTier: 2,
    badges: ["early_supporter", "chat_enthusiast", "gift_giver"],
    activeTime: {
      start: "20:00",
      end: "02:00",
    },
    favoriteGames: [
      {
        name: "리그 오브 레전드",
        icon: "league",
        watchTime: "1,200시간",
      },
      {
        name: "발로란트",
        icon: "valorant",
        watchTime: "800시간",
      },
      {
        name: "오버워치",
        icon: "overwatch",
        watchTime: "500시간",
      },
    ],
    analysis: {
      toxicityScore: 15,
      reportCount: 2,
      warningCount: 1,
      lastWarningDate: "2024-01-15",
      commonViolations: ["과도한 도배", "경미한 비속어 사용"],
      positivePoints: [
        "활발한 채팅 참여",
        "스트리머와 긍정적 상호작용",
        "다른 시청자 돕기",
      ],
    },
    personality: {
      type: "열정적인 트롤러",
      description:
        "채팅창의 분위기 메이커. 가끔은 도를 넘지만 대체로 긍정적인 에너지를 전파하는 유형",
      traits: [
        {
          name: "유머러스",
          value: 85,
          icon: "😆",
        },
        {
          name: "참여도",
          value: 92,
          icon: "🎯",
        },
        {
          name: "감정적",
          value: 78,
          icon: "💖",
        },
        {
          name: "창의성",
          value: 88,
          icon: "💡",
        },
      ],
      characteristics: [
        "항상 새로운 밈을 만들어내려 노력함",
        "스트리머의 실수를 놓치지 않는 날카로운 관찰력",
        "다른 시청자들과 활발한 소통",
        "가끔 과한 장난으로 경고를 받기도 함",
      ],
      matchingStreamers: ["침착맨", "풍월량", "우왁굳"],
    },
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // 초기 데이터 로드
    setChatHistory(generateMockData(50));
    setLoading(false);

    // footer 숨기기
    document.body.classList.add("hide-footer");

    // cleanup
    return () => {
      document.body.classList.remove("hide-footer");
    };
  }, [userId]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    const pageElement = document.querySelector(".user-detail-page");
    if (pageElement) {
      pageElement.addEventListener("scroll", handleScroll);
      return () => pageElement.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const loadMore = () => {
    if (!hasMore) return;

    // 추가 데이터 로드 (실제로는 API 호출)
    setTimeout(() => {
      const newData = generateMockData(50);
      setChatHistory((prev) => [...prev, ...newData]);
      setPage((prev) => prev + 1);

      // 5페이지 이후에는 더 이상 데이터가 없다고 가정
      if (page >= 5) {
        setHasMore(false);
      }
    }, 1000);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.2) {
      loadMore();
    }
  };

  const handlePlayAudio = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(audioUrl);
    }
  };

  const scrollToTop = () => {
    const pageElement = document.querySelector(".user-detail-page");
    if (pageElement) {
      pageElement.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const handleChatToggle = () => {
    window.open(`/user/${userId}/chat`, "_blank", "width=800,height=600");
  };

  if (loading) {
    return (
      <main className="user-detail-page">
        <div className="user-container">
          <div className="loading">로딩 중...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="user-detail-page">
      <div className="user-container">
        <button
          className="button button-secondary back-button"
          onClick={() => navigate("/search")}
        >
          돌아가기
        </button>
        <button
          className="button button-secondary chat-toggle-button"
          onClick={handleChatToggle}
        >
          💬 채팅보기
        </button>
        <div className="user-header">
          <div className="user-info">
            <div className="user-avatar">{userId?.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{userId}</div>
              <div className="user-badges">
                {userInfo.badges.map((badge) => (
                  <span key={badge} className={`badge ${badge}`}>
                    {badge === "early_supporter" && "초기 서포터"}
                    {badge === "chat_enthusiast" && "채팅 애호가"}
                    {badge === "gift_giver" && "선물러"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="user-stats-container">
          <div className="user-stats">
            <div className="stat-item">
              <span className="stat-label">팔로우</span>
              <span className="stat-value">{userInfo.followSince}부터</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">구독</span>
              <span className="stat-value">
                {userInfo.subscriptionTier}개월
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">접속 시간</span>
              <span className="stat-value">
                {userInfo.activeTime.start} ~ {userInfo.activeTime.end}
              </span>
            </div>
          </div>
          <div className="personality-card">
            <div className="personality-header">
              <h2 className="personality-title">시청자 성향</h2>
              <div className="personality-type">
                {userInfo.personality.type}
              </div>
            </div>
            <div className="personality-content">
              <p className="personality-description">
                {userInfo.personality.description}
              </p>

              <div className="personality-traits">
                {userInfo.personality.traits.map((trait) => (
                  <div key={trait.name} className="trait-item">
                    <div className="trait-header">
                      <span className="trait-icon">{trait.icon}</span>
                      <span className="trait-name">{trait.name}</span>
                    </div>
                    <div className="trait-bar-container">
                      <div
                        className="trait-bar"
                        style={{ width: `${trait.value}%` }}
                      />
                      <span className="trait-value">{trait.value}%</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="personality-section">
                <h3 className="personality-subtitle">특징</h3>
                <ul className="characteristics-list">
                  {userInfo.personality.characteristics.map((char, index) => (
                    <li key={index} className="characteristic-item">
                      {char}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="personality-section">
                <h3 className="personality-subtitle">잘 맞는 스트리머</h3>
                <div className="matching-streamers">
                  {userInfo.personality.matchingStreamers.map(
                    (streamer, index) => (
                      <span key={index} className="matching-streamer">
                        {streamer}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="analysis-card">
            <div className="analysis-header">
              <h2 className="analysis-title">시청자 분석</h2>
              <div
                className={`toxicity-score ${
                  userInfo.analysis.toxicityScore < 30
                    ? "good"
                    : userInfo.analysis.toxicityScore < 70
                    ? "warning"
                    : "danger"
                }`}
              >
                위험도: {userInfo.analysis.toxicityScore}%
              </div>
            </div>
            <div className="analysis-content">
              <div className="analysis-section">
                <h3 className="analysis-subtitle">신고 및 경고</h3>
                <div className="analysis-stats">
                  <div className="analysis-stat-item">
                    <span className="stat-label">누적 신고</span>
                    <span className="stat-value">
                      {userInfo.analysis.reportCount}회
                    </span>
                  </div>
                  <div className="analysis-stat-item">
                    <span className="stat-label">경고</span>
                    <span className="stat-value">
                      {userInfo.analysis.warningCount}회
                    </span>
                  </div>
                  {userInfo.analysis.lastWarningDate && (
                    <div className="analysis-stat-item">
                      <span className="stat-label">최근 경고일</span>
                      <span className="stat-value">
                        {userInfo.analysis.lastWarningDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="analysis-section">
                <h3 className="analysis-subtitle">주의 사항</h3>
                <ul className="analysis-list warning-list">
                  {userInfo.analysis.commonViolations.map(
                    (violation, index) => (
                      <li key={index} className="analysis-list-item">
                        {violation}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="analysis-section">
                <h3 className="analysis-subtitle">긍정적 행동</h3>
                <ul className="analysis-list positive-list">
                  {userInfo.analysis.positivePoints.map((point, index) => (
                    <li key={index} className="analysis-list-item">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="favorite-games">
            <div className="favorite-games-header">
              <span className="favorite-games-label">선호 게임</span>
              <span className="favorite-games-subtitle">시청 시간 순</span>
            </div>
            {userInfo.favoriteGames.map((game) => (
              <div key={game.name} className="favorite-game">
                <img
                  src={`/game-icons/${game.icon}.png`}
                  alt={game.name}
                  className="favorite-game-icon"
                />
                <div className="favorite-game-info">
                  <span className="favorite-game-name">{game.name}</span>
                  <span className="favorite-game-time">
                    시청 {game.watchTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        className={`scroll-to-top ${showScrollTop ? "visible" : ""}`}
        onClick={scrollToTop}
      >
        ↑
      </button>
    </main>
  );
};

export default UserDetail;
