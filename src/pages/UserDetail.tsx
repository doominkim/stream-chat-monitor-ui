import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { findChat } from "../api/chat";
import { findChannels, Channel as APIChannel } from "../api/channel";
import "../styles/UserDetail.css";

interface User {
  id: string;
  nickname: string;
  profileImage: string;
  followerCount: number;
  chatCount: number;
  tags: string[];
  aiAnalysis: string;
}

interface Channel {
  uuid: string;
  channelName: string;
  channelImageUrl: string;
  follower: number;
  openLive: boolean;
  chatCount: number;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
}

const mockUser: User = {
  id: "user123",
  nickname: "테스트유저",
  profileImage: "https://via.placeholder.com/150",
  followerCount: 1234,
  chatCount: 5678,
  tags: ["개악질러", "다크템플러", "전과8범", "채팅왕", "밤샘러"],
  aiAnalysis:
    "이 유저는 주로 밤 10시 이후에 활동하며, 채팅에서 자주 밈을 사용하고 유머러스한 반응을 보입니다. 특히 게임 실패 시 '개악질'이라는 표현을 자주 사용하는 특징이 있습니다. 다크템플러를 주로 플레이하며, 다른 시청자들과 활발한 소통을 하는 편입니다. 가끔 과도한 채팅으로 경고를 받기도 했지만, 전반적으로 긍정적인 채팅 분위기를 만드는 데 기여합니다.",
};

const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const loadChannels = async (userNickname: string) => {
    setChannelsLoading(true);
    try {
      const channelData = await findChannels({
        nickname: userNickname,
      });

      // API 데이터를 UI 데이터 형식으로 변환
      const transformedChannels: Channel[] = channelData.map(
        (channel: APIChannel) => ({
          uuid: channel.uuid,
          channelName: channel.channelName,
          channelImageUrl: channel.channelImageUrl,
          follower: channel.follower,
          openLive: channel.openLive,
          chatCount: channel.channelChatLogs?.length || 0, // channelChatLogs.length 사용
        })
      );

      setChannels(transformedChannels);
    } catch (error) {
      console.error("채널 목록 로딩 실패:", error);
      setChannels([]);
    } finally {
      setChannelsLoading(false);
    }
  };

  const loadChatMessages = async (
    channel: Channel,
    filters?: {
      message?: string;
      from?: Date;
      to?: Date;
      nickname?: string;
    }
  ) => {
    if (!channel || !userId) return;

    setLoading(true);
    try {
      const chatData = await findChat({
        uuid: channel.uuid,
        limit: 50,
        message: filters?.message,
        from: filters?.from,
        to: filters?.to,
        nickname: userId,
      });

      // API 데이터를 UI 데이터 형식으로 변환
      const transformedMessages: ChatMessage[] = chatData.map((msg, index) => ({
        id: `${channel.uuid}-${index}`,
        content: msg.message,
        timestamp: msg.timestamp,
        sentiment: "neutral" as const, // 기본값으로 설정
      }));

      setChatMessages(transformedMessages);
    } catch (error) {
      console.error("채팅 메시지 로딩 실패:", error);
      setChatMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    loadChatMessages(channel);
  };

  const handleSearch = () => {
    if (!selectedChannel) return;

    const filters = {
      message: searchQuery || undefined,
      from: dateRange.from ? new Date(dateRange.from) : undefined,
      to: dateRange.to ? new Date(dateRange.to) : undefined,
    };

    loadChatMessages(selectedChannel, filters);
  };

  useEffect(() => {
    if (userId) {
      document.title = `${userId} - 유저 분석 | 스트림 채팅 모니터`;
      loadChannels(userId);
    }
    return () => {
      document.title = "스트림 채팅 모니터";
    };
  }, [userId]);

  return (
    <div className="user-detail-page">
      <div className="user-profile-card">
        <div className="user-profile-info">
          <div className="user-header">
            <h1>{userId || "알 수 없는 사용자"}</h1>
            <div className="user-tags">
              {mockUser.tags.map((tag) => (
                <span key={tag} className="user-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="user-ai-analysis">
            <h3>AI 분석</h3>
            <p>{mockUser.aiAnalysis}</p>
          </div>
        </div>
      </div>

      <div className="user-content">
        <div className="user-channels">
          <div className="channel-navigator">
            <div className="channel-navigator-header">
              <div className="channel-navigator-title">채팅 채널</div>
              <div className="channel-navigator-count">
                {channelsLoading ? "로딩 중..." : `${channels.length}개의 채널`}
              </div>
            </div>
            <div className="channel-list">
              {channelsLoading ? (
                <div className="channel-loading">채널을 불러오는 중...</div>
              ) : channels.length > 0 ? (
                channels.map((channel) => (
                  <div
                    key={channel.uuid}
                    className={`channel-card ${
                      selectedChannel?.uuid === channel.uuid ? "selected" : ""
                    }`}
                    onClick={() => handleChannelSelect(channel)}
                  >
                    <div className="channel-info">
                      <div
                        className={`channel-avatar ${
                          channel.openLive ? "live" : ""
                        }`}
                      >
                        <img
                          src={channel.channelImageUrl}
                          alt={channel.channelName}
                        />
                      </div>
                      <div className="channel-details">
                        <div className="channel-name">
                          {channel.channelName}
                        </div>
                        <div className="channel-meta">
                          <div className="channel-viewers">
                            • {channel.follower.toLocaleString()}
                          </div>
                          <div className="channel-chat-count">
                            • 채팅 {channel.chatCount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="channel-placeholder">
                  해당 사용자의 채널을 찾을 수 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="user-chats">
          {selectedChannel ? (
            <div className="chat-section">
              <div className="chat-filters">
                <div className="filter-row">
                  <input
                    type="text"
                    placeholder="메시지 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                <div className="filter-row">
                  <input
                    type="datetime-local"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    className="date-input"
                  />
                  <span>~</span>
                  <input
                    type="datetime-local"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="date-input"
                  />
                </div>
                <div className="filter-actions">
                  <button onClick={handleSearch} className="search-btn">
                    검색
                  </button>
                </div>
              </div>

              <div className="chat-list">
                {loading ? (
                  <div className="chat-loading">채팅을 불러오는 중...</div>
                ) : chatMessages.length > 0 ? (
                  <>
                    <div className="chat-date-header">
                      {chatMessages[0] &&
                        new Date(
                          chatMessages[0].timestamp
                        ).toLocaleDateString()}
                    </div>
                    {chatMessages.map((chat) => (
                      <div key={chat.id} className="chat-item">
                        <div className="chat-content">{chat.content}</div>
                        <div className="chat-meta">
                          <span className="chat-time">
                            {new Date(chat.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="chat-placeholder">
                    선택한 채널에 채팅 메시지가 없습니다.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="chat-placeholder">
              채널을 선택하면 채팅 내역이 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
