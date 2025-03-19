import "../../styles/Login.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSignUpSucceed, setIsSignUpSucceed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: password }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Signup successful!");
      setIsSignUpSucceed(true);
    } else {
      setMessage(data.error);
      setIsSignUpSucceed(false);
    }

    setIsPopupOpen(true);
  };

  const handleClose = () => {
    setIsPopupOpen(false);
    if (isSignUpSucceed) navigate("/");
  };

  return (
    <>
      <div className="login-wrapper">
        <h2>Sign Up</h2>
        <form method="post" action="서버의url" id="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="userName"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            name="userPassword"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" value="Create Account" />
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
          <div className="content">{message && <p className="close-msg">{message}</p>}</div>
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

export default SignUp;
