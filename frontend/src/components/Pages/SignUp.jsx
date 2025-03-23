import "../../styles/Login.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSignUpSucceed, setIsSignUpSucceed] = useState(false);
  const navigate = useNavigate();

  // Function to check if userID or username exists
  const checkUserExists = async (field, value) => {
    if (!value) return false;
    try {
      const response = await fetch("/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Check userID availability
  useEffect(() => {
    const checkUserId = debounce(async (id) => {
      const exists = await checkUserExists("userId", id);
      setUserIdError(exists ? "This ID is already taken" : "");
    }, 500);

    checkUserId(userId);
  }, [userId]);

  // Check username availability
  useEffect(() => {
    const checkUsername = debounce(async (name) => {
      const exists = await checkUserExists("username", name);
      setUserNameError(exists ? "This username is already taken" : "");
    }, 500);

    checkUsername(userName);
  }, [userName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userName);
    console.log(password);

    if (userIdError || userNameError) {
      setMessage("Input values invalid!");
      setIsSignUpSucceed(false);
      setIsPopupOpen(true);
      return;
    }

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
        <form
          method="post"
          action="서버의url"
          id="login-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="userId"
            placeholder="ID"
            onChange={(e) => setUserId(e.target.value)}
          />
          {userIdError && <p className="error">{userIdError}</p>}
          <input
            type="text"
            name="userName"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          {userNameError && <p className="error">{userNameError}</p>}
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

export default SignUp;
