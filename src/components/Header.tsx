import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isSearchPage =
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/user");
  const isSubtitlePage = location.pathname.startsWith("/subtitle");
  const isRandomBoxPage = location.pathname.startsWith("/random-box");

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
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
