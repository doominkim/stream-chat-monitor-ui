import { useState, useEffect, useRef } from "react";
import {
  Channel,
  getChannels,
  getTranscripts,
  Transcript,
} from "../api/channel";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const Subtitle = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(20);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const subtitleDisplayRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    if (subtitleDisplayRef.current) {
      subtitleDisplayRef.current.scrollTop =
        subtitleDisplayRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (subtitleDisplayRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        subtitleDisplayRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);

      // 스크롤이 맨 위에 도달했을 때만 limit 증가
      if (scrollTop === 0 && hasMore && !loading) {
        setLimit((prevLimit) => prevLimit + 20);
      }
    }
  };

  const fetchChannels = async () => {
    try {
      setError(null);
      const data = await getChannels();
      console.log("채널 목록:", data);
      setChannels(data);
    } catch (err) {
      console.error("채널 목록 조회 에러:", err);
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    }
  };

  const fetchTranscripts = async () => {
    if (!selectedChannel) return;
    try {
      setLoading(true);
      const result = await getTranscripts(selectedChannel.uuid, 0, limit);

      // 새로운 자막만 추가
      setTranscripts((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTranscripts = result.items.filter(
          (t) => !existingIds.has(t.id)
        );

        if (newTranscripts.length > 0) {
          // 스크롤이 맨 위에 있을 때는 이전 자막을 위에 추가
          if (subtitleDisplayRef.current?.scrollTop === 0) {
            const updatedTranscripts = [...newTranscripts, ...prev];
            // 새로 추가된 컨텐츠의 높이만큼 스크롤을 아래로 내림
            setTimeout(() => {
              if (subtitleDisplayRef.current) {
                const firstNewItem =
                  subtitleDisplayRef.current.querySelector(".transcript-item");
                if (firstNewItem) {
                  subtitleDisplayRef.current.scrollTop =
                    firstNewItem.getBoundingClientRect().height *
                    newTranscripts.length;
                }
              }
            }, 0);
            return updatedTranscripts;
          }

          // 스크롤이 맨 아래에 가까울 때는 새 자막을 아래에 추가
          const updatedTranscripts = [...prev, ...newTranscripts];
          if (subtitleDisplayRef.current) {
            const { scrollTop, scrollHeight, clientHeight } =
              subtitleDisplayRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
            if (isNearBottom) {
              setTimeout(scrollToBottom, 0);
            }
          }
          return updatedTranscripts;
        }

        return prev;
      });

      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to fetch transcripts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (!selectedChannel) return;

    // 초기 데이터 로드
    setTranscripts([]); // 기존 자막 초기화
    setLimit(20); // limit 초기화
    fetchTranscripts();

    // 5초마다 새로운 데이터 로드
    intervalRef.current = setInterval(() => {
      fetchTranscripts();
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [selectedChannel]);

  // limit이 변경될 때만 fetchTranscripts 호출
  useEffect(() => {
    if (!selectedChannel) return;
    fetchTranscripts();
  }, [limit]);

  const formatDate = (date: Date) => {
    return format(date, "yyyy년 MM월 dd일", { locale: ko });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm:ss", { locale: ko });
  };

  const groupTranscriptsByDate = (transcripts: Transcript[]) => {
    const groups: { [key: string]: Transcript[] } = {};

    transcripts.forEach((transcript) => {
      const date = new Date(transcript.createdAt);
      const dateKey = formatDate(date);

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transcript);
    });

    return groups;
  };

  const handleChannelSelect = (channel: Channel) => {
    setSelectedChannel(channel);
    // 채널 선택 후 스크롤을 맨 아래로 이동
    setTimeout(scrollToBottom, 100);
  };

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
                    selectedChannel?.id === channel.id ? "selected" : ""
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
                        src={channel.channelImageUrl || "/default-avatar.png"}
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
                      <div className="channel-category">
                        {channel.channelLive?.liveCategory?.liveCategoryValue}
                      </div>
                      <div className="channel-meta">
                        {channel.openLive && (
                          <div className="channel-viewers">
                            • {channel.follower.toLocaleString()}
                          </div>
                        )}
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
            {error && <div className="error-message">{error}</div>}
            <div
              className="subtitle-display"
              ref={subtitleDisplayRef}
              onScroll={handleScroll}
            >
              {selectedChannel ? (
                <>
                  {Object.entries(groupTranscriptsByDate(transcripts)).map(
                    ([date, dateTranscripts]) => (
                      <div key={date} className="transcript-date-group">
                        <div className="transcript-date">{date}</div>
                        {dateTranscripts.map((transcript) => (
                          <div key={transcript.id} className="transcript-item">
                            <div className="transcript-text">
                              {transcript.text}
                            </div>
                            <div className="transcript-time">
                              {formatTime(new Date(transcript.createdAt))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}
                  <button
                    className={`scroll-to-bottom ${
                      showScrollButton ? "visible" : ""
                    }`}
                    onClick={scrollToBottom}
                    title="맨 아래로"
                  >
                    ↓
                  </button>
                </>
              ) : (
                <div className="subtitle-placeholder">텅...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subtitle;
