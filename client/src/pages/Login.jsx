import React, { useState } from 'react'
import { FaEyeSlash, FaEye, FaUsers, FaComments, FaGlobe, FaBolt } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { userActions } from '../store/user-slice'

const Login = () => {
    const [userData, setUserData] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const successMessage = location.state?.success
    const dispatch = useDispatch()

    const changeInputHandler = (e) => {
        setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const LoginUser = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, userData)
            if (response.status === 200) {
                dispatch(userActions.changeCurrentUser(response?.data))
                localStorage.setItem("user", JSON.stringify(response?.data))
                navigate('/')
            }
        } catch (err) {
            if (!err.response) {
                setError("Cannot connect to server. Please check your connection.")
            } else {
                setError(err.response.data?.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="auth-page">
            {/* Animated background blobs */}
            <div className="auth-bg">
                <div className="auth-blob auth-blob--1" />
                <div className="auth-blob auth-blob--2" />
                <div className="auth-blob auth-blob--3" />
            </div>

            <div className="auth-layout">
                {/* Left panel — branding */}
                <div className="auth-brand">
                    <div className="auth-brand__logo">MBAFOKOU</div>
                    <h1 className="auth-brand__tagline">
                        Your world,<br />
                        <span>connected.</span>
                    </h1>
                    <p className="auth-brand__desc">
                        Share moments, follow friends, and join conversations that matter to you.
                    </p>
                    <ul className="auth-features">
                        <li><FaUsers /><span>Follow people you admire</span></li>
                        <li><FaComments /><span>Real-time private messaging</span></li>
                        <li><FaGlobe /><span>Discover posts from around you</span></li>
                        <li><FaBolt /><span>Instant likes, comments & reactions</span></li>
                    </ul>
                </div>

                {/* Right panel — form */}
                <div className="auth-card">
                    <div className="auth-card__header">
                        <h2>Welcome back</h2>
                        <p>Sign in to continue to MBAFOKOU</p>
                    </div>

                    <form onSubmit={LoginUser} className="auth-form">
                        {successMessage && <p className="form__success-message">{successMessage}</p>}
                        {error && <p className="form__error-message">{error}</p>}

                        <div className="auth-field">
                            <label>Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                name="email"
                                onChange={changeInputHandler}
                                autoFocus
                            />
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <div className="password__controller">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Your password"
                                    name="password"
                                    onChange={changeInputHandler}
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? <span className="auth-spinner" /> : "Sign In"}
                        </button>

                        <p className="auth-switch">
                            Don't have an account? <a href="/register">Create one free</a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login