import React, { useState, useEffect } from "react";
import "../styles/RandomBox.css";
import ChannelNavigator from "../components/ChannelNavigator";
import { getChatMessages, ChatType } from "../api/chat";
import { Channel } from "../api/channel";
import { FaDice, FaRedo, FaHome } from "react-icons/fa";

interface BoardItem {
  id: number;
  userId?: string;
  borderColor?: string;
  color?: string;
  message?: string;
}

interface Winner {
  id: number;
  userId: string;
  color: string;
}

const RandomBox: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [board, setBoard] = useState<BoardItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [participants, setParticipants] = useState<Set<string>>(new Set());
  const [winner, setWinner] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWinnerMessage, setShowWinnerMessage] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [isConfigured, setIsConfigured] = useState(false);
  const [collectionType, setCollectionType] = useState<"chat" | "donation">(
    "chat"
  );
  const [chatCollectionMode, setChatCollectionMode] = useState<
    "all" | "command"
  >("all");
  const [chatCommand, setChatCommand] = useState<string>("!뽑기");
  const [donationAmount, setDonationAmount] = useState<number>(1000);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const partySound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3"
  );
  const disappointmentSound = new Audio(
    "https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3"
  );
  const [hoveredItem, setHoveredItem] = useState<BoardItem | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initialBoard: BoardItem[] = Array.from(
      { length: 100 },
      (_, index) => ({
        id: index + 1,
      })
    );
    setBoard(initialBoard);
  }, []);

  useEffect(() => {
    if (
      selectedChannel &&
      isConfigured &&
      selectedChannel.channelLive?.chatChannelId &&
      startTime
    ) {
      const fetchChatMessages = async () => {
        try {
          const chatChannelId = selectedChannel.channelLive.chatChannelId;

          if (!chatChannelId) return;

          const messages = await getChatMessages(
            selectedChannel.uuid,
            chatChannelId,
            {
              limit: 20,
              chatType:
                collectionType === "chat" ? ChatType.CHAT : ChatType.DONATION,
              from: startTime,
              message:
                chatCollectionMode === "command" ? chatCommand : undefined,
            }
          );

          messages.forEach((msg) => {
            if (!participants.has(msg.nickname)) {
              const randomIndex = Math.floor(Math.random() * board.length);
              const selectedItem = board[randomIndex];
              if (!selectedItems.includes(selectedItem.id)) {
                setParticipants((prev) => new Set(prev).add(msg.nickname));
                setSelectedItems((prev) => [...prev, selectedItem.id]);
                setBoard((prev) => {
                  const newBoard = [...prev];
                  newBoard[randomIndex] = {
                    ...selectedItem,
                    userId: msg.nickname,
                    color: getRandomColor(),
                    message: msg.message,
                  };
                  return newBoard;
                });
              }
            }
          });
        } catch (error) {
          console.error("채팅 메시지 조회 실패:", error);
        }
      };

      fetchChatMessages();
      const interval = setInterval(fetchChatMessages, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [
    selectedChannel,
    isConfigured,
    collectionType,
    chatCollectionMode,
    chatCommand,
    board,
    participants,
    selectedItems,
    startTime,
  ]);

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleShowResult = () => {
    if (board.length > 0) {
      const currentTime = new Date();
      setStartTime(currentTime);

      const randomIndex = Math.floor(Math.random() * board.length);
      const winningItem = board[randomIndex];
      setWinner(winningItem.id);
      setShowWinnerMessage(true);

      if (selectedItems.includes(winningItem.id)) {
        setShowConfetti(true);
        partySound.play().catch((err) => console.log("소리 재생 실패:", err));

        const winnerInfo = board.find((item) => item.id === winningItem.id);
        if (winnerInfo?.userId && winnerInfo?.color) {
          const winner: Winner = {
            id: winnerInfo.id,
            userId: winnerInfo.userId,
            color: winnerInfo.color,
          };
          setWinners((prev) => [...prev, winner]);
        }

        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      } else {
        disappointmentSound
          .play()
          .catch((err) => console.log("소리 재생 실패:", err));
      }

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
    setWinners([]);
    setStartTime(new Date());
    setCollectionType("chat");
    setChatCollectionMode("all");
    setChatCommand("!뽑기");
    setDonationAmount(1000);
    setIsCustomAmount(false);
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
    { value: "custom" as const, label: "직접 설정" },
  ];

  const handleChannelSelect = (channel: Channel | null) => {
    setSelectedChannel(channel);
    setIsConfigured(false);
    setCollectionType("chat");
    setChatCollectionMode("all");
    setChatCommand("!뽑기");
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

  const handleStart = () => {
    setStartTime(new Date());
    setIsConfigured(true);
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
              {collectionType === "chat" && (
                <div className="config-section">
                  <h3>채팅 수집 방식</h3>
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        value="all"
                        checked={chatCollectionMode === "all"}
                        onChange={(e) =>
                          setChatCollectionMode(e.target.value as "all")
                        }
                      />
                      모든 채팅
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="command"
                        checked={chatCollectionMode === "command"}
                        onChange={(e) =>
                          setChatCollectionMode(e.target.value as "command")
                        }
                      />
                      특정 명령어
                    </label>
                  </div>
                  {chatCollectionMode === "command" && (
                    <div className="command-input">
                      <input
                        type="text"
                        value={chatCommand}
                        onChange={(e) => setChatCommand(e.target.value)}
                        placeholder="명령어 입력 (예: !뽑기)"
                        className="command-text-input"
                      />
                    </div>
                  )}
                </div>
              )}
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
                onClick={handleStart}
                disabled={!selectedChannel}
              >
                시작하기
              </button>
            </div>
          ) : (
            <div className="random-box-container">
              <div className="box-header">
                <div className="box-title">
                  <h1>!뽑기</h1>
                  <p className="box-subtitle">채팅창에 !뽑기를 입력해보세요</p>
                </div>
                <p className="box-warning">
                  ⚠️ 새로고침 시 모든 내역이 사라집니다
                </p>
                <div className="button-group">
                  <button
                    onClick={handleShowResult}
                    className="icon-btn show-result-btn"
                    title="결과보기"
                  >
                    <FaDice />
                  </button>
                  <button
                    onClick={handleReset}
                    className="icon-btn reset-btn"
                    title="다시하기"
                  >
                    <FaRedo />
                  </button>
                  <button
                    onClick={() => setIsConfigured(false)}
                    className="icon-btn back-btn"
                    title="처음으로"
                  >
                    <FaHome />
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
                        onMouseEnter={(e) => {
                          if (selectedItems.includes(item.id)) {
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            setHoverPosition({
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10,
                            });
                            setHoveredItem(item);
                          }
                        }}
                        onMouseLeave={() => setHoveredItem(null)}
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
              {hoveredItem && (
                <div
                  className="message-popover"
                  style={{
                    top: hoverPosition.y,
                    left: hoverPosition.x,
                  }}
                >
                  <div>{hoveredItem.userId}</div>
                  <div>{hoveredItem.message}</div>
                </div>
              )}
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
