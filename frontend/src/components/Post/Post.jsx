import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PostHeader from "./PostHeader";
import PostContext from "./PostContent";
import Comment from "../Comment/Comment";
import "../../styles/Post.css";
import { AiOutlineComment } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import { IoHome } from "react-icons/io5";

const Post = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("user_id"));

  // Fetch post and comments when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`/board/posts/${post_id}`).then((res) => res.json()),
          fetch(`/board/posts/${post_id}/comments`).then((res) => res.json()),
        ]);
        setPost(postRes);
        setComments(commentsRes);
        setIsAuthor(postRes.user_id == userId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [post_id, userId]);

  // Handle post deletion
  const handlePostDelete = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please log in to delete the post.");
      return;
    }

    if (isAuthor && !window.confirm("Are you sure you want to delete the post?")) return;
    try {
      const response = await fetch(`/board/posts/${post_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete post");

      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = useCallback(async () => {
    // Prevent empty comments
    if (!newComment.trim()) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please log in to comment.");
      return;
    }
    try {
      const response = await fetch(`/board/posts/${post_id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      setNewComment("");

      const updatedComments = await fetch(`/board/posts/${post_id}/comments`).then((res) =>
        res.json()
      );

      setComments(updatedComments);
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }, [newComment, post_id]);

  if (!post) return <div>Loading...</div>;

  return (
    <>
      <div className="post-detail-page">
        <Link to="/" className="home-link">
          <IoHome /> Back to Home
        </Link>
        <main className="post-detail-container">
          {/* Post Content */}
          <article className="post-content">
            <div className="post-title-section">
              <PostHeader post={post} />
              <div className="post-actions">
                <button
                  className="comment-button"
                  onClick={() => {
                    document.getElementById("comments").scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  <AiOutlineComment />
                  {comments.length > 99 ? "99+" : comments.length} Comments
                </button>
                <button
                  className="action-link share-button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Optional: Add some visual feedback
                    alert("URL copied to clipboard!");
                  }}
                >
                  <FaShare />
                  Share
                </button>
              </div>
            </div>
            <div className="post-content-section">
              <PostContext content={post.content} />
            </div>
          </article>

          {isAuthor && (
            <button className="delete-button" onClick={handlePostDelete}>
              Delete
            </button>
          )}

          {/* Comment Section */}
          <section className="comments-section" id="comments">
            <h3 className="comments-title">Comments</h3>

            {comments.length === 0 ? (
              <p className="no-comments-message">No comments yet. Be the first to comment!</p>
            ) : (
              <div className="comments-list">
                {comments.map((comment) => (
                  <Comment key={comment.id} comment={comment} />
                ))}
              </div>
            )}

            {/* Comment Form */}
            <form
              className="comment-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleCommentSubmit();
              }}
            >
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                aria-label="Comment text"
              />
              <button type="submit" className="comment-submit-button" disabled={!newComment.trim()}>
                Comment
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default Post;
