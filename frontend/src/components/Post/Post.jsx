import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PostHeader from "./PostHeader";
import PostContext from "./PostContent";
import PostInfo from "./PostInfo";
import NavBar from "../NavBarFooter/NavBar";
import Footer from "../NavBarFooter/Footer";
import "../../styles/Post.css";
import Comment from "../Comment/Comment";

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
      <NavBar />
      <div className="post-detail-page">
        <main className="post-detail-container">
          {/* Post Content */}
          <article className="post-content">
            <PostHeader
              title={post.title}
            />
            <PostContext content={post.content} />
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
      <Footer></Footer>
    </>
  );
};

export default Post;
