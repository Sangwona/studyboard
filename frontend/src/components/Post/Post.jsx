import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostContext from './PostContent';

const Post = () => {
    const { post_id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`/board/posts/${post_id}`)
            .then((response) => response.json())
            .then((data) => setPost(data))
            .catch((error) => console.log("Error fetching post:", error));
    }, [post_id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-container">
            <PostHeader title={post.title} author={post.author} date={post.date} />
            <PostContext content={post.content} />
        </div>
    );
}

export default Post;