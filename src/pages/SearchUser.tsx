import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SearchUser.css";

const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const navigate = useNavigate();

  const loadingMessages = [
    "이 유저를 분석중...",
    "트롤링한 흔적 발견하기...",
    "채팅 기록을 분석중...",
    "성향을 파악중...",
    "게임 취향을 분석중...",
    "스트리머와의 상호작용을 분석중...",
    "채팅 패턴을 분석중...",
    "감정을 분석중...",
    "활동 시간을 분석중...",
    "팬 행동을 분석중...",
    "트롤링 패턴 분석중...",
    "채팅 봇 여부 확인중...",
    "스팸 메시지 패턴 분석중...",
    "채팅 가속도 측정중...",
    "채팅 톤 분석중...",
    "이모티콘 사용 패턴 분석중...",
    "채팅 반응속도 측정중...",
    "채팅 랭킹 계산중...",
    "채팅 퀄리티 평가중...",
    "채팅 에너지 레벨 측정중...",
    "채팅 스타일 분석중...",
    "채팅 루틴 파악중...",
    "채팅 퍼스널리티 분석중...",
    "채팅 매너 점수 계산중...",
    "채팅 영향력 측정중...",
    "채팅 참여도 분석중...",
    "채팅 톤 분석중...",
    "채팅 랭킹 계산중...",
    "채팅 퀄리티 평가중...",
    "채팅 에너지 레벨 측정중...",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    const shownMessages = new Set();
    let messageCount = 0;
    const minMessages = 3;
    const maxMessages = 5;
    const targetMessageCount =
      Math.floor(Math.random() * (maxMessages - minMessages + 1)) + minMessages;

    // 로딩 메시지 순환
    const messageInterval = setInterval(() => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * loadingMessages.length);
      } while (
        shownMessages.has(randomIndex) &&
        shownMessages.size < loadingMessages.length
      );

      shownMessages.add(randomIndex);
      setLoadingText(loadingMessages[randomIndex]);
      messageCount++;

      if (messageCount >= targetMessageCount) {
        clearInterval(messageInterval);
        setTimeout(() => {
          navigate(`/user/${username}`);
        }, 1000);
      }
    }, 2000);
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-box">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                className="input"
                placeholder="치지직 유저 이름을 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="button button-primary"
                disabled={isLoading}
              >
                {isLoading ? "분석중..." : "검색"}
              </button>
            </div>
          </form>
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">{loadingText}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
