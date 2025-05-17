import { useState, useEffect } from "react";
import { Channel, getChannels } from "../api/channel";

const Subtitle = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getChannels();
      setChannels(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleStartStreaming = () => {
    if (!selectedChannel) {
      setError("채널을 선택해주세요.");
      return;
    }
    setIsStreaming(true);
  };

  return (
    <div className="subtitle-page">
      <div className="subtitle-container">
        <h1>AI 방송 자막</h1>
        <div className="subtitle-controls">
          {!isStreaming ? (
            <>
              <select
                className="channel-select"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                disabled={isLoading}
              >
                <option value="">채널 선택</option>
                {channels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name} ({channel.platform})
                  </option>
                ))}
              </select>
              <button
                className="button button-primary"
                onClick={handleStartStreaming}
                disabled={isLoading}
              >
                {isLoading ? "로딩 중..." : "자막 시작"}
              </button>
            </>
          ) : (
            <button
              className="button button-secondary"
              onClick={() => setIsStreaming(false)}
            >
              자막 중지
            </button>
          )}
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="subtitle-display">
          {isStreaming ? (
            <div className="subtitle-text">
              실시간 자막이 여기에 표시됩니다...
            </div>
          ) : (
            <div className="subtitle-placeholder">
              채널을 선택하고 자막 시작 버튼을 눌러주세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subtitle;
