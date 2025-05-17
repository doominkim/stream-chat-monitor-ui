import { useState, useEffect, useRef, useCallback } from "react";
import {
  Channel,
  getChannels,
  getTranscripts,
  Transcript,
} from "../api/channel";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

const Subtitle = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
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
    }
  };

  const lastTranscriptRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prevOffset) => prevOffset + 20);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

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
      const result = await getTranscripts(selectedChannel.uuid, offset);

      // 새로운 자막만 추가
      setTranscripts((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTranscripts = result.items.filter(
          (t) => !existingIds.has(t.id)
        );

        if (newTranscripts.length > 0) {
          const updatedTranscripts = [...prev, ...newTranscripts];
          // 새로운 자막이 추가되면 스크롤을 맨 아래로 이동
          setTimeout(scrollToBottom, 0);
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
    setOffset(0); // offset 초기화
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
                  onClick={() => setSelectedChannel(channel)}
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
                      <div className="channel-name">{channel.channelName}</div>
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
                  {transcripts.map((transcript, index) => (
                    <div
                      key={transcript.id}
                      ref={
                        index === transcripts.length - 1
                          ? lastTranscriptRef
                          : null
                      }
                      className="transcript-item"
                    >
                      <div className="transcript-text">{transcript.text}</div>
                      <div className="transcript-time">
                        {formatDistanceToNow(new Date(transcript.createdAt), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </div>
                    </div>
                  ))}
                  {loading && <div className="loading">로딩 중...</div>}
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
                <div className="subtitle-placeholder">채널을 선택해주세요</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subtitle;
