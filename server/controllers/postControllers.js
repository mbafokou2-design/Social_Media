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
        const { body } = req.body;

        if (!body) {
            return next(new HttpError("Fill in text field and choose image", 422));
        }

        if (!req.files || !req.files.image) {
            return next(new HttpError("please choose an image", 422));
        }

        const image = req.files.image;

        if (image.size > 2000000) {
            return next(new HttpError("Image should be less than 2mb", 422));
        }

        // 🚀 upload directly to Cloudinary (NO local save)
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
            resource_type: "image"
        });

        if (!result.secure_url) {
            return next(new HttpError("Error uploading image to Cloudinary", 422));
        }

        const newPost = await postModel.create({
            creator: req.user.id,
            body,
            image: result.secure_url
        });

        await userModel.findByIdAndUpdate(req.user.id, {
            $push: { posts: newPost._id }
        });

        res.status(201).json({
            message: "Post created successfully",
            post: newPost
        });

    } catch (error) {
        return next(new HttpError(error));
    }
};




// Get a post
//Get /api/posts/:id
//protected
const getPost = async (req, res, next) => {
    try {
        const {id} = req.params
        const post = await postModel.findById(id)
         .populate("creator").populate({path: "comments", options: {sort: {createdAt: -1}}})
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
        const user = await userModel.findById(req.user.id)
            .populate({ path: "bookmarks", options: { sort: { createdAt: -1 } } });

        res.status(200).json(user.bookmarks); // ✅ only bookmarks
    } catch (error) {
        return next(new HttpError(error));
    }
};


















// create bookmark posts
//post /api/bookmark
//protected
const createBookmark = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const user = await userModel.findById(req.user.id);

        const postIsBookmarked = user?.bookmarks?.includes(postId);

        let updatedUser;

        if (postIsBookmarked) {
            updatedUser = await userModel.findByIdAndUpdate(
                req.user.id,
                { $pull: { bookmarks: postId } },
                { new: true }
            );
        } else {
            updatedUser = await userModel.findByIdAndUpdate(
                req.user.id,
                { $push: { bookmarks: postId } },
                { new: true }
            );
        }

        // 🔥 Populate bookmarks before sending
        const populatedUser = await userModel
            .findById(updatedUser._id)
            .populate({ path: "bookmarks", options: { sort: { createdAt: -1 } } });

        res.status(200).json({
            message: postIsBookmarked
                ? "Post removed from bookmarks"
                : "Post added to bookmarks",
            bookmarks: populatedUser.bookmarks
        });

    } catch (error) {
        return next(new HttpError(error));
    }
};






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
        await userModel.findByIdAndUpdate(req.user.id, {$pull: {posts: postId}}) // remove post from user's posts array
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
        const {id} = req.params
        const post = await postModel.findById(id)
        let updatedPost;
        if(post?.likes.includes(req.user.id)) {
            updatedPost = await postModel.findByIdAndUpdate(id, {$pull: {likes: req.user.id}}, {new: true})
        } else {
            updatedPost = await postModel.findByIdAndUpdate(id, {$push: {likes: req.user.id}}, {new: true})
        }
        res.status(200).json(updatedPost)
    } catch (error) {
        return next(new HttpError(error))
    }
}




//get user posts
//PATCH  api/users/:id/posts
//protected
const getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const posts = await postModel.find({creator: userId}).sort({createdAt: -1})
        res.json(posts)
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
