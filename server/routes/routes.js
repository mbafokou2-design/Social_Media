const router = require("express").Router()
const authMiddleware = require("../middleware/authMiddleware")

const {registerUser, loginUser, getUser, getUsers, editUser, followUnfollowUser,
 changeUserAvatar} = require("../controllers/userControllers")

 //====================== User Routes ======================//
 router.post("/users/register", registerUser)
 router.post("/users/login", loginUser)
 router.post("/users/avatar", authMiddleware, changeUserAvatar)
 router.get("/users", getUsers)
 router.get("/users/:id/follow-unfollow", authMiddleware, followUnfollowUser)
 router.get("/users/:id", getUser)
 router.put("/users/:id", authMiddleware, editUser)

 module.exports = router;