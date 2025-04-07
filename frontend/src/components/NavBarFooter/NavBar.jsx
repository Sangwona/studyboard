import { Link, useNavigate } from "react-router-dom";
import "../../styles/NavBar.css"; // 네비게이션 스타일

function NavBar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  //로그아웃시 토큰 삭제
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-logo">
        <h1>
          <Link to="/">Study Boards</Link>
        </h1>
      </div>
      <nav className="navbar-links">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <a href="#about">Leetcode</a>
          </li>
          <li>
            <a href="#contact">Portfolio</a>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="#" onClick={handleLogout} className="logout-link">
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">SignUp</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default NavBar;
