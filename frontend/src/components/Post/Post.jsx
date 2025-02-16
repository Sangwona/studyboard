import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostContext from './PostContent';
import NavBar from '../NavBarFooter/NavBar';
import { FaArrowLeft } from "react-icons/fa";
import '../../styles/Post.css';
import Comment from '../Comment/Comment';

const Post = () => {
    const { post_id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        console.log("Post ID from URL:", post_id);

        // Fetch post data
        fetch(`https://studyboard-production.up.railway.app/board/posts/${post_id}`)
            .then((response) => {
                console.log("Response: ", response);
                return response.json();
            })
            .then((data) => setPost(data))
            .catch((error) => console.log("Error fetching post:", error));

        // Fetch comments
        console.log("Fetching comments from frontend")
        fetch(`https://studyboard-production.up.railway.app/board/posts/${post_id}/comments`)
            .then((response) => response.json())
            .then((data) => setComments(data))
            .catch((error) => console.log("Error fetching comments:", error));
    }, [post_id]);

    const handleCommentSubmit = () => {
        if (!newComment.trim()) return; // Prevent empty comments

        const userID = 1;  // ✅ Temporary fix until we get actual logged-in user

        fetch(`https://studyboard-production.up.railway.app/board/posts/${post_id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: newComment,
                user_id: userID,
            }),
        })
                .then((response) => {
                    console.log("Response: ", response);
                    return response.json();
                })
                .then(data => {
                setNewComment("");  // Clear input field
                setComments([...comments, data]);  // Update UI instantly
            })
            .catch(error => console.log("Error posting comment:", error));
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-container">
            <NavBar />

            {/* Post Section */}
            <div className='post-container-home'>
                <Link to="/"><FaArrowLeft /></Link>
                <p className='post-container-home-text'> </p>
                <Link to="/"><p className='post-container-home-text'>Back to Post List</p></Link>
            </div>
            <PostHeader title={post.title} author={post.author} date={post.date} />
            <PostContext content={post.content} />

            {/* Comment Section */}
            <div className="comments">
                <h3>Comments</h3>
                {comments.length === 0 ? (
                    <p>No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => <Comment key={comment.id} comment={comment} />
                    )
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
}


export default Post;