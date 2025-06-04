import { useEffect, useState } from "react";
import ChannelNavigator from "../components/ChannelNavigator";
import { Channel, Clip, getClips } from "../api/channel";
import "../styles/ClipGenerator.css";

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
        setClips(data);
      } catch (error) {
        console.error("클립 조회 실패:", error);
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
