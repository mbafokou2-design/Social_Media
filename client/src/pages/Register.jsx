import React, { useState } from 'react'
import { FaEyeSlash, FaEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [userData, setUserData] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const changeInputHandler = (e) => {
        setUserData(prevState => ({ ...prevState, [e.target.name]: e.target.value }))
    }



    const registerUser = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, userData);
            if (response.status === 201) {
                navigate('/login', { state: { success: "Account created successfully! Please sign in." } })
            }
        } catch (err) {
            if (!err.response) {
                // ✅ no response = network error / server is down
                setError("Cannot connect to server. Please check your internet connection.")
            } else {
                setError(err.response.data?.message)
            }
        }
    }




    return (
        <section className="register">
            <div className="container register__container">
                <h2>Sign Up</h2>
                <form onSubmit={registerUser}>
                    {error && (
                        <p className="form__error-message">
                            {error}
                        </p>
                    )}
                    <input type="text" placeholder="Full Name" name="fullname"
                        onChange={changeInputHandler} autoFocus />
                    <input type="email" placeholder="Email" name="email"
                        onChange={changeInputHandler} />
                    <div className="password__controller">
                        <input type={showPassword ? "text" : "password"} placeholder="Password" name="password"
                            onChange={changeInputHandler} />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="password__controller">
                        <input type={showPassword ? "text" : "password"} placeholder="Confirm Password" name="confirmPassword"
                            onChange={changeInputHandler} />
                        <span onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <p>Already have an account? <a href="/login">Sign in</a></p>
                    <button type="submit" className="btn primary">Sign Up</button>
                </form>
            </div>
        </section>
    )
}

export default Register