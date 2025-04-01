import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import moment from "moment-timezone";

const Comment = ({ comment, setComments }) => {
  const navigate = useNavigate();
  const [isCommentAuthor, setIsCommentAuthor] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [newComment, setNewComment] = useState(comment.content);
  const userId = parseInt(localStorage.getItem("user_id"));

  useEffect(() => {
    setIsCommentAuthor(comment.user_id === userId);
  }, [comment.user_id, userId]);

  // Handle comment editing mode change
  // Toggle edit mode
  const handleCommentEditMode = () => {
    setIsCommentEditing((prev) => !prev);
  };

  // Handle comment edit submission
  const handleCommentEditSubmit = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch(`/board/comments/${comment.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Failed to edit comment");

      setComments((prevComments) =>
        prevComments.map((c) => (c.id === comment.id ? { ...c, content: newComment } : c))
      );
      setIsCommentEditing(false);
      navigate(`/board/post/${comment.post_id}`);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // Handle comment deletion
  const handleCommentDelete = async () => {
    const token = localStorage.getItem("access_token");

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
      {isCommentAuthor && isCommentEditing ? (
        <form onSubmit={handleCommentEditSubmit}>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-edit-input"
            aria-label="Comment text"
          />
          <button
            className="comment-submit-button"
            onClick={handleCommentEditSubmit}
            disabled={!newComment.trim()}
          >
            Update
          </button>
        </form>
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}
      <div className="comment-meta">
        <div className="comment-author">{comment.username}</div>
        <div className="comment-actions-date-wrapper">
          {isCommentAuthor ? (
            <div className="comment-actions-wrapper">
              <span className="comment-edit-button" onClick={handleCommentEditMode}>
                Edit
              </span>
              <span className="comment-delete-button" onClick={handleCommentDelete}>
                Delete
              </span>
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
    post_id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  setComments: PropTypes.func.isRequired,
};

export default Comment;
