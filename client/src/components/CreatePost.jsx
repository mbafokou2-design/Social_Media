import React, { useState } from 'react'
import ProfileImage from './Profileimage';
import { useSelector } from 'react-redux';
import { SlPicture } from 'react-icons/sl';

const CreatePost = ({ onCreatePost, error }) => {  // ✅ destructured correctly
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")

    const profilePhoto = useSelector(state => state?.user?.currentUser?.profilePhoto)

    const createPost = (e) => {
        e.preventDefault();

        if (!image) {
            return; // ✅ don't submit if no image selected
        }

        const postData = new FormData();
        postData.set('body', body);
        postData.set('image', image);
        onCreatePost(postData);
        setBody("")
        setImage(null)
    }

    return (
        <form className="createPost" encType='multipart/form-data' onSubmit={createPost}>  {/* ✅ encType */}
            {error && <p className='createPost__error-message'>{error}</p>}
            <div className='createPost__top'>
                <ProfileImage image={profilePhoto} />
                <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="what's on your mind?" />
            </div>
            <div className="createPost__bottom">
                <span></span>
                <div className="createPost__actions">
                    <label htmlFor="image"><SlPicture /></label>
                    <input type="file" id='image' onChange={e => setImage(e.target.files[0])} />  {/* ✅ fixed typo */}
                    <button type="submit">Post</button>
                </div>
            </div>
        </form>
    )
}

export default CreatePost