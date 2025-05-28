import React, { useState, useEffect, useRef } from "react";
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
  openLive: boolean;
  chatCount: number;
  lastChatDate?: string;
}

interface ActivityBadge {
  id: string;
  name: string;
  imageUrl: string;
  description?: string;
}

interface NicknameColor {
  colorCode: string;
}

interface StreamingProperty {
  nicknameColor?: NicknameColor;
}

interface Profile {
  activityBadges?: ActivityBadge[];
  streamingProperty?: StreamingProperty;
}

interface ExtendedChannelChatLog {
  createdAt: string;
  [key: string]: unknown;
}

interface ApiChatMessage {
  user: string;
  nickname: string;
  message: string;
  timestamp: string;
  createdAt: string;
  profile?: Profile;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
  nickname?: string;
  profile?: Profile;
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

// 색상 코드 검증 및 정규화 함수
const normalizeColorCode = (colorCode: string): string => {
  if (!colorCode) return "#00ffa3";

  // # 제거
  const cleanCode = colorCode.replace("#", "");

  // 유효한 16진수인지 확인
  if (!/^[0-9A-Fa-f]+$/.test(cleanCode)) {
    console.warn(`Invalid color code: ${colorCode}, using default`);
    return "#00ffa3";
  }

  // 길이에 따른 처리
  if (cleanCode.length === 3) {
    // 3자리 -> 6자리로 확장 (예: F00 -> FF0000)
    return `#${cleanCode
      .split("")
      .map((c) => c + c)
      .join("")}`;
  } else if (cleanCode.length === 6) {
    // 6자리는 그대로
    return `#${cleanCode}`;
  } else if (cleanCode.length === 5) {
    // 5자리는 앞에 0 추가해서 6자리로 (예: CC000 -> 0CC000)
    console.warn(`5-digit color code detected: ${colorCode}, padding with 0`);
    return `#0${cleanCode}`;
  } else {
    // 기타 잘못된 길이
    console.warn(`Invalid color code length: ${colorCode}, using default`);
    return "#00ffa3";
  }
};

const UserDetail: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelsLoading, setChannelsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const chatListRef = useRef<HTMLDivElement>(null);

  const loadChannels = async (userNickname: string) => {
    setChannelsLoading(true);
    try {
      const channelData = await findChannels({
        nickname: userNickname,
      });

      // API 데이터를 UI 데이터 형식으로 변환
      const transformedChannels: Channel[] = channelData.map(
        (channel: APIChannel) => {
          // 마지막 채팅 날짜 추출
          const lastChatDate =
            channel.channelChatLogs && channel.channelChatLogs.length > 0
              ? (
                  channel.channelChatLogs[
                    channel.channelChatLogs.length - 1
                  ] as unknown as ExtendedChannelChatLog
                ).createdAt
              : undefined;

          return {
            uuid: channel.uuid,
            channelName: channel.channelName,
            channelImageUrl: channel.channelImageUrl,
            openLive: channel.openLive,
            chatCount: channel.channelChatLogs?.length || 0, // channelChatLogs.length 사용
            lastChatDate: lastChatDate,
          };
        }
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
      const transformedMessages: ChatMessage[] = chatData.map((msg, index) => {
        const apiMsg = msg as ApiChatMessage; // API 응답에 추가 필드가 있을 수 있음
        return {
          id: `${channel.uuid}-${index}`,
          content: msg.message,
          timestamp: msg.createdAt, // createdAt을 timestamp로 사용
          sentiment: "neutral" as const, // 기본값으로 설정
          nickname: msg.nickname || "익명", // nickname 추가, 없으면 기본값
          profile: apiMsg.profile || undefined, // profile 정보 추가
        };
      });

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
    };

    loadChatMessages(selectedChannel, filters);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  // 채팅 메시지가 업데이트될 때마다 맨 아래로 스크롤
  useEffect(() => {
    if (chatMessages.length > 0 && chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="user-detail-page">
      <div className="user-profile-section">
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

      <div className="content-section">
        <div className="channels-panel">
          <div className="channels-header">
            <div className="channels-title">채팅 채널</div>
            <div className="channels-count">
              {channelsLoading ? "로딩 중..." : `${channels.length}개의 채널`}
            </div>
          </div>
          <div className="channels-list">
            {channelsLoading ? (
              <div className="loading-state">채널을 불러오는 중...</div>
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
                        src={
                          channel.channelImageUrl ||
                          "https://via.placeholder.com/40"
                        }
                        alt={channel.channelName}
                      />
                    </div>
                    <div className="channel-details">
                      <div className="channel-name">{channel.channelName}</div>
                      <div className="channel-meta">
                        <span>채팅 {channel.chatCount}개</span>
                        {channel.lastChatDate && (
                          <span>
                            최근:{" "}
                            {new Date(channel.lastChatDate).toLocaleDateString(
                              "ko-KR",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="placeholder-state">채널이 없습니다</div>
            )}
          </div>
        </div>

        <div className="chats-panel">
          <div className="chats-header">
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
              {selectedChannel ? `${selectedChannel.channelName} 채팅` : "채팅"}
            </h2>
          </div>
          <div className="chat-filters">
            <input
              type="text"
              className="filter-input"
              placeholder="메시지 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="chats-list" ref={chatListRef}>
            {loading ? (
              <div className="loading-state">채팅을 불러오는 중...</div>
            ) : chatMessages.length > 0 ? (
              chatMessages.map((message) => {
                const date = new Date(message.timestamp);
                const isValidDate = !isNaN(date.getTime());
                const formattedTime = isValidDate
                  ? date.toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "시간 정보 없음";

                return (
                  <div
                    key={message.id}
                    className={`chat-message ${message.sentiment}`}
                  >
                    <div className="chat-content">
                      <span
                        className="chat-nickname"
                        style={{
                          color: normalizeColorCode(
                            message.profile?.streamingProperty?.nicknameColor
                              ?.colorCode || ""
                          ),
                        }}
                      >
                        {message.profile?.activityBadges &&
                          message.profile.activityBadges.length > 0 && (
                            <div className="activity-badges">
                              {message.profile.activityBadges.map((badge) => (
                                <img
                                  key={badge.id}
                                  src={badge.imageUrl}
                                  alt={badge.name}
                                  title={badge.description || badge.name}
                                  className="activity-badge"
                                />
                              ))}
                            </div>
                          )}
                        {message.nickname}
                      </span>
                      <span className="chat-text">{message.content}</span>
                      <span className="chat-time">{formattedTime}</span>
                    </div>
                  </div>
                );
              })
            ) : selectedChannel ? (
              <div className="placeholder-state">채팅이 없습니다</div>
            ) : (
              <div className="placeholder-state">채널을 선택해주세요</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
