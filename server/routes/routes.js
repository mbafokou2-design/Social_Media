const router = require("express").Router()
const authMiddleware = require("../middleware/authMiddleware")


const  {
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
    = require("../controllers/postControllers")
const {registerUser, loginUser, getUser, getUsers, editUser, followUnfollowUser,
 changeUserAvatar} = require("../controllers/userControllers")

const {createComment, getPostComments, deleteComment} = require("../controllers/commentControllers")

 //====================== User Routes ======================//
 router.post("/users/register", registerUser)
 router.post("/users/login", loginUser)
 router.get("/users/bookmarks",authMiddleware, getUserBookmarks) // brought thsi route up here to avoid conflict with get user
 router.post("/users/avatar", authMiddleware, changeUserAvatar)
 router.get("/users", authMiddleware, getUsers)
 router.get("/users/:id/follow-unfollow", authMiddleware, followUnfollowUser)
 router.get("/users/:id", authMiddleware, getUser)
 router.put("/users/:id", authMiddleware, editUser)
 router.get("/users/:id/posts", authMiddleware, getUserPosts)



//====================== Post Routes ======================//
 router.post('/posts', authMiddleware, createPost)
 router.get('/posts/following', authMiddleware, getFollowingPosts)
 router.get('/posts', authMiddleware, getPosts)
 router.patch('/posts/:id/like', authMiddleware, likeDislikePost)        
 router.post('/posts/:id/bookmark', authMiddleware, createBookmark)
 router.get('/posts/:id', authMiddleware, getPost)
 router.patch('/posts/:id', authMiddleware, updatePost)
 router.delete('/posts/:id', authMiddleware, deletePost)

//====================== Comment Routes ======================//
 router.post('/comments/:postId', authMiddleware, createComment)
 router.get('/comments/:postId', authMiddleware, getPostComments)
 router.delete('/comments/:postId', authMiddleware, deleteComment)

 module.exports = router; 