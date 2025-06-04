import { useEffect, useState } from "react";
import ChannelNavigator from "../components/ChannelNavigator";
import { Channel, Clip, getClips } from "../api/channel";
import "../styles/ClipGenerator.css";

const mockClips: Clip[] = [
  {
    id: 1,
    createdAt: "2024-04-01T12:00:00Z",
    title: "첫 번째 하이라이트",
    videoUrl: "https://example.com/video1",
    thumbnailUrl: "https://via.placeholder.com/160x90?text=Clip+1",
  },
  {
    id: 2,
    createdAt: "2024-04-02T15:30:00Z",
    title: "두 번째 하이라이트",
    videoUrl: "https://example.com/video2",
    thumbnailUrl: "https://via.placeholder.com/160x90?text=Clip+2",
  },
  {
    id: 3,
    createdAt: "2024-04-03T09:45:00Z",
    title: "세 번째 하이라이트",
    videoUrl: "https://example.com/video3",
    thumbnailUrl: "https://via.placeholder.com/160x90?text=Clip+3",
  },
];

const ClipGenerator = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClips = async () => {
      if (!selectedChannel) return;
      try {
        setLoading(true);
        const data = await getClips(selectedChannel.uuid);
        setClips(data.length > 0 ? data : mockClips);
      } catch (error) {
        console.error("클립 조회 실패:", error);
        setClips(mockClips);
      } finally {
        setLoading(false);
      }
    };

    fetchClips();
  }, [selectedChannel]);

  return (
    <div className="subtitle-page">
      <div className="subtitle-layout">
        <div className="subtitle-sidebar">
          <ChannelNavigator
            selectedChannel={selectedChannel}
            onChannelSelect={setSelectedChannel}
          />
        </div>
        <div className="subtitle-main">
          <div className="subtitle-container">
            {!selectedChannel && (
              <div className="subtitle-placeholder">텅...</div>
            )}
            {loading && <div className="loading">로딩 중...</div>}
            {selectedChannel && !loading && clips.length === 0 && (
              <div className="subtitle-placeholder">생성된 클립이 없습니다</div>
            )}
            <div className="clip-list">
              {clips.map((clip) => (
                <div key={clip.id} className="clip-item">
                  <div className="clip-thumb">
                    <img src={clip.thumbnailUrl} alt={clip.title} />
                  </div>
                  <div className="clip-info">
                    <div className="clip-title">{clip.title}</div>
                    <a
                      href={clip.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clip-link"
                    >
                      보기
                    </a>
                    <div className="clip-time">
                      {new Date(clip.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClipGenerator;
