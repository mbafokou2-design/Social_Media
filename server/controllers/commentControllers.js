const HttpError = require('../models/errorModel')
const commentModel = require('../models/commentModel')
const postModel = require('../models/postModel')
const userModel = require('../models/userModel')


// Create comment
//post/api/comments/:postId
//protected
const createComment = async (req, res, next) => {
    try {
        res.json("Create comment")
    } catch (error) {
        return next(new HttpError(error))
    }
}

// get post comments
//get: api/comments/:postId
//protected
const getPostComments = async (req, res, next) => {
    try {
        res.json("Get post comments")
    } catch (error) {
        return next(new HttpError(error))
    }
}


// delete comment
//delete: api/comments/:postId
//protected
const deleteComment = async (req, res, next) => {
    try {
        res.json("Delete comment")
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {
    createComment,
    getPostComments,
    deleteComment
}