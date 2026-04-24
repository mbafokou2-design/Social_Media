import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ProfileImage from './Profileimage'
import TimeAgo from 'react-timeago'
import { FaRegCommentDots } from 'react-icons/fa6'
import { IoMdShare } from 'react-icons/io'
import { BsThreeDots } from 'react-icons/bs'
import LikeDislikePost from './LikeDislikePost'
import BookmarkPost from './BookmarkPost'
import TrimText from '../helpers/TrimText'
import { uiSliceActions } from '../store/ui-slice'
import { postsActions } from '../store/posts-slice'

const Feed = ({ post }) => {
    const [creator, setCreator] = useState({})
    const [showFeedHeaderMenu, setShowFeedHeaderMenu] = useState(false)
    const token = useSelector(state => state?.user?.currentUser?.token)
    const userId = useSelector(state => state?.user?.currentUser?.id)
    const dispatch = useDispatch()

    const getPostCreator = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${post?.creator}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setCreator(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deletePost = async () => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/posts/${post?._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            dispatch(postsActions.deletePost(post?._id))  // ✅ Redux delete
            setShowFeedHeaderMenu(false)
        } catch (error) {
            console.log(error)
        }
    }

    const showEditPostModal = () => {
        dispatch(uiSliceActions.openEditPostModal(post?._id))
        setShowFeedHeaderMenu(false)
    }

    useEffect(() => {
        getPostCreator()
    }, [])

    return (
        <article className="feed">
            <header className="feed__header">
                <Link to={`/users/${post?.creator}`} className='feed__header-profile'>
                    <ProfileImage image={creator?.profilePhoto} />
                    <div className="feed__header-details">
                        <h4>{creator?.fullname}</h4>
                        <small><TimeAgo date={post?.createdAt} /></small>
                    </div>
                </Link>
                {userId == post?.creator && (
                    <button onClick={() => setShowFeedHeaderMenu(prev => !prev)}>
                        <BsThreeDots />
                    </button>
                )}
                {showFeedHeaderMenu && (
                    <menu className='feed__header-menu'>
                        <button onClick={showEditPostModal}>Edit</button>
                        <button onClick={deletePost}>Delete</button>  {/* ✅ works now */}
                    </menu>
                )}
            </header>

            <Link to={`/post/${post?._id}`} className='feed__body'>
                <p><TrimText item={post?.body} maxLength={160} /></p>
                {post?.image && (
                    <div className="feed__images">
                        <img src={post?.image} alt="" />
                    </div>
                )}
            </Link>

            <footer className="feed__footer">
                <div>
                    <LikeDislikePost post={post} />
                    <button className="feed__footer-comments">
                        <Link to={`/post/${post?._id}`}><FaRegCommentDots /></Link>
                        <small>{post?.comments?.length}</small>
                    </button>
                    <button className="feed__footer-share">
                        <IoMdShare />
                    </button>
                </div>
                <BookmarkPost post={post} />
            </footer>
        </article>
    )
}

export default Feed