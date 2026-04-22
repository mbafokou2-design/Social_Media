import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import ProfileImage from './Profileimage'
import { useSelector, useDispatch } from 'react-redux'
import { userActions } from '../store/user-slice'

const Navbar = () => {
    const userId = useSelector(state => state?.user?.currentUser?.id);
    const token = useSelector(state => state?.user?.currentUser?.token);
    const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            // auto logout after 1 hour (3600000ms)
            const timer = setTimeout(() => {
                dispatch(userActions.changeCurrentUser(null))
                localStorage.removeItem("user")
                navigate('/login')
            }, 3600000)

            // cleanup timer if component unmounts or token changes
            return () => clearTimeout(timer)
        }
    }, [token])

    return (
        <nav className="navbar">
            <div className="container navbar__container">
                <Link to="/" className='navbar__logo'>MBAFOKOU</Link>
                <form className="navbar__search">
                    <input type="search" placeholder='search' />
                    <button type='submit'><CiSearch /></button>
                </form>
                <div className="navbar__right">
                    {token ? (
                        <>
                            <Link to={`/users/${userId}`} className='navbar__profile'>
                                <ProfileImage image={profilePhoto} />
                            </Link>
                            <Link to="/logout">Logout</Link>
                        </>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar