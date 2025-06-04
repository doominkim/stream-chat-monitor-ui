import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { FaDesktop } from "react-icons/fa";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SearchUser from "./pages/SearchUser";
import UserDetail from "./pages/UserDetail";
import ChatHistory from "./pages/ChatHistory";
import Subtitle from "./pages/Subtitle";
import RandomBox from "./pages/RandomBox";
import ClipGenerator from "./pages/ClipGenerator";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HealthStatus from "./components/HealthStatus";
import "./App.css";

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const getPageTitle = () => {
      const path = location.pathname;
      if (path.startsWith("/user/") && path.includes("/chat")) {
        return "채팅 내역";
      }
      if (path.startsWith("/user/")) {
        return "사용자 상세";
      }
      switch (path) {
        case "/login":
          return "로그인";
        case "/dashboard":
          return "대시보드";
        case "/search":
          return "사용자 검색";
        case "/subtitle":
          return "자막";
        case "/random-box":
          return "랜덤 박스";
        case "/clip-generator":
          return "클립 생성기";
        default:
          return "홈";
      }
    };

    document.title = `치지직 놀이터 - ${getPageTitle()}`;
  }, [location]);

  return null;
}

function MobileWarning() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "var(--bg-secondary)",
        color: "var(--text-primary)",
      }}
    >
      <Helmet>
        <title>치지직 놀이터 - PC 전용 서비스</title>
      </Helmet>
      <FaDesktop
        style={{
          fontSize: "4rem",
          color: "var(--primary-color)",
          marginBottom: "1.5rem",
          animation: "float 3s ease-in-out infinite",
        }}
      />
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          color: "var(--primary-color)",
        }}
      >
        PC 전용 서비스
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          color: "var(--text-secondary)",
          margin: "0.5rem 0",
        }}
      >
        죄송합니다. 현재 이 서비스는 PC 환경에서만 지원됩니다.
      </p>
      <p
        style={{
          fontSize: "1.1rem",
          color: "var(--text-secondary)",
          margin: "0.5rem 0",
        }}
      >
        더 나은 경험을 위해 PC로 접속해주세요.
      </p>
    </div>
  );
}

function AppContent() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="app-container">
      <PageTitle />
      <Header />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/search" element={<SearchUser />} />
          <Route path="/user/:userId" element={<UserDetail />} />
          <Route path="/user/:userId/chat" element={<ChatHistory />} />
          <Route path="/subtitle" element={<Subtitle />} />
          <Route path="/random-box" element={<RandomBox />} />
          <Route path="/clip-generator" element={<ClipGenerator />} />
          <Route path="/" element={<Navigate to="/subtitle" replace />} />
        </Routes>
      </main>
      <Footer>
        <HealthStatus />
      </Footer>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;
