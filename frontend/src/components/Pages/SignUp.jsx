import "../../styles/Login.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSignUpSucceed, setIsSignUpSucceed] = useState(false);
  const [duplicateID, setDuplicateID] = useState(true);
  const [duplicateName, setDuplicateName] = useState(true);
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

    if (duplicateID || duplicateName)
    {
      setMessage("Check duplicate before submit!");
      setIsPopupOpen(true);
      return;
    }

    // Get form data
    const formData = new FormData(event.target);
    const userID = formData.get("userID");
    const userName = formData.get("username");
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
      return;
    }
    else {
      const exists = await checkUserExists(field, inputString);
      const message = (exists ? `This ${field} is already taken!` : `This ${field} is available!`);
      if (!exists) {
        if (field === "username")
          setDuplicateName(false);
        else if (field === "userID")
          setDuplicateID(false);
        console.log(duplicateID, duplicateName);
      }
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
              onChange={() => setDuplicateID(true)}
            />
            <button type="button" onClick={() => checkDuplicate("userID")} disabled={duplicateID === false}>{duplicateID === false ?  "Valid ID" : "Check Duplicate"}</button>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={() => setDuplicateName(true)}
            />
            <button type="button" onClick={() => checkDuplicate("username")} disabled={duplicateName === false}>{duplicateName === false ? "Valid Username" : "Check Duplicate"}</button>
          </div>
          <input
            type="password"
            name="userPassword"
            placeholder="Password"
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
