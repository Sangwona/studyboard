import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import moment from "moment-timezone";

const Comment = ({ comment, setComments }) => {
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [newComment, setNewComment] = useState(comment.content);
  const userId = parseInt(localStorage.getItem("user_id"));

  const isCommentAuthor = useMemo(() => comment.user_id === userId, [comment.user_id, userId]);

  const handleCommentEditMode = () => {
    setIsCommentEditing((prev) => !prev);
    setNewComment(comment.content); // Reset to original when canceling edit mode
  };

  const handleCommentEditSubmit = async () => {
    if (!newComment.trim()) return;

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
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleCommentDelete = async () => {
    if (!isCommentAuthor || !window.confirm("Are you sure you want to delete the comment?")) return;

    const token = localStorage.getItem("access_token");
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
        <div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-edit-input"
            aria-label="Edit comment"
          />
          <button onClick={handleCommentEditSubmit} disabled={!newComment.trim()}>
            Update
          </button>
          <button onClick={handleCommentEditMode}>Cancel</button>
        </div>
      ) : (
        <div className="comment-content">{comment.content}</div>
      )}
      <div className="comment-meta">
        <div className="comment-author">{comment.username}</div>
        <div className="comment-actions-date-wrapper">
          {isCommentAuthor && (
            <div className="comment-actions-wrapper">
              <span className="comment-edit-button" onClick={handleCommentEditMode}>
                Edit
              </span>
              <span className="comment-delete-button" onClick={handleCommentDelete}>
                Delete
              </span>
            </div>
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
