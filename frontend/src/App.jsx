import "./App.css";
import Post from "./components/Post/Post";
import WriteForm from "./components/Pages/WriteForm";
import Home from "./components/Pages/Home";
import Login from "./components/Pages/Login";
import SignUp from "./components/Pages/SignUp";
import Permissions from "./components/Pages/Permission";
import GroupMng from "./components/Pages/GroupMng";
import GroupList from "./components/Pages/GroupList";
import GroupRequest from "./components/Pages/GroupRequest";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBarFooter/NavBar";
import Footer from "./components/NavBarFooter/Footer";
import { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));

  //새로고침시 로그아웃 안되고, 웹 닫을때만 로그아웃
  useEffect(() => {
    if (sessionStorage.getItem("reloadFlag") === null) {
      localStorage.removeItem("access_token");
      setIsLoggedIn(false);
    }
    //새로고침 시 `reloadFlag` 유지
    sessionStorage.setItem("reloadFlag", "true");
  }, [isLoggedIn]);

  return (
    <Router>
      <div className="app-container">
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/board/post/:post_id" element={<Post />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/writeform" element={<WriteForm />} />
            {/* <Route path="/permission" element={<Permissions />} /> */}
            <Route path="/groupmng" element={<GroupMng />} />
            <Route path="/grouplist" element={<GroupList />} />
            <Route path="/grouprequest" element={<GroupRequest />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
