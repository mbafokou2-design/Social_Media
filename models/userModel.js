const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto:{
        type: String,
        default: "https://res.cloudinary.com/dafs2tmoi/image/upload/v1775229217/default_hzvpbl.webp"
    },
    bio: {
        type: String,
        default: "Hey there! I'm using Social Media App."
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,    
            ref: "User"
        }
    ],
    bookmarks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    ]

}, {
    timestamps: true
});

module.exports = model("User", userSchema);