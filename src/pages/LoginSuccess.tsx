import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../api/auth";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("sessionId");

    if (!sessionId) {
      console.error("세션 ID가 없습니다.");
      navigate("/");
      return;
    }

    // 세션 ID를 localStorage에 저장
    localStorage.setItem("chzzk_session_id", sessionId);

    // 서버에 사용자 정보 요청
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo(sessionId);
        console.log("사용자 정보:", userInfo);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
      }
    };

    fetchUserInfo();

    // 3초 후 메인 페이지로 이동
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>로그인 성공!</h1>
      <p>잠시 후 메인 페이지로 이동합니다...</p>
    </div>
  );
};

export default LoginSuccess;
