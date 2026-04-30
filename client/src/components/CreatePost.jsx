import React, { useState } from 'react'
import ProfileImage from './Profileimage';
import { useSelector } from 'react-redux';
import { SlPicture } from 'react-icons/sl';
import { IoClose } from 'react-icons/io5';

const CreatePost = ({ onCreatePost, error }) => {
    const [body, setBody] = useState("")
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)

    const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const removeImage = () => {
        setImage(null)
        setPreview(null)
    }

    const createPost = (e) => {
        e.preventDefault()
        if (!body.trim() && !image) return

        const postData = new FormData()
        postData.append('body', body)
        if (image) postData.append('image', image)

        onCreatePost(postData)
        setBody("")
        setImage(null)
        setPreview(null)
    }

    return (
        <form className="createPost" encType='multipart/form-data' onSubmit={createPost}>
            {error && <p className='createPost__error-message'>{error}</p>}

            <div className='createPost__top'>
                <ProfileImage image={profilePhoto} />
                <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    placeholder="What's on your mind?"
                />
            </div>

            {/* Image Preview */}
            {preview && (
                <div className='createPost__preview'>
                    <img src={preview} alt="Preview" />
                    <button
                        type="button"
                        className='createPost__preview-remove'
                        onClick={removeImage}
                    >
                        <IoClose />
                    </button>
                </div>
            )}

            <div className="createPost__actions">
                <label htmlFor="image" className={preview ? 'createPost__label--active' : ''}>
                    <SlPicture />
                    <span>Photo</span>
                </label>
                <input
                    type="file"
                    id='image'
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button
                    type="submit"
                    disabled={!body.trim() && !image}
                >
                    Post
                </button>
            </div>
        </form>
    )
}

export default CreatePost