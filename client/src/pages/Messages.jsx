import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import TimeAgo from 'react-timeago'
import ProfileImage from '../components/Profileimage.jsx'
import { IoSend } from 'react-icons/io5'
import { getSocket } from '../socket/socket'

const Messages = () => {
    const { receiverId } = useParams()
    const [messages, setMessages] = useState([])
    const [messageText, setMessageText] = useState('')
    const [receiver, setReceiver] = useState(null)
    const [loading, setLoading] = useState(false)
    const [sending, setSending] = useState(false)

    const token = useSelector(state => state?.user?.currentUser?.token)
    const currentUser = useSelector(state => state?.user?.currentUser)
    const onlineUsers = useSelector(state => state?.user?.onlineUsers)

    const socket = getSocket()
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (!receiverId) return
        fetchMessages()
    }, [receiverId])

    useEffect(() => {
        if (!socket) return

        socket.on('newMessage', (newMessage) => {
            if (
                newMessage.senderId === receiverId ||
                newMessage.senderId === currentUser?._id
            ) {
                setMessages(prev => [...prev, newMessage])
            }
        })

        return () => {
            socket.off('newMessage')
        }
    }, [socket, receiverId])

const fetchMessages = async () => {
    try {
        setLoading(true)

        // fetch messages
        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        setMessages(response.data)

        // fetch receiver info separately
        const userResponse = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/${receiverId}`,
            {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        setReceiver(userResponse.data)

    } catch (error) {
        console.log(error)
    } finally {
        setLoading(false)
    }
}

    const sendMessage = async (e) => {
        e.preventDefault()
        if (!messageText.trim()) return

        try {
            setSending(true)
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
                { messageBody: messageText },
                {
                    withCredentials: true,
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            setMessages(prev => [...prev, response.data])
            setMessageText('')
        } catch (error) {
            console.log(error)
        } finally {
            setSending(false)
        }
    }

    const isOnline = onlineUsers?.includes(receiverId)

    return (
        <div className='messagesBox'>
            <div className='messagesBox__header'>
                <ProfileImage
                    image={receiver?.profilePhoto}
                    className={isOnline ? 'active' : ''}
                />
                <div>
                    <h4>{receiver?.fullname || 'Chat'}</h4>
                    <small>{isOnline ? 'Online' : 'Offline'}</small>
                </div>
            </div>

            <div className='messagesBox__messages'>
                {loading && <p className='center'>Loading messages...</p>}

                {!loading && messages.length === 0 && (
                    <p className='center'>No messages yet. Say hello! 👋</p>
                )}
                

                {messages.map((msg) => {
                    // isSent is inside map() where msg is defined
                    const isSent =
                        msg.senderId === currentUser?._id ||
                        msg.senderId === currentUser?.id ||
                        msg.senderId?._id === currentUser?._id ||
                        msg.senderId?._id === currentUser?.id
                    console.log("senderId:", msg.senderId, "currentUser._id:", currentUser?._id, "currentUser.id:", currentUser?.id)

                    return (
                        <div
                            key={msg._id}
                            className={`messagesBox__message ${isSent ? 'sent' : ''}`}
                        >
                            <p>{msg.text}</p>
                            <small>
                                <TimeAgo date={msg.createdAt} />
                            </small>
                        </div>
                    )
                })}
                

                <div ref={messagesEndRef} />
            </div>
            

            <form onSubmit={sendMessage}>
                <input
                    type='text'
                    placeholder='Write a message...'
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={sending}
                />
                <button type='submit' disabled={sending || !messageText.trim()}>
                    <IoSend />
                </button>
            </form>
        </div>
    )
}

export default Messages