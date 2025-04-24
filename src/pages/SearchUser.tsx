import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchUser = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      navigate(`/user/${userId}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={userId}
              onChange={handleInputChange}
              placeholder="유저 아이디를 입력하세요"
              className="input"
            />
            <button type="submit" className="button button-primary">
              검색
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchUser;
