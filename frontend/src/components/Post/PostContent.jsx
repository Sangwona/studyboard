import React from 'react';
import '../../styles/PostContent.css'

const PostContext = ({ content }) => {
    return (
        <p>{content}</p>
    )
}

export default PostContext;