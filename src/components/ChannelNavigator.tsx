import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/ChannelNavigator.css";
import { getChannels, Channel } from "../api/channel";

interface ChannelNavigatorProps {
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel | null) => void;
  className?: string;
}

const ChannelNavigator: React.FC<ChannelNavigatorProps> = ({
  selectedChannel,
  onChannelSelect,
  className = "",
}) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const data = await getChannels();
        setChannels(data);
      } catch (err) {
        console.error("채널 목록을 불러오는데 실패했습니다:", err);
      }
    };
    fetchChannels();
  }, []);

  return (
    <div className={`channel-navigator ${className}`}>
      <div className="channel-navigator-header">
        <div className="channel-navigator-title">채널 선택</div>
        <div className="channel-navigator-count">
          {channels.length}개의 채널
        </div>
      </div>
      <div className="channel-list">
        {channels.map((channel) =>
          onChannelSelect ? (
            <div
              key={channel.uuid}
              className={`channel-card ${
                selectedChannel?.uuid === channel.uuid ? "selected" : ""
              }`}
              onClick={() => onChannelSelect(channel)}
            >
              <div className="channel-info">
                <div
                  className={`channel-avatar ${channel.openLive ? "live" : ""}`}
                >
                  <img
                    src={channel.channelImageUrl}
                    alt={channel.channelName}
                  />
                </div>
                <div className="channel-details">
                  <div className="channel-name">
                    {channel.channelName}
                    {channel.isEnabledAi && (
                      <span className="ai-tag">AI 분석중</span>
                    )}
                  </div>
                  <div className="channel-meta">
                    {channel.channelLive?.liveCategory?.liveCategoryValue && (
                      <span className="channel-category">
                        {channel.channelLive.liveCategory.liveCategoryValue}
                      </span>
                    )}
                    {channel.openLive && (
                      <div className="channel-viewers">
                        • {channel.follower.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link
              key={channel.uuid}
              to={`/channel/${channel.uuid}${currentPath}`}
              className="channel-card"
            >
              <div className="channel-info">
                <div
                  className={`channel-avatar ${channel.openLive ? "live" : ""}`}
                >
                  <img
                    src={channel.channelImageUrl}
                    alt={channel.channelName}
                  />
                </div>
                <div className="channel-details">
                  <div className="channel-name">
                    {channel.channelName}
                    {channel.isEnabledAi && (
                      <span className="ai-tag">AI 분석중</span>
                    )}
                  </div>
                  <div className="channel-meta">
                    {channel.channelLive?.liveCategory?.liveCategoryValue && (
                      <span className="channel-category">
                        {channel.channelLive.liveCategory.liveCategoryValue}
                      </span>
                    )}
                    {channel.openLive && (
                      <div className="channel-viewers">
                        • {channel.follower.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default ChannelNavigator;
