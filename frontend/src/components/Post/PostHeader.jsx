import React from 'react';
import UserIcon from '../User/UserIcon';
import '../../styles/PostHeader.css';


const PostHeader = ({ title, author, date }) => {
    return (
        <div id="post-header">
            <div className='post-wrapper'>
                {/* <h1>{title}</h1> */}
                <h1 className='post-header-title'>This is a Cool Post about the StudyBoard</h1>
                <div className='post-header-author'>
                    <UserIcon></UserIcon>
                    {/* <p>{date.year}-{date.month}-{date.day}</p> */}
                    <p className='post-header-date'>· 2025-02-06</p>
                </div>
            </div>
        </div>
    )
}

export default PostHeader;