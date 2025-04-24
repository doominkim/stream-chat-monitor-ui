import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SearchUser from "./pages/SearchUser";
import UserDetail from "./pages/UserDetail";
import ChatHistory from "./pages/ChatHistory";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<SearchUser />} />
            <Route path="/user/:userId" element={<UserDetail />} />
            <Route path="/user/:userId/chat" element={<ChatHistory />} />
            <Route path="/" element={<Navigate to="/search" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
