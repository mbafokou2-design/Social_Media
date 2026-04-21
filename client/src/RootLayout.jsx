import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'    
import Sidebar from './components/Sidebar'     
import Widgets from './components/Widgets'     

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <main className='main'>
                <div className="container main__container">
                    <Sidebar />
                    <Outlet />
                    <Widgets />
                </div>
            </main>
        </>
    )
}

export default RootLayout