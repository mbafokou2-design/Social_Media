import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Widgets from './components/Widgets'
import ThemeModal from './components/ThemeModal'
import EditPost from './components/EditPost'
import EditProfile from './components/EditProfile'
import { useSelector } from 'react-redux'

const RootLayout = () => {
    const themeModalIsOpen = useSelector(state => state?.ui?.themeModalIsOpen)
    const editPostModalOpen = useSelector(state => state?.ui?.editPostModalOpen)
    const editProfileModalOpen = useSelector(state => state?.ui?.editProfileModalOpen)
    const theme = useSelector(state => state?.ui?.theme)

    useEffect(() => {
        document.body.classList.remove("dark", "red", "blue", "yellow", "green", "purple")
        if (theme?.backgroundColor) document.body.classList.add(theme.backgroundColor)
        if (theme?.primaryColor) document.body.classList.add(theme.primaryColor)
    }, [theme])

    useEffect(() => {
        const sidebar = document.querySelector('.sidebar')
        if (!sidebar) return

        let lastScrollY = window.scrollY

        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                sidebar.classList.add('hidden')    // scrolling down → hide
            } else {
                sidebar.classList.remove('hidden') // scrolling up → show
            }
            lastScrollY = currentScrollY
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div>
            <Navbar />
            <main className='main'>
                <div className="container main__container">
                    <Sidebar />
                    <Outlet />
                    <Widgets />
                </div>
            </main>
            {themeModalIsOpen && <ThemeModal />}
            {editPostModalOpen && <EditPost />}
            {editProfileModalOpen && <EditProfile />}
        </div>
    )
}

export default RootLayout