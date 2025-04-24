import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isSearchPage =
    location.pathname.startsWith("/search") ||
    location.pathname.startsWith("/user");

  return (
    <header>
      <nav>
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/" className="logo-text">
              <span className="logo-text-primary">치지직</span>
            </Link>
          </div>

          <div className="nav-center">
            <Link
              to="/search"
              className={`dropdown-trigger ${isSearchPage ? "active" : ""}`}
            >
              유저 검색기
            </Link>
          </div>

          <div className="nav-menu">
            <div className="nav-link">
              <span className="nav-text">배돈</span>
              <span className="nav-text">BOT</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
