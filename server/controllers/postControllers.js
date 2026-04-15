const HttpError = require('../models/errorModel')
const postModel = require('../models/postModel')
const userModel = require('../models/userModel')



const {v4: uuid} = require('uuid')
const cloudinary = require('../utils/cloudinary')
const fs = require('fs')
const path = require('path')

// Create a new post
//post /api/posts
//protected
const createPost = async (req, res, next) => {
    try {
        const {body} = req.body;
        if(!body) {
            return next(new HttpError("Fill in text field and choose image", 422))
        }
        if(!req.files || !req.files.image) {
            return next(new HttpError("please choose an image", 422))
        } else {
            const {image} = req.files
            //image should be less than 2mb 
            if(image.size > 2000000) {
                return next(new HttpError("Image should be less than 2mb", 422))
            }
            // rename image
            let fileName = image.name;
            fileName = fileName.split(".");
            fileName = fileName[0] + uuid() +  "." + fileName[fileName.length - 1]
            image.mv(path.join(__dirname,'..', 'uploads', fileName), async (err) => {
                if(err) {
                    return next(new HttpError(err))
                }
                //store image on cloudinary
                const result = await cloudinary.uploader.upload(path.join(__dirname,'..', 'uploads', fileName), {
                    resource_type: "image"})
                    if(!result.secure_url) {
                        return next(new HttpError("Error uploading image to Cloudinary", 422))
                    } 
                    //save post to database
                    const newPost = await postModel.create({creator: req.user.id, body, image: result.secure_url})
                    await userModel.findByIdAndUpdate(req.user.id, {$push: {posts: newPost._id}}) // add post to user's posts array
                    res.status(201).json({message: "Post created successfully", post: newPost}) 
            })
        }
    } catch (error) {
        return next(new HttpError(error))
    }
}




// Get a post
//Get /api/posts/:id
//protected
const getPost = async (req, res, next) => {
    try {
        const {id} = req.params;
        const post = await postModel.findById(id)
        if(!post) {
            return next(new HttpError("Post not found", 404))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}












// Get a bookmark posts
//get /api/bookmark
//protected
const getUserBookmarks = async (req, res, next) => {
    try {
        res.json("Get bookmark posts")
    } catch (error) {
        return next(new HttpError(error))
    } 
}


















// create bookmark posts
//post /api/bookmark
//protected
const createBookmark = async (req, res, next) => {
    try {
        res.json("Create bookmark post")
    } catch (error) {
        return next(new HttpError(error))
    } 
}











const getPosts = async (req, res, next) => {
    try {
        const posts = await postModel.find().populate("creator", "-password").sort({createdAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    } 
}













// Update a new post
//patch /api/posts/:id
//protected
const updatePost = async (req, res, next) => {
    try {
        res.json("Update a post")
    } catch (error) {
        return next(new HttpError(error))
    }
}





// Delete a new post
//DELETE /api/posts/:id
//protected
const deletePost = async (req, res, next) => {
    try {
        res.json("Delete a post")
    } catch (error) {
        return next(new HttpError(error))
    }
}









// get followers posts
//GET /api/posts/following
//protected
const getFollowingPosts = async (req, res, next) => {
    try {
        res.json("Get following posts")
    } catch (error) {
        return next(new HttpError(error))
    }
}





// like or unlike a post
//PATCH /api/posts/:id/like
//protected
const likeDislikePost = async (req, res, next) => {
    try {
        res.json("Like or dislike a post")
    } catch (error) {
        return next(new HttpError(error))
    }
}




//get user posts
//PATCH  api/users/:id/posts
//protected
const getUserPosts = async (req, res, next) => {
    try {
        res.json("Get user posts")
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {
    createPost,
    getPost,
    getPosts,
    updatePost,
    deletePost,
    getFollowingPosts,
    likeDislikePost,
    getUserPosts,
    getUserBookmarks,
    createBookmark
}
