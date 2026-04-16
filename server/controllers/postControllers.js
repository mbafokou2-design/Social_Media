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
        const {id} = req.params
        const post = await postModel.findById(id)
        // .populate("creator").populate({path: "comments", options: {sort: {createdAt: -1}}})
        res.json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//Get all posts
//Get /api/posts
//protected
const getPosts = async (req, res, next) => {
    try{
        const posts = await postModel.find().sort({createdAt: -1})
        res.status(200).json(posts)
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







// Update a new post
//patch /api/posts/:id
//protected
const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const {body} = req.body;
        // get post from the database
        const post = await postModel.findById(postId);
        //check if creator of the post is the same as the user making the request
        if(post?.creator != req.user.id) {
            return next(new HttpError("You are not authorized to update this post", 403))
        }
        //update post
        const updatedPost = await postModel.findByIdAndUpdate(postId, {body}, {new: true})
        res.json({message: "Post updated successfully", post: updatedPost})
        res.json(updatedPost).status(200)
    } catch (error) {
        return next(new HttpError(error))
    }
}





// Delete a new post
//DELETE /api/posts/:id
//protected
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        // get post from the database
        const post = await postModel.findById(postId);
        //check if creator of the post is the same as the user making the request
        if(post?.creator != req.user.id) {
            return next(new HttpError("You are not authorized to delete this post", 403))
        }
        // delete post
        const deletedPost = await postModel.findByIdAndDelete(postId)
        res.json({message: "Post deleted successfully", post: deletedPost})
        res.json(deletedPost).status(200)
    } catch (error) {
        return next(new HttpError(error))
    }
}









// get followers posts
//GET /api/posts/following
//protected
const getFollowingPosts = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user.id)
        const posts = await postModel.find({creator: {$in: user.following}})
        res.json(posts)
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
