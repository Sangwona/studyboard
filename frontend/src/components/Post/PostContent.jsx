import "../../styles/Post.css";
import PropTypes from "prop-types";

const PostContext = ({ content }) => {
  return <p>{content}</p>;
};
PostContext.propTypes = {
  content: PropTypes.string.isRequired,
};

export default PostContext;
