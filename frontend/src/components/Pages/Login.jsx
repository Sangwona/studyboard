import "../../styles/Login.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loginSucceed, setLoginSucceed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userName);
    console.log(userPassword);

    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: userPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Login successful!");
      setLoginSucceed(true);
    } else {
      setMessage(data.error);
      setLoginSucceed(false);
    }

    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    if (loginSucceed) navigate("/");
  };

  return (
    <>
      <div className="login-wrapper">
        <h2>Login</h2>
        <form method="post" id="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            name="userPassword"
            placeholder="Password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <label htmlFor="remember-check">
            <input type="checkbox" id="remember-check" /> 아이디 저장하기
          </label>
          <input type="submit" value="Login" />
        </form>
      </div>

      <Popup
        className="pop-up"
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        modal
        nested
      >
        <div className="modal">
          <div className="content">
            {message && <p className="close-msg">{message}</p>}
          </div>
          <div>
            <button className="close-btn" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}

export default Login;
