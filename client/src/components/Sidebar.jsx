import React from 'react'
import { NavLink } from 'react-router-dom'
import { AiOutlineHome } from "react-icons/ai"
import { PiPaintBrush } from 'react-icons/pi'
import { FaRegBookmark } from 'react-icons/fa'
import { GoMail } from 'react-icons/go'
import { useDispatch } from 'react-redux'
import { uiSliceActions } from '../store/ui-slice'

const Sidebar = () => {
    const dispatch = useDispatch()

    const openThemeModal = () => {
        dispatch(uiSliceActions.openThemeModal())
    }

    return (
        <menu className="sidebar">
            <NavLink to="/" className={({ isActive }) => `sidebar__item ${isActive ? "active" : ""}`}>
                <i className="sidebar__icon"><AiOutlineHome /></i>
                <p>Home</p>
            </NavLink>
            <NavLink to="/messages" className={({ isActive }) => `sidebar__item ${isActive ? "active" : ""}`}>
                <i className="sidebar__icon"><GoMail /></i>
                <p>Messages</p>
            </NavLink>
            <NavLink to="/bookmarks" className={({ isActive }) => `sidebar__item ${isActive ? "active" : ""}`}>
                <i className="sidebar__icon"><FaRegBookmark /></i>
                <p>Bookmarks</p>
            </NavLink>
            <button className="sidebar__item" onClick={openThemeModal}>  {/* ✅ button + onClick */}
                <i className="sidebar__icon"><PiPaintBrush /></i>
                <p>Themes</p>
            </button>
        </menu>
    )
}

export default Sidebar