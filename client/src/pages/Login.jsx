import React, { useState } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { userActions } from '../store/user-slice'

const Login = () => {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const successMessage = location.state?.success
    const dispatch = useDispatch()

    const changeInputHandler = (e) => {
        setUserData(prevState => ({ ...prevState, [e.target.name]: e.target.value }))
    }

    const LoginUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, userData);
            if (response.status === 200) {
                dispatch(userActions.changeCurrentUser(response?.data))
                localStorage.setItem("user", JSON.stringify(response?.data))
                navigate('/')
            }
        } catch (err) {
            if (!err.response) {
                setError("Cannot connect to server. Please check your internet connection.")
            } else {
                setError(err.response.data?.message)
            }
        }
    }

    return (
        <section className="register">
            <div className="container register__container">
                <h2>Sign In</h2>
                <form onSubmit={LoginUser}>
                    {successMessage && (
                        <p className="form__success-message">
                            {successMessage}
                        </p>
                    )}
                    {error && (
                        <p className="form__error-message">
                            {error}
                        </p>
                    )}
                    <input type="email" placeholder="Email" name="email"
                        onChange={changeInputHandler} autoFocus />
                    <div className="password__controller">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" name="password"
                            onChange={changeInputHandler} />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <p>Don't have an account? <a href="/register">Sign up</a></p>
                    <button type="submit" className="btn primary">Sign In</button>
                </form>
            </div>
        </section>
    )
}

export default Login