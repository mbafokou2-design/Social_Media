import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa';
import { LuUpload } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { userActions } from '../store/user-slice'
import { uiSliceActions } from '../store/ui-slice'

const UserProfile = () => {
    const token = useSelector(state => state?.user?.currentUser?.token)
    const loggedInUserId = useSelector(state => state?.user?.currentUser?.id)
    const currentUser = useSelector(state => state?.user?.currentUser)

    const [user, setUser] = useState({})
    const [followUser, setFollowUser] = useState(false)
    const [avatar, setAvatar] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)  // ✅ added
    const [avatarTouched, setAvatarTouched] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id: userId } = useParams()

    const getUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
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

    const changeAvatarHandler = async (e) => {
        e.preventDefault()
        try {
            const postData = new FormData()
            postData.set("avatar", avatar)
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/users/avatar`,
                postData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log("upload response:", response?.data) // ✅ check response shape
            const newPhoto = response?.data?.user?.profilePhoto
            // ✅ update Redux so Navbar and all components update
            dispatch(userActions.changeCurrentUser({
                ...currentUser,
                profilePhoto: newPhoto
            }))
            // ✅ update localStorage too
            localStorage.setItem("user", JSON.stringify({
                ...currentUser,
                profilePhoto: newPhoto
            }))
            setAvatar(newPhoto)
            setPreviewUrl(null)
            setAvatarTouched(false)
        } catch (error) {
            console.log(error)
        }
    }

    const openEditProfileModal = () => {
        dispatch(uiSliceActions.openEditProfileModal())
    }

    const followUnfollowUser = async () => {
        try {
            await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${userId}/follow-unfollow`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setFollowUser(prev => !prev)
            setUser(prev => ({
                ...prev,
                followers: followUser
                    ? prev.followers.filter(id => id !== loggedInUserId)
                    : [...prev.followers, loggedInUserId]
            }))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="profile">
            <div className="profile__container">
                <form
                    className='profile__image'
                    onSubmit={changeAvatarHandler}
                    encType='multipart/form-data'
                >
                    {/* ✅ previewUrl shows selected image before upload */}
                    <img src={previewUrl || avatar || user?.profilePhoto} alt="" />
                    {!avatarTouched
                        ? <label htmlFor="avatar" className="profile__image-edit">
                            <span><LuUpload /></span>
                          </label>
                        : <button type="submit" className='profile__image-btn'>
                            <FaCheck />
                          </button>
                    }
                    <input
                        type="file"
                        name='avatar'
                        id="avatar"
                        onChange={(e) => {
                            const file = e.target.files[0]
                            setAvatar(file)
                            setAvatarTouched(true)
                            setPreviewUrl(URL.createObjectURL(file))  // ✅ instant preview
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
                        <h4>{user?.posts?.length}</h4>
                        <small>Posts</small>
                    </li>
                </ul>

                <div className="profile__actions-wrapper">
                    {user?._id == loggedInUserId
                        ? <button className='btn' onClick={openEditProfileModal}>Edit Profile</button>
                        : <button onClick={followUnfollowUser} className='btn dark'>
                            {followUser ? "Unfollow" : "Follow"}
                          </button>
                    }
                    {user?._id != loggedInUserId &&
                        <Link to={`/messages/${user?._id}`} className='btn default'>Message</Link>
                    }
                </div>

                <article className='profile__bio'>
                    <p>{user?.bio}</p>
                </article>
            </div>
        </section>
    )
}

export default UserProfile