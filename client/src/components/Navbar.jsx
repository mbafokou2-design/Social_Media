import React from 'react'
import { Link } from 'react-router-dom'
import { CiSearch } from 'react-icons/ci'
import ProfileImage from './Profileimage'
import { useSelector } from 'react-redux'

const Navbar = () => {
    const userId = useSelector(state => state?.user?.currentUser?.id);
    const token = useSelector(state => state?.user?.currentUser?.token);
    const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto);

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
                        <Link to="/login">Login</Link>  // ✅ shows Login when not authenticated
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar