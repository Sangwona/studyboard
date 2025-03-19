import "../../styles/PostHeader.css";
import PropTypes from "prop-types";

const PostHeader = ({ title, author, date }) => {
  return (
    <div id="post-header">
      <div className="post-wrapper">
        <h1 className="post-header-title">{title}</h1>
        <div className="post-header-info">
          <span className="post-header-author">{author}</span>
          <span className="post-header-date">{date}</span>
        </div>
      </div>
    </div>
  );
};

PostHeader.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  date: PropTypes.string,
};

export default PostHeader;
