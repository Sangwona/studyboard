import React from 'react';
import { FaRegCommentDots } from "react-icons/fa";
import { CiShare1 } from "react-icons/ci";
import "../../styles/PostInfo.css";

const copyUrlToClipboard = () => {
const currentUrl = window.location.href;

if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentUrl)
    .then(() => alert('URL copied to clipboard!'))
    .catch(err => {
        console.error('Failed to copy URL: ', err);
        alert('Failed to copy URL');
    });
} else {
    // Fallback for older browsers
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = currentUrl;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    alert('URL copied to clipboard!');
}
};

function PostInfo() {
    return (
    <div className="post-info-container">
        <hr className="post-info-container-line" />
        <div className="post-info-container-comment-link-container">
            <a href="#comments" className="post-container-comment-link"><FaRegCommentDots /></a>
            <p className="comments-count post-info-para">30</p>
            <CiShare1 className="post-info-share" onClick={copyUrlToClipboard}/>
            <p className="comments-count post-info-para">Share</p>
        </div>
        <hr className="post-info-container-line" />
    </div>
    )
};

export default PostInfo;