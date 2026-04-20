const {Schema, model} = require("mongoose");

const ConversationSchema = new Schema({
    participants: [{type: Schema.Types.ObjectId, ref: "User"}],
    LastMessage: {
        text: {type: String, required: true},
        senderId: {type: Schema.Types.ObjectId, ref: "User"}
        
    }

}, {timestamps: true})
module.exports = model("Conversation", ConversationSchema)