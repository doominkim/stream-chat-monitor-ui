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
      content:
        "안녕하세요! 오늘도 재미있는 방송 감사합니다! 오늘은 어떤 게임을 하실 건가요? 저는 개인적으로 다크템플러 플레이를 기대하고 있습니다. 특히 지난번에 보여주신 그 멋진 플레이가 정말 인상적이었어요. 오늘도 좋은 방송 부탁드립니다!",
      timestamp: "2024-03-20 19:00:00",
      sentiment: "positive",
    },
    {
      id: "2",
      content:
        "이번 게임 정말 재미있네요! 특히 그 전략적인 플레이가 정말 인상적이에요. 어떻게 그런 아이디어를 떠올리셨나요? 저도 한번 도전해보고 싶은데, 혹시 초보자도 할 수 있을까요?",
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
    {
      id: "20",
      content:
        "와! 이번 전략 정말 대박이네요. 어떻게 이런 아이디어를 떠올리셨나요? 저도 한번 도전해보고 싶은데, 혹시 초보자도 할 수 있을까요? 그리고 혹시 추천해주실 만한 초보자용 빌드가 있으신가요?",
      timestamp: "2024-03-20 19:40:00",
      sentiment: "positive",
    },
    {
      id: "21",
      content: "이거 실패했네요... 다음에는 더 잘할 수 있을 거예요!",
      timestamp: "2024-03-20 19:45:00",
      sentiment: "negative",
    },
    {
      id: "22",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 19:50:00",
      sentiment: "positive",
    },
    {
      id: "23",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 19:55:00",
      sentiment: "neutral",
    },
    {
      id: "24",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 20:00:00",
      sentiment: "positive",
    },
    {
      id: "25",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 20:05:00",
      sentiment: "neutral",
    },
    {
      id: "26",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 20:10:00",
      sentiment: "negative",
    },
    {
      id: "27",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 20:15:00",
      sentiment: "positive",
    },
    {
      id: "28",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 20:20:00",
      sentiment: "neutral",
    },
    {
      id: "29",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 20:25:00",
      sentiment: "positive",
    },
    {
      id: "30",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 20:30:00",
      sentiment: "neutral",
    },
    {
      id: "31",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 20:35:00",
      sentiment: "negative",
    },
    {
      id: "32",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 20:40:00",
      sentiment: "positive",
    },
    {
      id: "33",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 20:45:00",
      sentiment: "neutral",
    },
    {
      id: "34",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 20:50:00",
      sentiment: "positive",
    },
    {
      id: "35",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 20:55:00",
      sentiment: "neutral",
    },
    {
      id: "36",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 21:00:00",
      sentiment: "negative",
    },
    {
      id: "37",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 21:05:00",
      sentiment: "positive",
    },
    {
      id: "38",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 21:10:00",
      sentiment: "neutral",
    },
    {
      id: "39",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 21:15:00",
      sentiment: "positive",
    },
    {
      id: "40",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 21:20:00",
      sentiment: "neutral",
    },
    {
      id: "41",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 21:25:00",
      sentiment: "negative",
    },
    {
      id: "42",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 21:30:00",
      sentiment: "positive",
    },
    {
      id: "43",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 21:35:00",
      sentiment: "neutral",
    },
    {
      id: "44",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 21:40:00",
      sentiment: "positive",
    },
    {
      id: "45",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 21:45:00",
      sentiment: "neutral",
    },
    {
      id: "46",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 21:50:00",
      sentiment: "negative",
    },
    {
      id: "47",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 21:55:00",
      sentiment: "positive",
    },
    {
      id: "48",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 22:00:00",
      sentiment: "neutral",
    },
    {
      id: "49",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 22:05:00",
      sentiment: "positive",
    },
    {
      id: "50",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 22:10:00",
      sentiment: "neutral",
    },
    {
      id: "51",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 22:15:00",
      sentiment: "negative",
    },
    {
      id: "52",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 22:20:00",
      sentiment: "positive",
    },
    {
      id: "53",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 22:25:00",
      sentiment: "neutral",
    },
    {
      id: "54",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 22:30:00",
      sentiment: "positive",
    },
    {
      id: "55",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 22:35:00",
      sentiment: "neutral",
    },
    {
      id: "56",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 22:40:00",
      sentiment: "negative",
    },
    {
      id: "57",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 22:45:00",
      sentiment: "positive",
    },
    {
      id: "58",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 22:50:00",
      sentiment: "neutral",
    },
    {
      id: "59",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 22:55:00",
      sentiment: "positive",
    },
    {
      id: "60",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 23:00:00",
      sentiment: "neutral",
    },
    {
      id: "61",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 23:05:00",
      sentiment: "negative",
    },
    {
      id: "62",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 23:10:00",
      sentiment: "positive",
    },
    {
      id: "63",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 23:15:00",
      sentiment: "neutral",
    },
    {
      id: "64",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 23:20:00",
      sentiment: "positive",
    },
    {
      id: "65",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 23:25:00",
      sentiment: "neutral",
    },
    {
      id: "66",
      content: "이거 실패했네요... 하지만 다음에는 이길 수 있을 거예요!",
      timestamp: "2024-03-20 23:30:00",
      sentiment: "negative",
    },
    {
      id: "67",
      content: "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다.",
      timestamp: "2024-03-20 23:35:00",
      sentiment: "positive",
    },
    {
      id: "68",
      content: "이거 어떻게 하는 거예요? 설명해주실 수 있나요?",
      timestamp: "2024-03-20 23:40:00",
      sentiment: "neutral",
    },
    {
      id: "69",
      content: "와 진짜 대박이네요! 이런 플레이 처음 봐요!",
      timestamp: "2024-03-20 23:45:00",
      sentiment: "positive",
    },
    {
      id: "70",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-20 23:50:00",
      sentiment: "neutral",
    },
  ],
  channel2: [
    {
      id: "9",
      content:
        "방송 잘 보고 있습니다! 오늘도 좋은 컨텐츠 감사합니다. 특히 지난번에 보여주신 그 멋진 플레이가 정말 인상적이었어요. 오늘도 좋은 방송 부탁드립니다!",
      timestamp: "2024-03-19 20:00:00",
      sentiment: "positive",
    },
    {
      id: "10",
      content: "이거 실패했네요...",
      timestamp: "2024-03-19 20:05:00",
      sentiment: "negative",
    },
    {
      id: "11",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-19 20:10:00",
      sentiment: "neutral",
    },
    {
      id: "12",
      content: "와 진짜 대박이네요!",
      timestamp: "2024-03-19 20:15:00",
      sentiment: "positive",
    },
    {
      id: "13",
      content: "이거 어떻게 하는 거예요?",
      timestamp: "2024-03-19 20:20:00",
      sentiment: "neutral",
    },
  ],
  channel3: [
    {
      id: "14",
      content:
        "오늘도 좋은 방송 감사합니다! 특히 그 전략적인 플레이가 정말 인상적이에요. 어떻게 그런 아이디어를 떠올리셨나요? 저도 한번 도전해보고 싶은데, 혹시 초보자도 할 수 있을까요? 그리고 혹시 추천해주실 만한 초보자용 빌드가 있으신가요?",
      timestamp: "2024-03-18 21:00:00",
      sentiment: "positive",
    },
    {
      id: "15",
      content: "이거 어떻게 하는 거예요?",
      timestamp: "2024-03-18 21:05:00",
      sentiment: "neutral",
    },
    {
      id: "16",
      content: "와 진짜 대박이네요!",
      timestamp: "2024-03-18 21:10:00",
      sentiment: "positive",
    },
    {
      id: "17",
      content: "이거 실패했네요...",
      timestamp: "2024-03-18 21:15:00",
      sentiment: "negative",
    },
    {
      id: "18",
      content: "다음 게임은 뭐하실 건가요?",
      timestamp: "2024-03-18 21:20:00",
      sentiment: "neutral",
    },
    {
      id: "19",
      content: "방송 잘 보고 있습니다!",
      timestamp: "2024-03-18 21:25:00",
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
                <div key={chat.id} className="chat-item">
                  <div className="chat-content">{chat.content}</div>
                  <div className="chat-meta">
                    <span className="chat-time">
                      {new Date(chat.timestamp).toLocaleTimeString()}
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
