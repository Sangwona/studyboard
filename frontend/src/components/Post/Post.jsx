import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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

  useEffect(() => {
    console.log("Post ID from URL:", post_id);

    // Fetch post data
    fetch(`/board/posts/${post_id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => setPost(data))
      .catch((error) => console.log("Error fetching post:", error));

    // Fetch comments
    console.log("Fetching comments from frontend");
    fetch(`/board/posts/${post_id}/comments`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Fetched comments: ", data);
        setComments(data);
      })
      .catch((error) => console.log("Error fetching comments:", error));
  }, [post_id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return; // Prevent empty comments

    const userID = 1; // ✅ Temporary fix until we get actual logged-in user

    try {
      const response = await fetch(`/board/posts/${post_id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          user_id: userID,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      setNewComment(""); // Clear input field

      // Fetch updated comments after submitting
      const updatedResponse = await fetch(`/board/posts/${post_id}/comments`);
      const updatedComments = await updatedResponse.json();
      setComments(updatedComments);
    } catch (error) {
      console.log("Error posting comment:", error);
    }
  };

  if (!post) {
    return <div>Loading...</div>;
  }

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
              <PostHeader title={post.title} />
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

          {/* Comment Section */}
          <section className="comments-section" id="comments">
            <h3 className="comments-title">Comments</h3>

            {comments.length === 0 ? (
              <p className="no-comments-message">
                No comments yet. Be the first to comment!
              </p>
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
              <button
                type="submit"
                className="comment-submit-button"
                disabled={!newComment.trim()}
              >
                Post
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default Post;
