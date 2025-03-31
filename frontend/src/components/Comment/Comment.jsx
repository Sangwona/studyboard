import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";

const Comment = ({ comment, setComments }) => {
  const [isCommentAuthor, setIsCommentAuthor] = useState(false);
  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    setIsCommentAuthor(comment.user_id === userId);
  }, [comment.user_id, userId]);

  // Handle comment deletion
  const handleCommentDelete = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to delete the comment.");
      return;
    }

    if (isCommentAuthor && !window.confirm("Are you sure you want to delete the comment?")) return;

    try {
      const response = await fetch(`/board/comments/${comment.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      setComments((prevComments) => prevComments.filter((c) => c.id !== comment.id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="comment">
      <div className="comment-content">{comment.content}</div>
      <div className="comment-meta">
        <div className="comment-author">{comment.username}</div>
        <div className="comment-actions-date-wrapper">
          {isCommentAuthor ? (
            <div className="comment-actions-wrapper">
              <span>Edit</span>
              <span onClick={handleCommentDelete}>Delete</span>
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
    user_id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  setComments: PropTypes.func.isRequired,
};

export default Comment;
