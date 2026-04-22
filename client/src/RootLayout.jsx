import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Widgets from './components/Widgets'
import ThemeModal from './components/ThemeModal'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const RootLayout = () => {
    const themeModalIsOpen = useSelector(state => state?.ui?.themeModalIsOpen)
    const theme = useSelector(state => state?.ui?.theme)  // ✅ get theme


    useEffect(() => {
        // remove old classes first
        document.body.classList.remove("dark")
        // apply new background class
        if (theme?.backgroundColor) {
            document.body.classList.add(theme.backgroundColor)
        }
    }, [theme?.backgroundColor])

    return (
        // ✅ apply primaryColor and backgroundColor as classes to body wrapper
        <div className={`${theme?.primaryColor} ${theme?.backgroundColor}`}>
            <Navbar />
            <main className='main'>
                <div className="container main__container">
                    <Sidebar />
                    <Outlet />
                    <Widgets />
                    {themeModalIsOpen && <ThemeModal />}
                </div>
            </main>
        </div>
    )
}

export default RootLayout