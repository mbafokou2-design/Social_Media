import { io } from "socket.io-client"

let socket = null

export const initializeSocket = (userId) => {
    if (socket) socket.disconnect()
    socket = io(import.meta.env.VITE_API_URL, {
        query: { userId }
    })
    return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect()
        socket = null
    }
}