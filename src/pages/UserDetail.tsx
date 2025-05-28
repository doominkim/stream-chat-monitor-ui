import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { findChat, ChatType } from "../api/chat";
import {
  findChannels,
  Channel as APIChannel,
  ChannelSortField,
  ChannelSortOrder,
} from "../api/channel";
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
  channelLive?: {
    id: number;
    liveId: number;
    liveTitle: string;
    chatChannelId: string | null;
    chatActive: boolean;
    status: boolean;
    liveCategory: {
      id: number;
      categoryType: string;
      liveCategory: string;
      liveCategoryValue: string;
    };
  };
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
  chatType?: ChatType;
  extras?: {
    payAmount?: number;
    [key: string]: unknown;
  };
  profile?: Profile;
  channelLive?: {
    id: number;
    liveId: number;
    liveTitle: string;
    chatChannelId: string | null;
    chatActive: boolean;
    status: boolean;
    liveCategory: {
      id: number;
      categoryType: string;
      liveCategory: string;
      liveCategoryValue: string;
    };
  };
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sentiment: "positive" | "negative" | "neutral";
  nickname?: string;
  chatType?: ChatType;
  extras?: {
    payAmount?: number;
    [key: string]: unknown;
  };
  profile?: Profile;
  channelLive?: {
    liveTitle: string;
    liveCategory: {
      liveCategoryValue: string;
    };
  };
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatTypeFilter, setChatTypeFilter] = useState<ChatType | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<ChannelSortField>(
    ChannelSortField.CHAT_CREATED_AT
  );
  const [sortOrder, setSortOrder] = useState<ChannelSortOrder>(
    ChannelSortOrder.DESC
  );
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const chatListRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserScrollingRef = useRef<boolean>(false);

  const loadChannels = async (userNickname: string) => {
    setChannelsLoading(true);
    try {
      const channelData = await findChannels({
        nickname: userNickname,
        sortBy,
        sortOrder,
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
            channelLive: channel.channelLive, // channelLive 정보 추가
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

  const loadChatMessages = useCallback(
    async (
      channel: Channel,
      filters?: {
        message?: string;
        from?: Date;
        to?: Date;
        nickname?: string;
        chatType?: ChatType;
      },
      isManualRefresh = false
    ) => {
      if (!channel || !userId) return;

      // 수동 새로고침이 아닌 경우 (자동 업데이트) 깜박임 방지
      if (isManualRefresh) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const chatData = await findChat({
          uuid: channel.uuid,
          limit: 50,
          message: filters?.message,
          from: filters?.from,
          to: filters?.to,
          nickname: userId,
          chatType: filters?.chatType,
        });

        // API 데이터를 UI 데이터 형식으로 변환
        const transformedMessages: ChatMessage[] = chatData.map(
          (msg, index) => {
            const apiMsg = msg as ApiChatMessage; // API 응답에 추가 필드가 있을 수 있음

            console.log("채팅 메시지 변환:", {
              message: msg.message,
              channelLive: apiMsg.channelLive,
              hasChannelLive: !!apiMsg.channelLive,
            });

            return {
              id: `${channel.uuid}-${index}`,
              content: msg.message,
              timestamp: msg.createdAt, // createdAt을 timestamp로 사용
              sentiment: "neutral" as const, // 기본값으로 설정
              nickname: msg.nickname || "익명", // nickname 추가, 없으면 기본값
              chatType: apiMsg.chatType || undefined, // chatType 정보 추가
              extras: apiMsg.extras || undefined, // extras 정보 추가
              profile: apiMsg.profile || undefined, // profile 정보 추가
              channelLive: apiMsg.channelLive
                ? {
                    liveTitle: apiMsg.channelLive.liveTitle,
                    liveCategory: {
                      liveCategoryValue:
                        apiMsg.channelLive.liveCategory.liveCategoryValue,
                    },
                  }
                : undefined, // API 응답의 channelLive 사용
            };
          }
        );

        setChatMessages(transformedMessages);
      } catch (error) {
        console.error("채팅 메시지 로딩 실패:", error);
        setChatMessages([]);
      } finally {
        if (isManualRefresh) {
          setLoading(false);
        } else {
          setIsRefreshing(false);
        }
      }
    },
    [userId]
  );

  const startRealTimeUpdates = useCallback(
    (channel: Channel) => {
      // 기존 인터벌 정리
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      console.log(
        "자동 업데이트 시작 시도:",
        channel.channelName,
        "openLive:",
        channel.openLive
      );

      // 라이브 중이 아니면 자동 업데이트 안 함
      if (!channel.openLive) {
        console.log(
          "라이브 중이 아니므로 자동 업데이트 비활성화:",
          channel.channelName
        );
        return;
      }

      console.log("라이브 중이므로 자동 업데이트 활성화:", channel.channelName);

      // 3초마다 채팅 업데이트
      intervalRef.current = setInterval(() => {
        console.log(
          "자동 업데이트 실행 중...",
          new Date().toLocaleTimeString()
        );
        loadChatMessages(
          channel,
          {
            message: searchQuery || undefined,
            chatType: chatTypeFilter !== "ALL" ? chatTypeFilter : undefined,
          },
          false
        ); // 자동 업데이트이므로 false
      }, 3000);
    },
    [loadChatMessages, searchQuery, chatTypeFilter]
  );

  const stopRealTimeUpdates = useCallback(() => {
    if (intervalRef.current) {
      console.log("자동 업데이트 중지");
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleChannelSelect = (channel: Channel) => {
    console.log("채널 선택:", channel.channelName);
    setSelectedChannel(channel);
    isUserScrollingRef.current = false; // 새 채널 선택 시 자동 스크롤 활성화
    setShowScrollToBottom(false);

    // 기존 타이머 클리어
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }

    loadChatMessages(channel, undefined, true); // 초기 로드는 수동으로 처리
    startRealTimeUpdates(channel);
  };

  const handleSearch = useCallback(() => {
    if (!selectedChannel) return;

    const filters = {
      message: searchQuery || undefined,
      chatType: chatTypeFilter !== "ALL" ? chatTypeFilter : undefined,
    };

    loadChatMessages(selectedChannel, filters, true); // 검색은 수동으로 처리
    // 검색 후 실시간 업데이트 재시작
    startRealTimeUpdates(selectedChannel);
  }, [
    selectedChannel,
    searchQuery,
    chatTypeFilter,
    loadChatMessages,
    startRealTimeUpdates,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleManualRefresh = useCallback(() => {
    if (!selectedChannel) return;
    loadChatMessages(
      selectedChannel,
      {
        message: searchQuery || undefined,
        chatType: chatTypeFilter !== "ALL" ? chatTypeFilter : undefined,
      },
      true
    );
  }, [selectedChannel, searchQuery, chatTypeFilter, loadChatMessages]);

  // 스크롤 감지 함수
  const handleScroll = useCallback(() => {
    if (!chatListRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatListRef.current;
    const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 5; // 5px 여유로 더 정확하게

    console.log("스크롤 상태:", {
      scrollTop,
      scrollHeight,
      clientHeight,
      diff: scrollHeight - scrollTop - clientHeight,
      isAtBottom,
    });

    setShowScrollToBottom(!isAtBottom);

    // 맨 아래에 있으면 자동 스크롤 활성화
    if (isAtBottom) {
      console.log("맨 아래 도달 - 자동 스크롤 활성화");
      isUserScrollingRef.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    } else {
      // 맨 아래가 아니면 사용자가 스크롤한 것으로 간주
      console.log("사용자가 스크롤을 올림 - 자동 스크롤 비활성화");
      isUserScrollingRef.current = true;

      // 기존 타이머 클리어
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // 5초 후 자동 스크롤 재개
      scrollTimeoutRef.current = setTimeout(() => {
        console.log("5초 경과 - 자동 스크롤 재개");
        isUserScrollingRef.current = false;
      }, 5000);
    }
  }, []);

  // 맨 아래로 스크롤하는 함수
  const scrollToBottom = useCallback(() => {
    if (chatListRef.current) {
      console.log("수동으로 맨 아래로 이동");
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
      isUserScrollingRef.current = false;
      setShowScrollToBottom(false);
    }
  }, []);

  // 채팅 메시지가 업데이트될 때마다 맨 아래로 스크롤 (사용자가 스크롤 중이 아닐 때만)
  useEffect(() => {
    console.log("채팅 메시지 업데이트:", {
      messageCount: chatMessages.length,
      isUserScrolling: isUserScrollingRef.current,
      shouldAutoScroll: chatMessages.length > 0 && !isUserScrollingRef.current,
    });

    if (
      chatMessages.length > 0 &&
      chatListRef.current &&
      !isUserScrollingRef.current
    ) {
      console.log("자동 스크롤 실행");
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    } else if (isUserScrollingRef.current) {
      console.log("사용자 스크롤 중이므로 자동 스크롤 건너뜀");
    }
  }, [chatMessages]);

  useEffect(() => {
    if (userId) {
      document.title = `${userId} - 유저 분석 | 스트림 채팅 모니터`;
      loadChannels(userId);
    }
    return () => {
      document.title = "스트림 채팅 모니터";
      stopRealTimeUpdates(); // 컴포넌트 언마운트 시 인터벌 정리
    };
  }, [userId, sortBy, sortOrder, stopRealTimeUpdates]);

  // 선택된 채널이 변경될 때 자동 업데이트 재시작
  useEffect(() => {
    if (selectedChannel) {
      startRealTimeUpdates(selectedChannel);
    }
    return () => {
      stopRealTimeUpdates();
    };
  }, [selectedChannel, startRealTimeUpdates, stopRealTimeUpdates]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

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
            <div className="channels-sort">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as ChannelSortField);
                  if (userId) loadChannels(userId);
                }}
                className="sort-select"
              >
                <option value={ChannelSortField.CHAT_CREATED_AT}>
                  최신 채팅순
                </option>
                <option value={ChannelSortField.FOLLOWER}>팔로워순</option>
                <option value={ChannelSortField.OPEN_LIVE}>
                  라이브 상태순
                </option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value as ChannelSortOrder);
                  if (userId) loadChannels(userId);
                }}
                className="sort-select"
              >
                <option value={ChannelSortOrder.DESC}>내림차순</option>
                <option value={ChannelSortOrder.ASC}>오름차순</option>
              </select>
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
                          <span className="last-chat-date">
                            {(() => {
                              const lastChatDate = new Date(
                                channel.lastChatDate
                              );
                              const today = new Date();
                              const isToday =
                                lastChatDate.toDateString() ===
                                today.toDateString();

                              if (isToday) {
                                // 오늘인 경우 시간만 표시
                                return lastChatDate.toLocaleTimeString(
                                  "ko-KR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                );
                              } else {
                                // 오늘이 아닌 경우 날짜만 표시
                                return lastChatDate.toLocaleDateString(
                                  "ko-KR",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                );
                              }
                            })()}
                          </span>
                        )}
                      </div>
                      {channel.channelLive && (
                        <div className="channel-live-info">
                          <span className="live-title">
                            {channel.channelLive.liveTitle}
                          </span>
                          <span className="live-category">
                            {channel.channelLive.liveCategory.liveCategoryValue}
                          </span>
                        </div>
                      )}
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
            <button
              className="refresh-button"
              onClick={handleManualRefresh}
              disabled={loading || isRefreshing}
              title={
                loading
                  ? "새로고침 중..."
                  : isRefreshing
                  ? "자동 업데이트 중..."
                  : "채팅 새로고침"
              }
            >
              ⟳ 새로고침
            </button>
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
            <select
              value={chatTypeFilter}
              onChange={(e) => {
                setChatTypeFilter(e.target.value as ChatType | "ALL");
                if (selectedChannel) {
                  const filters = {
                    message: searchQuery || undefined,
                    chatType:
                      e.target.value !== "ALL"
                        ? (e.target.value as ChatType)
                        : undefined,
                  };
                  loadChatMessages(selectedChannel, filters, true);
                  startRealTimeUpdates(selectedChannel);
                }
              }}
              className="chat-type-filter"
            >
              <option value="ALL">전체</option>
              <option value={ChatType.CHAT}>일반 채팅</option>
              <option value={ChatType.DONATION}>도네이션</option>
            </select>
          </div>
          <div className="chats-list" ref={chatListRef} onScroll={handleScroll}>
            {loading ? (
              <div className="loading-state">채팅을 불러오는 중...</div>
            ) : chatMessages.length > 0 ? (
              (() => {
                // 날짜별로 메시지 그룹화
                const groupedMessages = chatMessages.reduce(
                  (groups, message) => {
                    const date = new Date(message.timestamp);
                    const isValidDate = !isNaN(date.getTime());
                    const dateKey = isValidDate
                      ? date.toLocaleDateString("ko-KR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "날짜 정보 없음";

                    if (!groups[dateKey]) {
                      groups[dateKey] = [];
                    }
                    groups[dateKey].push(message);
                    return groups;
                  },
                  {} as Record<string, typeof chatMessages>
                );

                return Object.entries(groupedMessages).map(
                  ([dateKey, messages]) => (
                    <div key={dateKey} className="date-group">
                      <div className="date-card">{dateKey}</div>
                      {messages.map((message) => {
                        const date = new Date(message.timestamp);
                        const isValidDate = !isNaN(date.getTime());
                        const formattedTime = isValidDate
                          ? date.toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })
                          : "시간 정보 없음";

                        console.log("채팅 메시지 렌더링:", {
                          messageId: message.id,
                          hasChannelLive: !!message.channelLive,
                          channelLive: message.channelLive,
                        });

                        return (
                          <div
                            key={message.id}
                            className={`chat-message ${message.sentiment} ${
                              message.chatType
                                ? `chat-type-${message.chatType.toLowerCase()}`
                                : ""
                            }`}
                          >
                            <div className="chat-content">
                              {message.chatType &&
                                message.chatType !== ChatType.CHAT && (
                                  <span className="chat-type-icon">
                                    {message.chatType === ChatType.DONATION &&
                                      "💰"}
                                  </span>
                                )}
                              <span
                                className="chat-nickname"
                                style={{
                                  color: normalizeColorCode(
                                    message.profile?.streamingProperty
                                      ?.nicknameColor?.colorCode || ""
                                  ),
                                }}
                              >
                                {message.profile?.activityBadges &&
                                  message.profile.activityBadges.length > 0 && (
                                    <div className="activity-badges">
                                      {message.profile.activityBadges.map(
                                        (badge) => (
                                          <img
                                            key={badge.id}
                                            src={badge.imageUrl}
                                            alt={badge.name}
                                            title={
                                              badge.description || badge.name
                                            }
                                            className="activity-badge"
                                          />
                                        )
                                      )}
                                    </div>
                                  )}
                                {message.nickname}
                              </span>
                              {message.chatType === ChatType.DONATION &&
                                message.extras?.payAmount && (
                                  <span className="donation-amount">
                                    {message.extras.payAmount.toLocaleString()}
                                    원
                                  </span>
                                )}
                              <span className="chat-text">
                                {message.content}
                              </span>
                              <span className="chat-time">{formattedTime}</span>
                            </div>
                            {message.channelLive && (
                              <div className="chat-live-info">
                                <span className="chat-live-title">
                                  {message.channelLive.liveTitle}
                                </span>
                                <span className="chat-live-category">
                                  {
                                    message.channelLive.liveCategory
                                      .liveCategoryValue
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                );
              })()
            ) : selectedChannel ? (
              <div className="placeholder-state">채팅이 없습니다</div>
            ) : (
              <div className="placeholder-state">채널을 선택해주세요</div>
            )}
          </div>
          {showScrollToBottom && (
            <button
              className="scroll-to-bottom-btn"
              onClick={scrollToBottom}
              title="맨 아래로 이동"
            >
              ↓
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
