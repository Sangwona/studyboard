import React from "react";
import '../../styles/UserIcon.css';

const UserIcon = ({image, userName}) => {
    return (
        <div className="user-icon">
            {/* <img src={image} alt="user-profile-photo"/>
            <p className="user-icon-name">{userName}</p> */}
            <img className="user-icon-image" src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png" alt="user-profile-photo"/>
            <p className="user-icon-name">User 1</p>
        </div>
    );
};

export default UserIcon;