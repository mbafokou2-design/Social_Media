import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa';
import { LuUpload } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

const UserProfile = () => {
    const token = useSelector(state => state?.user?.currentUser?.token)
    const loggedInUserId = useSelector(state => state?.user?.currentUser?.id)

    const [user, setUser] = useState({})
    const [followUser, setFollowUser] = useState(false)
    const [avatar, setAvatar] = useState(null)
    const [avatarTouched, setAvatarTouched] = useState(false)

    const { id: userId } = useParams()

    const getUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${userId}`,
                {
                    withCredentials: true,
                    headers: token ? {
                        Authorization: `Bearer ${token}`
                    } : {}
                }
            )

            setUser(response?.data)
            setFollowUser(
                Array.isArray(response?.data?.followers) &&
                response.data.followers.includes(loggedInUserId)
            )
            setAvatar(response?.data?.profilePhoto)

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (userId) getUser()
    }, [userId, token, loggedInUserId])

    const changeAvatarHandler = (e) => {
        e.preventDefault()
    }

    const openEditProfileModal = () => {

    }

    const followUnfollowuser = () => {
        
    }


    return (
        <section className="profile">
            <div className="profile__container">

                <form
                    className='profile__image'
                    onSubmit={changeAvatarHandler}
                    encType='multipart/form-data'
                >
                    <img
                        src={avatar || user?.profilePhoto}
                        alt=""
                    />

                    {!avatarTouched ? <label htmlFor="avatar" className="profile__image-edit">
                        <span><LuUpload /></span>
                    </label> :

                        <button className='profile__image-btn'>
                            <FaCheck />
                        </button>}

                    <input
                        type="file"
                        name='avatar'
                        id="avatar"
                        onChange={(e) => {
                            setAvatar(e.target.files[0])
                            setAvatarTouched(true)
                        }}
                        accept='image/png, image/jpg, image/jpeg'
                    />
                </form>
                <h4>{user?.fullname}</h4>
                <small>{user?.email}</small>
                <ul className="profile__follows">
                    <li>
                        <h4>{user?.following?.length}</h4>
                        <small>Following</small>
                    </li>
                    <li>
                        <h4>{user?.followers?.length}</h4>
                        <small>Followers</small>
                    </li>
                    <li>
                        <h4>230</h4>
                        <small>Like</small>
                    </li>
                </ul>
                <div className="profile__actions-wrapper">
                    {user?._id == loggedInUserId ? <button className='btn' onClick={openEditProfileModal}>
                     Edit Profile</button> : <button onClick={followUnfollowuser} className='btn dark'>{followUser ? "Unfollow" : "Follow"}</button>}
                    {user?._id != loggedInUserId && 
                    <Link to={`/messages/${user?._id}`} className='btn default'>Message</Link>}
                </div>
                <article className='profile__bio'>
                    <p>{user?.bio}</p>
                </article>
            </div>
        </section>
    )
}

export default UserProfile