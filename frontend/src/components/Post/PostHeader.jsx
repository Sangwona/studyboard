import React from 'react';
import UserIcon from '../User/UserIcon';
import '../../styles/Post.css';


const PostHeader = ({ title, author, date }) => {
    return (
        <div id="post-header">
            <div className='post-wrapper'>
                <h1 className='post-header-title'>{title}</h1>

            </div>
        </div>
    )
}

export default PostHeader;