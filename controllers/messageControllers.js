const HttpError = require("../models/errorModel")
const ConversationModel = require("../models/ConversationModel")
const MessageModel = require("../models/MessageModel")
const {getReceiverSocketId, io} = require("../socket/socket")


// Create a new message
//post : api/messages/:receiverId
//protected
const createMessage = async (req, res, next) => {
    try {
        const { receiverId } = req.params;
        const { messageBody } = req.body;

        // Check if conversation already exists
        let conversation = await ConversationModel.findOne({
            participants: { $all: [req.user.id, receiverId] }
        });

        // Create new conversation if none found
        if (!conversation) {
            conversation = await ConversationModel.create({
                participants: [req.user.id, receiverId],
                LastMessage: { text: messageBody, senderId: req.user.id } 
            });
        }

        // Create the message
        const newMessage = await MessageModel.create({
            conversationId: conversation._id,
            senderId: req.user.id,
            text: messageBody
        });

        // Update last message
        await conversation.updateOne({
            LastMessage: { text: messageBody, senderId: req.user.id } 
        });
        const receiverSocketId = getReceiverSocketId(receiverId)
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }


        res.status(201).json(newMessage);

    } catch (error) {
        return next(new HttpError(error));
    }
};





// Get messages for a conversation
//get : api/messages/:receiverId
//protected
const getMessages = async (req, res, next) => {
    try{
       const { receiverId } = req.params;
       const conversation = await ConversationModel.findOne({
        participants: { $all: [req.user.id, receiverId] }
       })
       if(!conversation) {
        return next(new HttpError("you have no conversation with this user", 404))
       }
       const messages = await MessageModel.find({ conversationId: conversation._id })
    .populate({ path: "senderId", select: "fullname profilePhoto" })  // ← add this
    .sort({ createdAt: 1 })
       res.json(messages)

    } catch(error) {
        return next(new HttpError(error))
    }
}










// Get  conversation
//get : api/conversations
//protected
const getConversation = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(new HttpError("Unauthorized", 401));
        }

        let conversations = await ConversationModel.find({
            participants: { $in: [req.user.id] }
        })
        .populate({ path: "participants", select: "fullname profilePhoto" })
        .sort({ createdAt: -1 });

        conversations = conversations.map(conv => {
            const obj = conv.toObject();
            obj.participants = obj.participants.filter(
                p => p._id.toString() !== req.user.id.toString()
            );
            return obj;
        });

        res.json(conversations);

    } catch (error) {
        return next(new HttpError(error.message || "Server error", 500));
    }
};


module.exports = {
    createMessage,
    getMessages,
    getConversation
}