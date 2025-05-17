import React, { useState, useEffect } from "react";
import "../styles/RandomBox.css";
import ChannelNavigator from "../components/ChannelNavigator";

interface Channel {
  id: string;
  name: string;
  logo: string;
  openLive: boolean;
  follower: number;
  gameCategory?: string;
  isEnabledAi: boolean;
}

interface BoardItem {
  id: number;
  userId?: string;
  borderColor?: string;
  color?: string;
}

const RandomBox: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [board, setBoard] = useState<BoardItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [participants, setParticipants] = useState<Set<string>>(new Set());
  const [winner, setWinner] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinnerMessage, setShowWinnerMessage] = useState(false);
  const [winners, setWinners] = useState<
    Array<{ id: number; userId: string; color: string }>
  >([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [collectionType, setCollectionType] = useState<"chat" | "donation">(
    "chat"
  );
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const partySound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3"
  );
  const failSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"
  );
  const disappointmentSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3"
  );

  const mockUsernames = [
    "SPECTACL2",
    "MayBeee",
    "귀요미미미",
    "구로냥",
    "답도 없는 마녀 9190",
    "럭키가이 쪼렙 3050",
    "럭키가이 초보 2799",
    "배부른도니",
    "복복강",
    "세틀로직",
    "썬두리",
    "아프란",
    "알다가도 모르겠다",
    "에뜨모후",
    "오목눈이1",
    "전패의 엘프 2007",
    "정유호",
    "쟉이야",
    "카타리나클라에스",
    "코로먹는설탕",
    "포포토",
    "펑크CM",
    "하양바람",
    "화수월럭키가이 중렙 3340",
    "귀염둥이미미",
    "배터진도니",
    "쫄보강",
    "정유재",
    "답없는 기사 7777",
    "텅텅텅",
    "전패의 마법사 1999",
    "펑펑PM",
    "사후르왕자",
    "포포링",
    "썬디루",
    "에뜨모모",
    "쟈기야",
    "혼자노는힐러",
    "용잡는설탕",
    "하양연기",
    "쏘쏘월",
  ];

  const getRandomMockUsername = () => {
    return mockUsernames[Math.floor(Math.random() * mockUsernames.length)];
  };

  useEffect(() => {
    // 10x10 보드 초기화
    const initialBoard: BoardItem[] = Array.from(
      { length: 100 },
      (_, index) => ({
        id: index + 1,
      })
    );
    setBoard(initialBoard);
  }, []);

  const handleItemSelect = (itemId: number) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      if (prev.length >= 3) {
        alert("최대 3개의 아이템만 선택할 수 있습니다.");
        return prev;
      }
      return [...prev, itemId];
    });
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleMockDraw = () => {
    if (participants.size < 100) {
      const randomIndex = Math.floor(Math.random() * board.length);
      const selectedItem = board[randomIndex];
      if (!selectedItems.includes(selectedItem.id)) {
        setSelectedItems((prev) => [...prev, selectedItem.id]);
        const userId = getRandomMockUsername();
        setParticipants((prev) => new Set(prev).add(userId));
        board[randomIndex] = {
          ...selectedItem,
          userId,
          color: getRandomColor(),
        };
      }
    }
  };

  const handleShowResult = () => {
    if (board.length > 0) {
      const randomIndex = Math.floor(Math.random() * board.length);
      const winningItem = board[randomIndex];
      setWinner(winningItem.id);
      setShowWinnerMessage(true);

      // 당첨된 경우와 꽝인 경우 다른 효과음 재생
      if (selectedItems.includes(winningItem.id)) {
        setShowConfetti(true);
        partySound.play().catch((err) => console.log("소리 재생 실패:", err));

        // 당첨자 목록에 추가
        const winnerInfo = board.find((item) => item.id === winningItem.id);
        if (winnerInfo && winnerInfo.userId && winnerInfo.color) {
          setWinners((prev) => [
            ...prev,
            {
              id: winnerInfo.id,
              userId: winnerInfo.userId,
              color: winnerInfo.color,
            },
          ]);
        }

        // 3초 후 폭죽 숨기기
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      } else {
        disappointmentSound
          .play()
          .catch((err) => console.log("소리 재생 실패:", err));
      }

      // 5초 후 메시지 숨기기
      setTimeout(() => {
        setShowWinnerMessage(false);
      }, 5000);
    } else {
      alert("선택된 아이템이 없습니다.");
    }
  };

  const handleReset = () => {
    setSelectedItems([]);
    setParticipants(new Set());
    setWinner(null);
    setShowConfetti(false);
    setShowWinnerMessage(false);
    setWinners([]); // 당첨자 목록도 초기화
    const initialBoard: BoardItem[] = Array.from(
      { length: 100 },
      (_, index) => ({
        id: index + 1,
      })
    );
    setBoard(initialBoard);
  };

  const donationOptions = [
    { value: 1000, label: "1,000원" },
    { value: 5000, label: "5,000원" },
    { value: 10000, label: "10,000원" },
    { value: "custom", label: "직접 설정" },
  ];

  // 채널 변경 시 설정 초기화
  const handleChannelSelect = (channel: Channel | null) => {
    setSelectedChannel(channel);
    setIsConfigured(false);
    setCollectionType("chat");
    setDonationAmount(1000);
    setIsCustomAmount(false);
    setSelectedItems([]);
    setParticipants(new Set());
    setWinner(null);
    setShowConfetti(false);
    setShowWinnerMessage(false);
    setWinners([]);
    const initialBoard: BoardItem[] = Array.from(
      { length: 100 },
      (_, index) => ({
        id: index + 1,
      })
    );
    setBoard(initialBoard);
  };

  const handleDonationAmountChange = (value: number | "custom") => {
    if (value === "custom") {
      setIsCustomAmount(true);
    } else {
      setIsCustomAmount(false);
      setDonationAmount(value);
    }
  };

  return (
    <div className="subtitle-page">
      <div className="subtitle-layout">
        <div className="subtitle-sidebar">
          <ChannelNavigator
            selectedChannel={selectedChannel}
            onChannelSelect={handleChannelSelect}
          />
        </div>
        <div className="subtitle-content">
          {!isConfigured ? (
            <div className="configuration-container">
              <h2>랜덤박스 설정</h2>
              <div className="config-section">
                <h3>수집 방식 선택</h3>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      value="chat"
                      checked={collectionType === "chat"}
                      onChange={(e) =>
                        setCollectionType(e.target.value as "chat")
                      }
                    />
                    채팅 수집
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="donation"
                      checked={collectionType === "donation"}
                      onChange={(e) =>
                        setCollectionType(e.target.value as "donation")
                      }
                    />
                    후원 수집
                  </label>
                </div>
              </div>
              {collectionType === "donation" && (
                <div className="config-section">
                  <h3>후원 금액</h3>
                  <div className="donation-options">
                    {donationOptions.map((option) => (
                      <label key={option.value} className="donation-option">
                        <input
                          type="radio"
                          name="donationAmount"
                          value={option.value}
                          checked={
                            option.value === "custom"
                              ? isCustomAmount
                              : !isCustomAmount &&
                                donationAmount === option.value
                          }
                          onChange={() =>
                            handleDonationAmountChange(option.value)
                          }
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {isCustomAmount && (
                    <div className="amount-input">
                      <input
                        type="number"
                        value={donationAmount}
                        onChange={(e) =>
                          setDonationAmount(Number(e.target.value))
                        }
                        min="100"
                        step="100"
                      />
                      <span>원</span>
                    </div>
                  )}
                </div>
              )}
              <button
                className="start-btn"
                onClick={() => setIsConfigured(true)}
                disabled={!selectedChannel}
              >
                시작하기
              </button>
            </div>
          ) : (
            <div className="random-box-container">
              <div className="box-header">
                <h1>!뽑기를 쳐보세요</h1>
                <p className="box-warning">
                  ⚠️ 새로고침 시 모든 내역이 사라집니다
                </p>
                <div className="button-group">
                  <button onClick={handleMockDraw} className="mock-draw-btn">
                    !뽑기
                  </button>
                  <button
                    onClick={handleShowResult}
                    className="show-result-btn"
                  >
                    결과보기
                  </button>
                  <button onClick={handleReset} className="reset-btn">
                    다시하기
                  </button>
                </div>
              </div>
              {showWinnerMessage && winner && (
                <div className="winner-message">
                  {selectedItems.includes(winner)
                    ? `${
                        board.find((item) => item.id === winner)?.userId
                      }님 축하합니다!`
                    : "꽝! 다음 기회에..."}
                </div>
              )}
              {showConfetti && (
                <div className="confetti-container">
                  {Array.from({ length: 150 }).map((_, index) => (
                    <div
                      key={index}
                      className="confetti"
                      style={{
                        left: `${Math.random() * 100}vw`,
                        animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        animationDelay: `${Math.random() * 0.2}s`,
                      }}
                    />
                  ))}
                </div>
              )}
              <div className="box-content">
                <div className="board-container">
                  <div className="board-grid">
                    {board.map((item) => (
                      <div
                        key={item.id}
                        className={`board-item ${
                          selectedItems.includes(item.id) ? "selected" : ""
                        } ${winner === item.id ? "winner-animate" : ""}`}
                        style={{
                          boxShadow: selectedItems.includes(item.id)
                            ? "0 0 10px 5px rgba(0, 0, 0, 0.2)"
                            : "none",
                        }}
                        data-tooltip={
                          selectedItems.includes(item.id) ? item.userId : ""
                        }
                      >
                        {selectedItems.includes(item.id) ? (
                          <span style={{ color: item.color }}>
                            {item.userId}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {winners.length > 0 && (
                <div className="winners-section">
                  <h2>당첨자 목록</h2>
                  <div className="winners-list">
                    {winners.map((winner, index) => (
                      <div key={winner.id} className="winner-item">
                        <span className="winner-number">{index + 1}</span>
                        <span
                          className="winner-name"
                          style={{ color: winner.color }}
                        >
                          {winner.userId}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RandomBox;

// 가상의 채팅 수집 함수
function getNewChat() {
  // 실제 구현에서는 채팅 API를 통해 데이터를 가져와야 합니다.
  return { user: "사용자1", message: "!뽑기" };
}
