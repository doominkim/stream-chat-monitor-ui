import React from "react";
import "../styles/ChannelSelect.css";

interface Channel {
  id: string;
  name: string;
  logo: string;
}

interface ChannelSelectProps {
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
}

const ChannelSelect: React.FC<ChannelSelectProps> = ({
  selectedChannel,
  onChannelSelect,
}) => {
  const channels: Channel[] = [
    { id: "1", name: "채널1", logo: "channel1.png" },
    { id: "2", name: "채널2", logo: "channel2.png" },
    { id: "3", name: "채널3", logo: "channel3.png" },
  ];

  return (
    <div className="channel-select">
      <h3>채널 선택</h3>
      <div className="channel-list">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className={`channel-item ${
              selectedChannel?.id === channel.id ? "selected" : ""
            }`}
            onClick={() => onChannelSelect(channel)}
          >
            <img
              src={channel.logo}
              alt={channel.name}
              className="channel-logo"
            />
            <span className="channel-name">{channel.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelSelect;
