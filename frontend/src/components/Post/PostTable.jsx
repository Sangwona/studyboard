import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "../../styles/Home.css";
import moment from "moment-timezone";

const PostTable = ({ posts }) => {
  return (
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
                {moment.utc(post.date).tz(moment.tz.guess()).format("MM-DD-YYYY")}
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
  );
};

PostTable.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default PostTable;
