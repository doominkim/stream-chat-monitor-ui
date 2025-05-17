import React, { useState } from "react";
import "../styles/RandomBox.css";

interface BoxItem {
  id: number;
  name: string;
  probability: number;
  image: string;
}

const RandomBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<BoxItem | null>(null);

  const boxItems: BoxItem[] = [
    { id: 1, name: "레어 아이템", probability: 0.1, image: "rare.png" },
    { id: 2, name: "일반 아이템", probability: 0.4, image: "normal.png" },
    { id: 3, name: "일반 아이템2", probability: 0.5, image: "normal2.png" },
  ];

  const openBox = () => {
    setIsOpen(true);
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const item of boxItems) {
      cumulativeProbability += item.probability;
      if (random <= cumulativeProbability) {
        setResult(item);
        break;
      }
    }
  };

  return (
    <div className="random-box-container">
      <h1>후원 랜덤박스</h1>
      <div className="box-content">
        {!isOpen ? (
          <button className="open-box-btn" onClick={openBox}>
            박스 열기
          </button>
        ) : (
          <div className="result-container">
            <h2>축하합니다!</h2>
            <p>당신의 아이템: {result?.name}</p>
            <button onClick={() => setIsOpen(false)}>다시 열기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomBox;
