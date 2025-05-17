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
    if (selectedItems.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedItems.length);
      const winningItem = selectedItems[randomIndex];
      setWinner(winningItem);
    } else {
      alert("선택된 아이템이 없습니다.");
    }
  };

  return (
    <div className="subtitle-page">
      <div className="subtitle-layout">
        <div className="subtitle-sidebar">
          <ChannelNavigator
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
          />
        </div>
        <div className="subtitle-content">
          <div className="random-box-container">
            <div className="box-header">
              <h1>!뽑기를 쳐보세요</h1>
              <p className="box-warning">
                ⚠️ 새로고침 시 모든 내역이 사라집니다
              </p>
              <button onClick={handleMockDraw} className="mock-draw-btn">
                !뽑기
              </button>
              <button onClick={handleShowResult} className="show-result-btn">
                결과보기
              </button>
            </div>
            {winner && <div className="winner-display">당첨자: {winner}</div>}
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
                    >
                      {selectedItems.includes(item.id) ? (
                        <span style={{ color: item.color }}>{item.userId}</span>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
