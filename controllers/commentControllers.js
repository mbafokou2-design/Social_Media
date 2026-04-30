const HttpError = require('../models/errorModel')
const commentModel = require('../models/commentModel')
const postModel = require('../models/postModel')
const userModel = require('../models/userModel');
// ❌ DELETE this line → const { post, options } = require('../routes/routes');


// Create comment
//post/api/comments/:postId
//protected
const createComment = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const { comment } = req.body;

        if (!comment) {
            return next(new HttpError("Please write a comment", 400));
        }

        // Get comment creator from DB
        const commentCreator = await userModel.findById(req.user.id);

        if (!commentCreator) {
            return next(new HttpError("User not found", 404));
        }

        const newComment = await commentModel.create({
            creatorId: commentCreator._id,
            creatorName: commentCreator.fullname,     // ⚠️ check your User schema
            creatorPhoto: commentCreator.profilePhoto, // ⚠️ check your User schema
            postId,
            comment,
        });

        await postModel.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment._id } },
            { new: true }
        );

        res.status(201).json(newComment);

    } catch (error) {
        return next(new HttpError(error));
    }
};

// get post comments
//get: api/comments/:postId
//protected
const getPostComments = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const comments = await postModel.findById(postId).populate({path:"comments", options: {sort: {createdAt: -1}}});
        res.json(comments)
    } catch (error) {
        return next(new HttpError(error));
    }
};


// delete comment
//delete: api/comments/:commentId
//protected
const deleteComment = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        // Get the comment from the DB
        const comment = await commentModel.findById(commentId);

        if (!comment) {
            return next(new HttpError("Comment not found", 404));
        }

        // ✅ Flat schema — creatorId is directly on comment, not nested
        // ✅ .toString() fixes ObjectId vs string comparison
        if (comment.creatorId.toString() !== req.user.id) {
            return next(new HttpError("You are not authorized to delete this comment", 403));
        }

        // Remove comment id from post's comments array
        await postModel.findByIdAndUpdate(
            comment.postId,
            { $pull: { comments: commentId } }
        );

        // Delete the comment
        const deletedComment = await commentModel.findByIdAndDelete(commentId);

        res.status(200).json(deletedComment);

    } catch (error) {
        return next(new HttpError(error));
    }
};

module.exports = {
    createComment,
    getPostComments,
    deleteComment
}