import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CreatePost from '../components/CreatePost'
import axios from 'axios'
import Feeds from '../components/Feeds'
import FeedSkeleton from '../components/FeedSkeleton'
import { postsActions } from '../store/posts-slice'

const Home = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const token = useSelector(state => state?.user?.currentUser?.token)
    const posts = useSelector(state => state?.posts?.posts)  // ✅ from Redux
    const dispatch = useDispatch()

    const createPost = async (data) => {
        setError("")
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data,
                { headers: { Authorization: `Bearer ${token}` } })
            dispatch(postsActions.addPost(response?.data?.post))  // ✅ dispatch
        } catch (err) {
            setError(err?.response?.data?.message)
        }
    }

    const getPosts = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`,
                { headers: { Authorization: `Bearer ${token}` } })
            dispatch(postsActions.setPosts(response?.data))  // ✅ dispatch
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) getPosts()
    }, [token])

    return (
        <section className='mainArea'>
            <CreatePost onCreatePost={createPost} error={error} />
            {isLoading
                ? <FeedSkeleton />
                : <Feeds posts={posts} onSetPosts={(posts) => dispatch(postsActions.setPosts(posts))} />
            }
        </section>
    )
}

export default Home