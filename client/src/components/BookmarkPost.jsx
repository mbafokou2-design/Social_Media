import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { FaRegBookmark, FaBookmark } from 'react-icons/fa'

const BookmarkPost = ({ post }) => {
    const token = useSelector(state => state?.user?.currentUser?.token)
    const userId = useSelector(state => state?.user?.currentUser?.id)
    // ✅ get bookmarks from user in Redux store
    const userBookmarks = useSelector(state => state?.user?.currentUser?.bookmarks || [])

    const [isBookmarked, setIsBookmarked] = useState(
        userBookmarks.includes(post?._id) // ✅ check if post id is in user's bookmarks
    )

    const bookmarkPost = async () => {
        setIsBookmarked(prev => !prev)
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/posts/${post?._id}/bookmark`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
        } catch (error) {
            setIsBookmarked(prev => !prev) // revert on error
        }
    }

    return (
        <button onClick={bookmarkPost} className="feed__footer-bookmark">
            {isBookmarked
                ? <FaBookmark style={{ color: "var(--color-primary)" }} />
                : <FaRegBookmark />
            }
        </button>
    )
}

export default BookmarkPost