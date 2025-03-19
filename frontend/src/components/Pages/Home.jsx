import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Home.css";
import moment from "moment-timezone";

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalpages] = useState(1);
  const perPage = 10;

  const fetchPosts = async (page) => {
    try {
      const loadingTimeout = setTimeout(() => {
        setIsLoading(true);
      }, 1000); // 1s 이후에만 로딩 표시

      const response = await fetch(`/board/posts?page=${page}&per_page=${perPage}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched posts:", data);

      clearTimeout(loadingTimeout); // 응답이 빠르면 로딩 표시 안 함

      setPosts(data.posts); // ✅ 데이터가 있을 때만 설정
      setTotalpages(Math.max(1, data.total_pages));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="home-container">
      <div className="content-area">
        {isLoading === null ? (
          <div className="placeholder"></div>
        ) : isLoading ? (
          <div className="loading-indicator">게시글을 불러오는 중...</div>
        ) : error ? (
          <div className="error-message">데이터를 불러오는 중 오류가 발생했습니다: {error}</div>
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
                      {/* 현재 타임 존에 맞춰서 DB의 시간 변경해서 보여줌 */}
                      <td className="date">
                        {moment.utc(post.date).tz(moment.tz.guess()).format("YYYY-MM-DD HH:mm:ss")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="empty-state">
                    <td colSpan="4">게시글이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={() => handlePageChange(1)} disabled={page === 1}>
                {"<<"}
              </button>
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                {"<"}
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={page === pageNumber ? "active" : ""}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                {">"}
              </button>
              <button onClick={() => handlePageChange(totalPages)} disabled={page === totalPages}>
                {">>"}
              </button>
            </div>

            <div className="button-container">
              <button className="write-button" onClick={() => navigate("/writeform")}>
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
