import { Link, useLocation } from "react-router-dom";
import { requestAuthCode } from "../api/chzzk/auth";

const Header = () => {
  const location = useLocation();
  const isSearchPage =
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/user");
  const isSubtitlePage = location.pathname.startsWith("/subtitle");
  const isRandomBoxPage = location.pathname.startsWith("/random-box");
  const isClipPage = location.pathname.startsWith("/clip-generator");

  const handleChzzkLogin = async () => {
    try {
      const clientId = import.meta.env.VITE_CHZZK_CLIENT_ID;
      const redirectUri = `${window.location.origin}/login/callback`;
      const state = crypto.randomUUID();

      await requestAuthCode({
        clientId,
        redirectUri,
        state,
      });

      window.location.href = `https://chzzk.naver.com/account-interlock?clientId=${clientId}&redirectUri=${encodeURIComponent(
        redirectUri
      )}&state=${state}`;
    } catch (error) {
      console.error("치지직 로그인 요청 실패:", error);
    }
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
