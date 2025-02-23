import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PostHeader from "./PostHeader";
import PostContext from "./PostContent";
import PostInfo from "./PostInfo";
import NavBar from "../NavBarFooter/NavBar";
import { FaArrowLeft } from "react-icons/fa";
import "../../styles/Post.css";
import Comment from "../Comment/Comment";

const RAILWAY_URL = "https://studyboard-production.up.railway.app/";

const Post = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    console.log("Post ID from URL:", post_id);

    // Fetch post data
    fetch(`${RAILWAY_URL}/board/posts/${post_id}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => setPost(data))
      .catch((error) => console.log("Error fetching post:", error));

    // Fetch comments
    console.log("Fetching comments from frontend");
    fetch(`${RAILWAY_URL}/board/posts/${post_id}/comments`)
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
      const response = await fetch(`${RAILWAY_URL}/board/posts/${post_id}/comments`, {
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
      const updatedResponse = await fetch(`${RAILWAY_URL}/board/posts/${post_id}/comments`);
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
    <div className="post-container">
      <NavBar />

      {/* Post Section */}
      <div className="post-container-home">
        <Link to="/">
          <FaArrowLeft />
        </Link>
        <p className="post-container-home-text"> </p>
        <Link to="/">
          <p className="post-container-home-text">Back to Post List</p>
        </Link>
      </div>
      <PostHeader title={post.title} author={post.author} date={post.date} />
      <PostInfo />
      <PostContext content={post.content} />

      {/* Comment Section */}
      <div className="comments" id="comments">
        <h3>Comments</h3>
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))
        )}

        {/* Add a Comment Input */}
        <div className="comment-input">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleCommentSubmit}>Post</button>
        </div>
      </div>
    </div>
  );
};

export default Post;
