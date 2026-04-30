import React, { useState } from 'react'
import { FaEyeSlash, FaEye, FaUsers, FaComments, FaGlobe, FaBolt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [userData, setUserData] = useState({
        fullname: "", email: "", password: "", confirmPassword: ""
    })
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const changeInputHandler = (e) => {
        setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const registerUser = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData)
            if (response.status === 201) {
                navigate('/login', { state: { success: "Account created! Please sign in." } })
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
                        Join thousands<br />
                        <span>already connected.</span>
                    </h1>
                    <p className="auth-brand__desc">
                        Create your free account and start sharing moments, stories, and ideas with the world.
                    </p>
                    <ul className="auth-features">
                        <li><FaUsers /><span>Build your social circle</span></li>
                        <li><FaComments /><span>Message anyone, anytime</span></li>
                        <li><FaGlobe /><span>Explore posts & trending topics</span></li>
                        <li><FaBolt /><span>100% free — no hidden fees</span></li>
                    </ul>
                </div>

                {/* Right panel — form */}
                <div className="auth-card">
                    <div className="auth-card__header">
                        <h2>Create account</h2>
                        <p>Join MBAFOKOU — it's completely free</p>
                    </div>

                    <form onSubmit={registerUser} className="auth-form">
                        {error && <p className="form__error-message">{error}</p>}

                        <div className="auth-field">
                            <label>Full name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                name="fullname"
                                onChange={changeInputHandler}
                                autoFocus
                            />
                        </div>

                        <div className="auth-field">
                            <label>Email address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                name="email"
                                onChange={changeInputHandler}
                            />
                        </div>

                        <div className="auth-field">
                            <label>Password</label>
                            <div className="password__controller">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    name="password"
                                    onChange={changeInputHandler}
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="auth-field">
                            <label>Confirm password</label>
                            <div className="password__controller">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repeat your password"
                                    name="confirmPassword"
                                    onChange={changeInputHandler}
                                />
                                <span onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? <span className="auth-spinner" /> : "Create Account"}
                        </button>

                        <p className="auth-switch">
                            Already have an account? <a href="/login">Sign in</a>
                        </p>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Register