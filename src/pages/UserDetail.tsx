import React, { useState, useEffect } from "react";
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

const mockChannels: Channel[] = [
  {
    uuid: "channel1",
    channelName: "채널1",
    channelImageUrl: "https://via.placeholder.com/150",
    follower: 1000,
    openLive: true,
    chatCount: 150,
  },
  {
    uuid: "channel2",
    channelName: "채널2",
    channelImageUrl: "https://via.placeholder.com/150",
    follower: 2000,
    openLive: false,
    chatCount: 300,
  },
  {
    uuid: "channel3",
    channelName: "채널3",
    channelImageUrl: "https://via.placeholder.com/150",
    follower: 3000,
    openLive: true,
    chatCount: 450,
  },
];

const mockChats: Record<string, ChatMessage[]> = {
  channel1: [
    {
      id: "1",
      content: "안녕하세요! 오늘도 재미있는 방송 감사합니다!",
      timestamp: "2024-03-20 19:00:00",
      sentiment: "positive",
    },
    {
      id: "2",
      content: "이번 게임 정말 재미있네요!",
      timestamp: "2024-03-20 19:05:00",
      sentiment: "positive",
    },
    {
      id: "3",
      content: "아쉽네요... 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 19:10:00",
      sentiment: "neutral",
    },
    {
      id: "4",
      content: "이거 어떻게 하는 거예요?",
      timestamp: "2024-03-20 19:15:00",
      sentiment: "neutral",
    },
    {
      id: "5",
      content: "와 진짜 대박이네요!",
      timestamp: "2024-03-20 19:20:00",
      sentiment: "positive",
    },
    {
      id: "6",
      content: "이거 실패했네요...",
      timestamp: "2024-03-20 19:25:00",
      sentiment: "negative",
    },
    {
      id: "7",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 19:30:00",
      sentiment: "neutral",
    },
    {
      id: "8",
      content: "방송 잘 보고 있습니다!",
      timestamp: "2024-03-20 19:35:00",
      sentiment: "positive",
    },
  ],
  channel2: [
    {
      id: "9",
      content: "방송 잘 보고 있습니다!",
      timestamp: "2024-03-20 20:00:00",
      sentiment: "positive",
    },
    {
      id: "10",
      content: "이거 실패했네요...",
      timestamp: "2024-03-20 20:05:00",
      sentiment: "negative",
    },
    {
      id: "11",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 20:10:00",
      sentiment: "neutral",
    },
    {
      id: "12",
      content: "와 진짜 대박이네요!",
      timestamp: "2024-03-20 20:15:00",
      sentiment: "positive",
    },
    {
      id: "13",
      content: "이거 어떻게 하는 거예요?",
      timestamp: "2024-03-20 20:20:00",
      sentiment: "neutral",
    },
  ],
  channel3: [
    {
      id: "14",
      content: "오늘도 좋은 방송 감사합니다!",
      timestamp: "2024-03-20 21:00:00",
      sentiment: "positive",
    },
    {
      id: "15",
      content: "이거 어떻게 하는 거예요?",
      timestamp: "2024-03-20 21:05:00",
      sentiment: "neutral",
    },
    {
      id: "16",
      content: "와 진짜 대박이네요!",
      timestamp: "2024-03-20 21:10:00",
      sentiment: "positive",
    },
    {
      id: "17",
      content: "이거 실패했네요...",
      timestamp: "2024-03-20 21:15:00",
      sentiment: "negative",
    },
    {
      id: "18",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 21:20:00",
      sentiment: "neutral",
    },
    {
      id: "19",
      content: "방송 잘 보고 있습니다!",
      timestamp: "2024-03-20 21:25:00",
      sentiment: "positive",
    },
  ],
};

const UserDetail: React.FC = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  useEffect(() => {
    document.title = `${mockUser.nickname} - 유저 분석 | 스트림 채팅 모니터`;
    return () => {
      document.title = "스트림 채팅 모니터";
    };
  }, [mockUser.nickname]);

  return (
    <div className="user-detail-page">
      <div className="user-profile-card">
        <div className="user-profile-info">
          <div className="user-header">
            <h1>{mockUser.nickname}</h1>
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
                {mockChannels.length}개의 채널
              </div>
            </div>
            <div className="channel-list">
              {mockChannels.map((channel) => (
                <div
                  key={channel.uuid}
                  className={`channel-card ${
                    selectedChannel?.uuid === channel.uuid ? "selected" : ""
                  }`}
                  onClick={() => setSelectedChannel(channel)}
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
                      <div className="channel-name">{channel.channelName}</div>
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
              ))}
            </div>
          </div>
        </div>
        <div className="user-chats">
          {selectedChannel ? (
            <div className="chat-list">
              <div className="chat-date-header">
                {new Date(
                  mockChats[selectedChannel.uuid][0].timestamp
                ).toLocaleDateString()}
              </div>
              {mockChats[selectedChannel.uuid]?.map((chat) => (
                <div key={chat.id} className={`chat-item ${chat.sentiment}`}>
                  <div className="chat-content">{chat.content}</div>
                  <div className="chat-meta">
                    <span className="chat-time">
                      {new Date(chat.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`chat-sentiment ${chat.sentiment}`}>
                      {chat.sentiment === "positive" && "긍정적"}
                      {chat.sentiment === "negative" && "부정적"}
                      {chat.sentiment === "neutral" && "중립적"}
                    </span>
                  </div>
                </div>
              ))}
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
