import React from 'react'

const ProfileImage = ({ image, className = '' }) => {
    return (
        <div className={`profileImage ${className}`}>
            <img src={image} alt="profile" />
        </div>
    )
}

export default ProfileImage