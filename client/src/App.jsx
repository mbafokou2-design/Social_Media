import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Provider } from 'react-redux'
import store from './store/store'
import { userActions } from './store/user-slice'
import { initializeSocket, disconnectSocket, getSocket } from './socket/socket'

import RootLayout from './RootLayout'
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import MessagesList from './components/MessagesList'
import Messages from './pages/Messages'
import Bookmarks from './pages/Bookmarks'
import Profile from './pages/profile'
import SinglePost from './pages/SinglePost'
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <Home /> },
            { path: "messages", element: <MessagesList /> },
            { path: "messages/:receiverId", element: <Messages /> },
            { path: "bookmarks", element: <Bookmarks /> },
            { path: "users/:id", element: <Profile /> },
            { path: "post/:id", element: <SinglePost /> },
        ]
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/logout", element: <Logout /> },
])

// Inner component so it can access Redux inside Provider
const AppContent = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state?.user?.currentUser)
    const theme = useSelector(state => state?.ui?.theme)

    // Socket initialization
    useEffect(() => {
        if (currentUser?._id) {
            const socket = initializeSocket(currentUser._id)

            socket.on('getOnlineUsers', (users) => {
                dispatch(userActions.setOnlineUsers(users))
            })
        } else {
            disconnectSocket()
            dispatch(userActions.setOnlineUsers([]))
        }

        return () => {
            const socket = getSocket()
            if (socket) socket.off('getOnlineUsers')
        }
    }, [currentUser?._id])

    // Theme application
    useEffect(() => {
        document.body.classList.remove("dark", "red", "blue", "yellow", "green", "purple")
        if (theme?.backgroundColor) document.body.classList.add(theme.backgroundColor)
        if (theme?.primaryColor) document.body.classList.add(theme.primaryColor)
    }, [theme])

    return <RouterProvider router={router} />
}

const App = () => {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    )
}

export default App
