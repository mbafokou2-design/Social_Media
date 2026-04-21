const HttpError = require("../models/errorModel")
const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const uuid = require("uuid").v4;
const cloudinary = require("../utils/cloudinary")
const fs = require("fs")
const path = require("path");
const { profile } = require("console");

//====================== Register User ======================//
// Post : /api/users/register
//Unprotected 

const registerUser = async (req, res, next) => {
    try {
        const { fullname, email, password, confirmPassword } = req.body;
        if (!fullname || !email || !password || !confirmPassword) {
            return next(new HttpError("All fields are required", 422))
        }
        //make the email lowercase
        const LowerCaseEmail = email.toLowerCase();
        //check db if email exist
        const emailExist = await User.findOne({ email: LowerCaseEmail })
        if (emailExist) {
            return next(new HttpError("Email already exist", 422))
        }
        //check if password and confirm password match
        if (password !== confirmPassword) {
            return next(new HttpError("Password and confirm password do not match", 422))
        }
        //check password length
        if (password.length < 6) {
            return next(new HttpError("Password must be at least 6 characters", 422))
        }
        // hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        //create user

        const newUser = await User.create({
            fullname,
            email: LowerCaseEmail,
            password: hashedPassword
        })
        res.status(201).json({ message: "User registered successfully", user: newUser })
    } catch (error) {
        return next(new HttpError("Registration failed", 500))
    }
}


//====================== Login User ======================//
// Post : /api/users/login
//Unprotected 

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("All fields are required", 422))
        }
        //make the email lowercase
        const LowerCaseEmail = email.toLowerCase();
        //fetch user from db
        const user = await User.findOne({ email: LowerCaseEmail })
        if (!user) {
            return next(new HttpError("Invalid email or password", 422))
        }
        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return next(new HttpError("Invalid email or password", 422))
        }
        const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, { expiresIn: "1h" })
        res.status(200).json({
            token,
            id: user?._id,
            profilePhoto: user?.profilePhoto,  // ✅ added
            fullname: user?.fullname           // ✅ useful for displaying username in UI
        })

    } catch (error) {
        return next(new HttpError(error))
    }
}







//====================== Get User ======================//
// Get : /api/users/:id
//protected

const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id)
        if (!user) {
            return next(new HttpError("User not found", 404))
        }
        res.status(200).json(user)
    } catch (error) {
        return next(new HttpError(error))
    }
}

//====================== Get Users ======================//
// Get : api/users
//protected

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password")
        res.status(200).json(users)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//====================== Edit Users ======================//
// Put : api/users/edit
//protected

const editUser = async (req, res, next) => {
    try {
        const { fullname, bio } = req.body;
        const editedUser = await User.findByIdAndUpdate(req.user.id, { fullname, bio }, { new: true })
        res.status(200).json(editedUser)
    } catch (error) {
        return next(new HttpError(error))
    }
}


//====================== Follow/unfollow ======================//
// Get : api/users/:id/follow-unfollow
//protected

const followUnfollowUser = async (req, res, next) => {
    try {
        const userToFollowId = req.params.id;
        if (req.user.id === userToFollowId) {
            return next(new HttpError("You cannot follow/unfollow yourself", 422))
        }
        const currentUser = await User.findById(req.user.id);
        const isFollowing = currentUser?.following?.includes(userToFollowId);
        if (isFollowing) {
            // unfollow if already following
            const updatedUser = await User.findByIdAndUpdate(userToFollowId,
                { $pull: { followers: req.user.id } }, { new: true })
            await User.findByIdAndUpdate(req.user.id,
                { $pull: { following: userToFollowId } }, { new: true })
            res.status(200).json({ message: "Unfollowed successfully", user: updatedUser })
        } else {
            // follow if not following
            const updatedUser = await User.findByIdAndUpdate(userToFollowId,
                { $push: { followers: req.user.id } }, { new: true })
            await User.findByIdAndUpdate(req.user.id,
                { $push: { following: userToFollowId } }, { new: true })
            res.status(200).json({ message: "Followed successfully", user: updatedUser })
        }

    } catch (error) {
        return next(new HttpError(error))
    }
}

//====================== change user profile photo ======================//
// Put : api/users/avatar
//protected

const changeUserAvatar = async (req, res, next) => {
    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError("please choose an image", 422))
        }
        // Handle both single file and array of files
        const avatar = Array.isArray(req.files.avatar) ? req.files.avatar[0] : req.files.avatar;
        // check file size
        if (avatar.size > 1024 * 1024) {
            return next(new HttpError("File size must be less than 1MB", 422))
        }
        let fileName = avatar.name;
        if (!fileName) {
            return next(new HttpError("Invalid file name", 422))
        }
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + "_" + uuid() + "." + splittedFilename[splittedFilename.length - 1]
        avatar.mv(path.join(__dirname, "..", "uploads", newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err))
            }
            // upload to cloudinary
            const result = await cloudinary.uploader.upload(path.join(__dirname, "..", "uploads", newFilename),
                { resource_type: "image" });
            if (!result.secure_url) {
                return next(new HttpError("could not upload image to cloudinary", 422))
            }
            // update user avatar
            const updatedUser = await User.findByIdAndUpdate(req.user.id, { profilePhoto: result?.secure_url }, { new: true })
            res.status(200).json({ message: "Profile photo updated successfully", user: updatedUser })
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    getUsers,
    editUser,
    followUnfollowUser,
    changeUserAvatar
}
