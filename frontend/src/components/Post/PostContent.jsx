import React from 'react';
import '../../styles/Post.css'

const PostContext = ({ content }) => {
    return (
        <p>{content}</p>
    )
}

export default PostContext;