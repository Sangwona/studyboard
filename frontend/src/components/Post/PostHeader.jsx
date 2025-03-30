import "../../styles/PostHeader.css";
import PropTypes from "prop-types";
import moment from "moment-timezone";

const PostHeader = ({ post }) => {
  return (
    <div id="post-header">
      <div className="post-header-title-wrapper">
        <h1 className="post-header-title">{post.title}</h1>
      </div>
      <div className="post-header-info-wrapper">
        <span className="post-header-author">{post.author}</span>
        <span className="post-header-date">
          {moment.utc(post.date).tz(moment.tz.guess()).format("MM-DD-YYYY, HH:mm:ss")}
        </span>
      </div>
    </div>
  );
};

PostHeader.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostHeader;
