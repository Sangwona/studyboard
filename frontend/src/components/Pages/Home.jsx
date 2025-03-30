import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";
import PostTable from "../Post/PostTable";

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const loadingTimeout = setTimeout(() => setIsLoading(true), 1000);
        const response = await fetch(`/board/posts?page=${page}&per_page=${perPage}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        clearTimeout(loadingTimeout);
        setPosts(data.posts);
        setTotalPages(Math.max(1, data.total_pages));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const handleWrite = () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to write a post.");
      navigate("/login");
      return;
    }
    navigate("/writeform");
  };

  return (
    <div className="home-container">
      <div className="content-area">
        {isLoading === null ? (
          <div className="placeholder"></div>
        ) : isLoading ? (
          <div className="loading-indicator">Loading posts...</div>
        ) : error ? (
          <div className="error-message">Failed fetching posts: {error}</div>
        ) : (
          <>
            <PostTable posts={posts} />
            <div className="pagination">
              <button onClick={() => handlePageChange(1)} disabled={page === 1}>
                {"<<"}
              </button>
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={page === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              ))}
              <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                {">"}
              </button>
              <button onClick={() => handlePageChange(totalPages)} disabled={page === totalPages}>
                {">>"}
              </button>
            </div>
            <div className="button-container">
              <button className="write-button" onClick={handleWrite}>
                글쓰기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default Home;
