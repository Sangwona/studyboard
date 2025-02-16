import "../../styles/Login.css";
import NavBar from "../NavBarFooter/NavBar";
import Footer from "../NavBarFooter/Footer";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useState } from "react";

function SignUp () {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(userName);
    console.log(password);
    
    const response = await fetch("https://studyboard-production.up.railway.app/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: userName, password: password }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Signup successful!");
    } else {
      setMessage(data.error);
    }

    setIsPopupOpen(true);
  };

  return (
    <>
      <NavBar></NavBar>
      <div className="login-wrapper">
        <h2>Sign Up</h2>
        <form method="post" action="서버의url" id="login-form" onSubmit={handleSubmit}>
          <input type="text" name="userName" placeholder="Username" onChange={(e)=>setUserName(e.target.value)}/>
          <input type="password" name="userPassword" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
          <input type="submit" value="Create Account"/>
        </form>
      </div>
      <Popup className="pop-up" open={isPopupOpen} onClose={() => setIsPopupOpen(false)} modal nested>
      <div className="modal">
          <div className="content">
            {message && <p className='close-msg'>{message}</p>}
          </div>
          <div>
            <button className='close-btn' onClick={() => setIsPopupOpen(false)}>
              Close
            </button>
          </div>
        </div>
      </Popup>
      <Footer></Footer>
    </>
  );
}

export default SignUp