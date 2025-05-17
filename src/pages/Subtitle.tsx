import { useState, useEffect } from "react";
import { Channel, getChannels } from "../api/channel";

const Subtitle = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getChannels();
      console.log("채널 목록:", data);
      setChannels(data);
    } catch (err) {
      console.error("채널 목록 조회 에러:", err);
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

  const selectedChannelInfo = channels.find(
    (channel) => channel.id === selectedChannel
  );

  return (
    <div className="subtitle-page">
      <div className="subtitle-layout">
        <div className="subtitle-sidebar">
          <div className="channel-navigator">
            <div className="channel-navigator-header">
              <div className="channel-navigator-title">채널 선택</div>
              <div className="channel-navigator-count">
                {channels.length}개의 채널
              </div>
            </div>
            <div className="channel-list">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`channel-card ${
                    selectedChannel === channel.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedChannel(channel.id)}
                >
                  <div className="channel-info">
                    <div className="channel-avatar">
                      <img
                        src={channel.channelImageUrl || "/default-avatar.png"}
                        alt={channel.channelName}
                      />
                    </div>
                    <div className="channel-details">
                      <div className="channel-name">{channel.channelName}</div>
                      <div className="channel-meta">
                        <div className="channel-status">라이브</div>
                        <div className="channel-viewers">
                          팔로워 {channel.follower.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="subtitle-main">
          <div className="subtitle-container">
            <h1>AI 방송 자막</h1>
            <div className="subtitle-controls">
              {!isStreaming ? (
                <button
                  className="button button-primary"
                  onClick={handleStartStreaming}
                  disabled={isLoading || !selectedChannel}
                >
                  {isLoading ? "로딩 중..." : "자막 시작"}
                </button>
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
                  {selectedChannelInfo
                    ? `${selectedChannelInfo.channelName}의 실시간 자막이 여기에 표시됩니다...`
                    : "실시간 자막이 여기에 표시됩니다..."}
                </div>
              ) : (
                <div className="subtitle-placeholder">
                  채널을 선택하고 자막 시작 버튼을 눌러주세요
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subtitle;
