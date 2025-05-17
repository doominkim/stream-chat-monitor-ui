import { useState } from "react";

const Subtitle = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <div className="subtitle-page">
      <div className="subtitle-container">
        <h1>AI 방송 자막</h1>
        <div className="subtitle-controls">
          <button
            className={`button ${
              isStreaming ? "button-secondary" : "button-primary"
            }`}
            onClick={() => setIsStreaming(!isStreaming)}
          >
            {isStreaming ? "자막 중지" : "자막 시작"}
          </button>
        </div>
        <div className="subtitle-display">
          {isStreaming ? (
            <div className="subtitle-text">
              실시간 자막이 여기에 표시됩니다...
            </div>
          ) : (
            <div className="subtitle-placeholder">
              자막 시작 버튼을 눌러주세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subtitle;
