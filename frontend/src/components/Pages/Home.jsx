import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Home.css";
import NavBar from "../NavBarFooter/NavBar";
import Footer from "../NavBarFooter/Footer";

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch("/board/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // author와 date가 있는지 확인
        console.log("Fetched posts:", data);
        setPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      <NavBar />
      <div className="content-area">
        {isLoading ? (
          <div className="loading-indicator">게시글을 불러오는 중...</div>
        ) : error ? (
          <div className="error-message">
            데이터를 불러오는 중 오류가 발생했습니다: {error}
          </div>
        ) : (
          <>
            <table className="table">
              <thead>
                <tr className="header">
                  <th className="num">번호</th>
                  <th className="title">제목</th>
                  <th className="author">작성자</th>
                  <th className="date">작성날짜</th>
                </tr>
              </thead>
              <tbody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <tr key={post.id} className="body">
                      <td>{post.id}</td>
                      <td className="title">
                        <Link to={`board/post/${post.id}`}>{post.title}</Link>
                      </td>
                      <td className="author">{post.author}</td>
                      <td className="date">{post.date}</td> 
                    </tr>
                  ))
                ) : (
                  <tr className="empty-state">
                    <td colSpan="4">게시글이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="button-container">
              <button
                className="write-button"
                onClick={() => navigate("/writeform")}
              >
                글쓰기
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
