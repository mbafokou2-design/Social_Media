import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { uiSliceActions } from '../store/ui-slice'
import { postsActions } from '../store/posts-slice'

const EditPost = () => {
    const dispatch = useDispatch()
    const token = useSelector(state => state?.user?.currentUser?.token)
    const editPostId = useSelector(state => state?.ui?.editPostId)
    const [body, setBody] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const getPost = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/posts/${editPostId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                setBody(response?.data?.body)
            } catch (error) {
                console.log(error)
            }
        }
        if (editPostId) getPost()
    }, [editPostId])

    const closeModal = (e) => {
        if (e.target.classList.contains("editPost")) {
            dispatch(uiSliceActions.closeEditPostModal())
        }
    }

    const updatePost = async (e) => {
        e.preventDefault()
        if (!body) return
        setIsLoading(true)
        try {
            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/posts/${editPostId}`,
                { body },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            dispatch(postsActions.updatePost(response?.data?.post))  // ✅ Redux update
            dispatch(uiSliceActions.closeEditPostModal())
        } catch (err) {
            setError(err?.response?.data?.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="editPost" onClick={closeModal}>
            <div className="editPost__container">
                <h3>Edit Post</h3>
                {error && <p className="form__error-message">{error}</p>}
                <form onSubmit={updatePost}>
                    <textarea
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        placeholder="Update your post..."
                        autoFocus
                    />
                    <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => dispatch(uiSliceActions.closeEditPostModal())}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn primary">
                            {isLoading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}

export default EditPost