import React from "react";

const Comment = ({ comment }) => {
    return (
        <div className="comment">
            <p>{comment.content}</p>
            <small>Posted by User {comment.user_id} on {new Date(comment.created_at).toLocaleString()}</small>
        </div>
    );
};

export default Comment;
