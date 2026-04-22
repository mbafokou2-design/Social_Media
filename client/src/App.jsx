import React, { useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useSelector } from 'react-redux'
import RootLayout from './RootLayout'
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import MessagesList from './components/MessagesList'
import Messages from './pages/Messages'
import Bookmarks from './pages/Bookmarks'
import Profile from './pages/Profile'
import SinglePost from './pages/SinglePost'
import Login from './pages/Login'
import Register from './pages/Register'
import Logout from './pages/Logout'
import { Provider } from 'react-redux'
import store from './store/store'

const router = createBrowserRouter([
    { path: '/', element: <RootLayout />, errorElement: <ErrorPage />, children: [
        { index: true, element: <Home /> },
        { path: "messages", element: <MessagesList /> },
        { path: "messages/:receiverId", element: <Messages /> },
        { path: "bookmarks", element: <Bookmarks /> },
        { path: "users/:id", element: <Profile /> },
        { path: "post/:id", element: <SinglePost /> },
    ]},
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/logout", element: <Logout /> },
])

// ✅ separate component so we can use useSelector inside Provider
const AppContent = () => {
    const theme = useSelector(state => state?.ui?.theme)

    useEffect(() => {
        // ✅ remove all old theme classes
        document.body.classList.remove("dark", "red", "blue", "yellow", "green", "purple")
        // ✅ apply new ones
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