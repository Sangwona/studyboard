import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";

const Comment = ({ comment }) => {
  const [isCommentAuthor, setIsCommentAuthor] = useState(false);
  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    setIsCommentAuthor(comment.user_id === userId);
  }, [comment.user_id, userId]);

  return (
    <div className="comment">
      <div className="comment-content">{comment.content}</div>
      <div className="comment-meta">
        <div className="comment-author">{comment.username}</div>
        <div className="comment-actions-date-wrapper">
          {isCommentAuthor ? (
            <div className="comment-actions-wrapper">
              <span>Edit</span>
              <span>Delete</span>
            </div>
          ) : (
            <div className="comment-actions-wrapper"></div>
          )}
          <span className="comment-date">
            {moment.utc(comment.created_at).tz(moment.tz.guess()).format("MM-DD-YYYY, HH:mm:ss")}
          </span>
        </div>
      </div>
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default Comment;
