import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requestToken } from "../api/chzzk/auth";

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const savedState = localStorage.getItem("chzzk_oauth_state");

    console.log(code, state, savedState);

    if (!code || !state || state !== savedState) {
      alert("잘못된 인증 요청입니다.");
      navigate("/");
      return;
    }

    (async () => {
      try {
        const clientId = import.meta.env.VITE_CHZZK_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_CHZZK_CLIENT_SECRET;
        const token = await requestToken({
          grantType: "authorization_code",
          clientId,
          clientSecret,
          code,
          state,
        });
        localStorage.setItem("chzzk_access_token", token.accessToken);
        localStorage.setItem("chzzk_refresh_token", token.refreshToken);
        localStorage.setItem("chzzk_token_expires_in", token.expiresIn);
        navigate("/");
      } catch (error) {
        console.error("토큰 발급 실패:", error);
        alert("토큰 발급 실패");
        navigate("/");
      }
    })();
  }, [navigate]);

  return <div>치지직 로그인 처리 중...</div>;
};

export default LoginCallback;
