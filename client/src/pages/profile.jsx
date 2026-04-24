import React, { useEffect, useState } from 'react'
import UserProfile from '../components/UserProfile'
import HeaderInfo from '../components/HeaderInfo'
import Feed from '../components/Feed'
import FeedSkeleton from '../components/FeedSkeleton'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const Profile = () => {
    const [user, setUser] = useState({})
    const [userPosts, setUserPosts] = useState([])  
    const [isLoading, setIsLoading] = useState(false)
    const { id: userId } = useParams()
    const token = useSelector(state => state?.user?.currentUser?.token)

    const getUser = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${userId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUser(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getUserPosts = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/users/${userId}/posts`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUserPosts(response?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            getUser()
            getUserPosts()
        }
    }, [token, userId])

    return (
        <section>
            <UserProfile />
            <HeaderInfo text={`${user?.fullname}'s posts`} />
            {isLoading
                ? <FeedSkeleton />
                : userPosts.length === 0
                    ? <p className='center'>No posts yet.</p>
                    : userPosts.map(post => (
                        <Feed key={post?._id} post={post} onSetPosts={setUserPosts} />
                    ))
            }
        </section>
    )
}

export default Profile