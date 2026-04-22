import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import CreatePost from '../components/CreatePost'
import axios from 'axios'
import Feeds from '../components/Feeds'

const Home = () => {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const token = useSelector(state => state?.user?.currentUser?.token)

    const createPost = async (data) => {
        setError("")
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/posts`, data,
                { headers: { Authorization: `Bearer ${token}` } })
            setPosts(prev => [response?.data?.post, ...prev])
        } catch (err) {
            setError(err?.response?.data?.message)
        }
    }

    const getPosts = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts`,
                { headers: { Authorization: `Bearer ${token}` } })
            setPosts(response?.data)
        } catch (err) {  // ✅ was "error" but logged "err"
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) {  // ✅ only fetch when token exists
            getPosts()
        }
    }, [token])  // ✅ re-runs when token becomes available // ✅ empty array — only run once on mount

    return (
        <section className='mainArea'>
            <CreatePost onCreatePost={createPost} error={error} />
            <Feeds posts={posts} onSetPosts={setPosts} />
        </section>
    )
}

export default Home