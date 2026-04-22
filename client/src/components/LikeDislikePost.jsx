import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { FaHeart, FaRegHeart } from 'react-icons/fa'

const LikeDislikePost = ({ post }) => {
    const token = useSelector(state => state?.user?.currentUser?.token)
    const userId = useSelector(state => state?.user?.currentUser?.id)
    const [likes, setLikes] = useState(post?.likes || [])

    const isLiked = likes.includes(userId)

    const likeDislikePost = async () => {
        // optimistic update — update UI before API call
        if (isLiked) {
            setLikes(prev => prev.filter(id => id !== userId))
        } else {
            setLikes(prev => [...prev, userId])
        }
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${post?._id}/like`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } catch (error) {
            // revert on error
            if (isLiked) {
                setLikes(prev => [...prev, userId])
            } else {
                setLikes(prev => prev.filter(id => id !== userId))
            }
        }
    }

    return (
        <button onClick={likeDislikePost} className="feed__footer-like">
            {isLiked
                ? <FaHeart style={{ color: "red" }} />
                : <FaRegHeart />
            }
            <small>{likes.length}</small>
        </button>
    )
}

export default LikeDislikePost