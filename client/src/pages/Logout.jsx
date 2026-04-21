import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userActions } from '../store/user-slice' // ⚠️ adjust path if needed

const Logout = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        // clear redux state
        dispatch(userActions.changeCurrentUser(null))
        // clear localStorage
        localStorage.removeItem("user")
        // redirect to login
        navigate('/login')
    }, [])

    return (
        <div>
            <h1>Logging out...</h1>
        </div>
    )
}

export default Logout