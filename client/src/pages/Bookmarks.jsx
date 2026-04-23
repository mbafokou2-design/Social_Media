import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Feed from '../components/Feed'
import FeedSkeleton from '../components/FeedSkeleton'

const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const token = useSelector(state => state?.user?.currentUser?.token)

    const getBookmarks = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/bookmarks`,
                { headers: { Authorization: `Bearer ${token}` } })
            setBookmarks(response?.data)
        } catch (err) {
            setError(err?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) getBookmarks()
    }, [token])

    return (
        <section className='mainArea'>
            <h2 className='headerInfo'>My Bookmarks</h2>
            {error && <p className='form__error-message'>{error}</p>}
            {isLoading
                ? <FeedSkeleton />
                : bookmarks.length === 0
                    ? <p className='center'>No bookmarks yet.</p>
                    : bookmarks.map(post => (
                        <Feed key={post?._id} post={post} onSetPosts={setBookmarks} />
                    ))
            }
        </section>
    )
}

export default Bookmarks