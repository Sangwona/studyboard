import React from 'react';
import UserIcon from '../User/UserIcon';
import '../../styles/PostHeader.css';


const PostHeader = ({ title, author, date }) => {
    return (
        <div id="post-header">
            <div className='post-wrapper'>
                <h1 className='post-header-title'>{title}</h1>
                <div className='post-header-author'>
                    <UserIcon></UserIcon>
                    <p className='post-header-date'>· 2025-02-06</p>
                    <p className='post-header-min-read'>· 5 min</p>
                </div>
            </div>
        </div>
    )
}

export default PostHeader;