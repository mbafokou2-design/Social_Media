import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import TimeAgo from 'react-timeago'
import ProfileImage from '../components/Profileimage'
import LikeDislikePost from '../components/LikeDislikePost'
import BookmarkPost from '../components/BookmarkPost'
import FeedSkeleton from '../components/FeedSkeleton'  // ✅ added
import { FaRegCommentDots } from 'react-icons/fa6'
import { IoMdSend, IoMdShare } from 'react-icons/io'
import { FaTrash } from 'react-icons/fa'

const SinglePost = () => {
    const { id } = useParams()
    const token = useSelector(state => state?.user?.currentUser?.token)
    const userId = useSelector(state => state?.user?.currentUser?.id)
    const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto)
    const [post, setPost] = useState(null)
    const [isLoading, setIsLoading] = useState(false)  // ✅ added
    const [comment, setComment] = useState("")
    const [error, setError] = useState("")

    const getPost = async () => {
        setIsLoading(true)  // ✅ added
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${id}`,
                { headers: { Authorization: `Bearer ${token}` } })
            setPost(response?.data)
        } catch (err) {
            setError(err?.response?.data?.message)
        } finally {
            setIsLoading(false)  // ✅ added
        }
    }

    const createComment = async (e) => {
        e.preventDefault()
        if (!comment) return
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/comments/${id}`,
                { comment },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setPost(prev => ({ ...prev, comments: [response?.data, ...prev.comments] }))
            setComment("")
        } catch (err) {
            setError(err?.response?.data?.message)
        }
    }

    const deleteComment = async (commentId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/comments/${commentId}`,
                { headers: { Authorization: `Bearer ${token}` } })
            setPost(prev => ({
                ...prev,
                comments: prev.comments.filter(c => c._id !== commentId)
            }))
        } catch (err) {
            setError(err?.response?.data?.message)
        }
    }

    useEffect(() => {
        if (token) getPost()
    }, [token])

    // ✅ show skeleton while loading
    if (isLoading) return <FeedSkeleton />

    if (!post) return null

    return (
        <section className="singlePost">
            {error && <p className='form__error-message'>{error}</p>}
            <header className="feed__header">
                <Link to={`/users/${post?.creator?._id}`}>
                    <ProfileImage image={post?.creator?.profilePhoto} />
                    <div className='feed__header-details'>
                        <h4>{post?.creator?.fullname}</h4>
                        <small><TimeAgo date={post?.createdAt} /></small>
                    </div>
                </Link>
            </header>

            <div className='feed__body'>
                <p>{post?.body}</p>
                {post?.image && (
                    <div className="feed__images">
                        <img src={post?.image} alt="" />
                    </div>
                )}
            </div>

            <footer className="feed__footer">
                <div>
                    <LikeDislikePost post={post} />
                    <button className="feed__footer-comments">
                        <FaRegCommentDots />
                        <small>{post?.comments?.length}</small>
                    </button>
                    <button className="feed__footer-share">
                        <IoMdShare />
                    </button>
                </div>
                <BookmarkPost post={post} />
            </footer>

            <div className='singlePost__comments'>
                <div className='singlePost__comments-form'>
                    <ProfileImage image={profilePhoto} />
                    <form onSubmit={createComment}>
                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Write a comment..."
                        />
                        <button type="submit" className='singlePost__comments-btn'>
                            <IoMdSend />
                        </button>
                    </form>
                </div>

                {post?.comments?.map(c => (
                    <div key={c?._id} className='singlePost__comment'>
                        <div className='singlePost__comment-wrapper'>
                            <div className='singlePost__comment-author'>
                                <ProfileImage image={c?.creatorPhoto} />
                            </div>
                            <div className='singlePost__comment-body'>
                                <div>
                                    <h5>{c?.creatorName}</h5>
                                    <small><TimeAgo date={c?.createdAt} /></small>
                                </div>
                                <p>{c?.comment}</p>
                            </div>
                        </div>
                        {userId == c?.creatorId && (
                            <button
                                className='singlePost__comment-delete-btn'
                                onClick={() => deleteComment(c?._id)}
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </section>
    )
}

export default SinglePost