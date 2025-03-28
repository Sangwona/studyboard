import PropTypes from "prop-types";

const Comment = ({ comment }) => {
  return (
    <div className="comment">
      <p>{comment.content}</p>
      <small>
        Posted by User {comment.username} on {new Date(comment.created_at).toLocaleString()}
      </small>
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
