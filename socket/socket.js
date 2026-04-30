const http = require("http");
const { Server } = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
    }
});

const getReceiverSocketId = (recipientId) => {
    return userSocketMap[recipientId];
};

const userSocketMap = {}; // to store userId and socketId pairs

io.on("connection", (socket) => {
    console.log("a user connected: " ,socket.id);
    const userId = socket.handshake.query.userId; // get userId from query params

    if (userId != "undefined") userSocketMap[userId] = socket.id; // store userId and socketId

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // emit online users to all clients

    socket.on("disconnect", () => {
        console.log("user disconnected: ");
        delete userSocketMap[userId]; // remove user from map on disconnect
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // emit updated online users
    });
});
module.exports = {io, server, app, getReceiverSocketId};