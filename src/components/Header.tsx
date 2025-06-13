import { Link, useLocation } from "react-router-dom";
import { CHZZK_AUTH_URL } from "../api/chzzk/auth";

const Header = () => {
  const location = useLocation();
  const isSearchPage =
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/user");
  const isSubtitlePage = location.pathname.startsWith("/subtitle");
  const isRandomBoxPage = location.pathname.startsWith("/random-box");
  const isClipPage = location.pathname.startsWith("/clip-generator");

  const handleChzzkLogin = async () => {
    const clientId = import.meta.env.VITE_CHZZK_CLIENT_ID;
    const redirectUri = "https://ping-pong.world/login/callback";
    const state = `${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("chzzk_oauth_state", state);

    window.location.href = `${CHZZK_AUTH_URL}?clientId=${clientId}&redirectUri=${encodeURIComponent(
      redirectUri
    )}&state=${state}`;
  };

  return (
    <header>
      <nav>
        <div className="nav-container">
          <div className="nav-center">
            <Link
              to="/search"
              className={`dropdown-trigger ${isSearchPage ? "active" : ""}`}
            >
              유저 검색기
            </Link>
            <Link
              to="/subtitle"
              className={`dropdown-trigger ${isSubtitlePage ? "active" : ""}`}
            >
              AI 방송 자막
            </Link>
            <Link
              to="/random-box"
              className={`dropdown-trigger ${isRandomBoxPage ? "active" : ""}`}
            >
              후원 랜덤박스
            </Link>
            <Link
              to="/clip-generator"
              className={`dropdown-trigger ${isClipPage ? "active" : ""}`}
            >
              AI 클립생성기
            </Link>
          </div>
          <button
            onClick={handleChzzkLogin}
            className="button button-primary"
            style={{
              marginLeft: "auto",
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <img
              src="/chzzklogo_kor(Black).png"
              alt="치지직"
              style={{ width: "80px", height: "24px" }}
            />
            <span>로그인</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
