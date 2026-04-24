import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { uiSliceActions } from '../store/ui-slice'
import { userActions } from '../store/user-slice'

const EditProfile = () => {
    const dispatch = useDispatch()
    const token = useSelector(state => state?.user?.currentUser?.token)
    const currentUser = useSelector(state => state?.user?.currentUser)

    const [userData, setUserData] = useState({
        fullname: currentUser?.fullname || "",
        bio: currentUser?.bio || ""
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const closeModal = (e) => {
        if (e.target.classList.contains("editProfile")) {
            dispatch(uiSliceActions.closeEditProfileModal())
        }
    }

    const changeInputHandler = (e) => {
        setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const updateProfile = async (e) => {
        e.preventDefault()
        if (!userData.fullname) {
            setError("Full name is required")
            return
        }
        setIsLoading(true)
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/users/${currentUser?.id}`,
                userData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            // ✅ update Redux state
            dispatch(userActions.changeCurrentUser({
                ...currentUser,
                fullname: response?.data?.fullname,
                bio: response?.data?.bio
            }))
            // ✅ update localStorage
            localStorage.setItem("user", JSON.stringify({
                ...currentUser,
                fullname: response?.data?.fullname,
                bio: response?.data?.bio
            }))
            dispatch(uiSliceActions.closeEditProfileModal())
        } catch (err) {
            setError(err?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="editProfile" onClick={closeModal}>
            <div className="editProfile__container">
                <h2>Edit Profile</h2>
                {error && <p className="form__error-message">{error}</p>}
                <form onSubmit={updateProfile}>
                    <input
                        type="text"
                        name="fullname"
                        value={userData.fullname}
                        onChange={changeInputHandler}
                        placeholder="Full Name"
                    />
                    <textarea
                        name="bio"
                        value={userData.bio}
                        onChange={changeInputHandler}
                        placeholder="Bio"
                    />
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => dispatch(uiSliceActions.closeEditProfileModal())}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn primary">
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditProfile