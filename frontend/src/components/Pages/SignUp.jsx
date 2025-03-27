import "../../styles/Login.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const userID = formData.get("userID");
    const userName = formData.get("userName");
    const password = formData.get("userPassword");

    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: userID, username: userName, password: password }),
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

  const checkDuplicate = async (field) => {
    const formData = new FormData(document.getElementById("login-form"));
    const inputString = formData.get(field);
    console.log(`Field: ${field} Input: ${inputString}`);
    if (inputString === "") {
      alert(`${field} shouldn't be empty!`);
    }
    else {
      const exists = await checkUserExists(field, inputString);
      const message = (exists ? `This ${field} is already taken!` : `This ${field} is available!`);
      alert(message);
    }
  }

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
          <div className="input-group">
            <input
              type="text"
              name="userID"
              placeholder="ID"
            />
            <button onClick={() => checkDuplicate("userID")}>Check Duplicate</button>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
            />
            <button onClick={() => checkDuplicate("username")}>Check Duplicate</button>
          </div>
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
