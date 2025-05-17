import React, { useState } from "react";
import "../styles/RandomBox.css";
import { BoxItem, openRandomBox } from "../api/randomBox";
import ChannelNavigator from "../components/ChannelNavigator";

interface Channel {
  id: string;
  name: string;
  logo: string;
  openLive: boolean;
  follower: number;
  gameCategory?: string;
}

const RandomBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<BoxItem | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(1000);

  const handleOpenBox = async () => {
    if (!selectedChannel) {
      alert("채널을 선택해주세요!");
      return;
    }
    try {
      setLoading(true);
      const response = await openRandomBox(selectedChannel.id, amount);
      setResult(response.item);
      setIsOpen(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "박스를 여는데 실패했습니다."
      );
    } finally {
      setLoading(false);
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
            <h1>후원 랜덤박스</h1>
            {error && <div className="error-message">{error}</div>}
            <div className="box-content">
              {loading ? (
                <div className="loading">로딩 중...</div>
              ) : !isOpen ? (
                <div className="box-controls">
                  <div className="amount-control">
                    <label htmlFor="amount">후원 금액:</label>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min="1000"
                      step="1000"
                    />
                    <span>원</span>
                  </div>
                  <button
                    className="open-box-btn"
                    onClick={handleOpenBox}
                    disabled={!selectedChannel || loading}
                  >
                    박스 열기
                  </button>
                </div>
              ) : (
                <div className="result-container">
                  <h2>축하합니다!</h2>
                  <p>당신의 아이템: {result?.name}</p>
                  <p>가격: {result?.price.toLocaleString()}원</p>
                  <button onClick={() => setIsOpen(false)}>다시 열기</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomBox;
