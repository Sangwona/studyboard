import PropTypes from "prop-types";
import moment from "moment-timezone";

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <div className="comment-content">{comment.content}</div>
      <div className="comment-meta">
        <span className="comment-author">{comment.username}</span>
        <span className="comment-date">
          {moment.utc(comment.created_at).tz(moment.tz.guess()).format("MM-DD-YYYY, HH:mm:ss")}
        </span>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    content: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comment;
