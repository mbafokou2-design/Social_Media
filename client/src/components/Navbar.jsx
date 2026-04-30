import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import { IoLogOutOutline } from 'react-icons/io5'
import { HiOutlineLogin } from 'react-icons/hi'
import ProfileImage from './Profileimage'
import { useSelector, useDispatch } from 'react-redux'
import { userActions } from '../store/user-slice'

const Navbar = () => {
    const userId = useSelector(state => state?.user?.currentUser?.id)
    const token = useSelector(state => state?.user?.currentUser?.token)
    const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            const timer = setTimeout(() => {
                dispatch(userActions.changeCurrentUser(null))
                localStorage.removeItem("user")
                navigate('/login')
            }, 3600000)
            return () => clearTimeout(timer)
        }
    }, [token])

    return (
        <nav className="navbar">
            <div className="container navbar__container">
                <Link to="/" className='navbar__logo'>MBAFOKOU</Link>
                <form className="navbar__search">
                    <input type="search" placeholder='Search...' />
                    <button type='submit'><CiSearch /></button>
                </form>
                <div className="navbar__right">
                    {token ? (
                        <>
                            <Link to={`/users/${userId}`} className='navbar__profile'>
                                <ProfileImage image={profilePhoto} />
                            </Link>
                            <Link to="/logout" className='navbar__btn navbar__btn--logout'>
                               
                                <span>Logout</span>
                            </Link>
                        </>
                    ) : (
                        <Link to="/login" className='navbar__btn navbar__btn--login'>
                           
                            <span>Login</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar