import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PostHeader from './PostHeader';
import PostContext from './PostContent';
import NavBar from '../NavBarFooter/NavBar';
import { FaArrowLeft } from "react-icons/fa";
import '../../styles/Post.css';

const Post = () => {
    const { post_id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        console.log("Post ID from URL:", post_id);
        fetch(`https://studyboard-production.up.railway.app/board/posts/${post_id}`)
            .then((response) => {
                console.log("Response: ", response);
                return response.json();
            })
            .then((data) => setPost(data))
            .catch((error) => console.log("Error fetching post:", error));
    }, [post_id]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-container">
            <NavBar/>
            <div className='post-container-home'>
                <Link to="/"><FaArrowLeft /></Link>
                <p className='post-container-home-text'> </p>
                <Link to="/"><p className='post-container-home-text'>Back to Post List</p></Link>
            </div>
            <PostHeader title={post.title} author={post.author} date={post.date} />
            <hr className='post-container-line'/>
            <PostContext content={post.content} />
        </div>
    );
}

export default Post;