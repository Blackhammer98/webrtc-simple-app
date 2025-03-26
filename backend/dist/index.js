"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const userManger_1 = require("./managers/userManger");
const RoomManager_1 = require("./managers/RoomManager");
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
const userManger = new userManger_1.UserManger();
const roomManager = new RoomManager_1.RoomManager();
io.on("connection", (socket) => {
    console.log(" A user connected : ", socket.id);
    const userName = "userName";
    userManger.addUser(userName, socket);
    socket.emit("connected", { userId: socket.id, userName });
    socket.on("requestNewRoomId", () => {
        const newRoomId = (0, uuid_1.v4)(); // Generate a UUID
        socket.emit("newRoomId", newRoomId);
    });
    socket.on("createRoom", (roomId) => {
        const room = roomManager.createRoom(roomId);
        if (room) {
            roomManager.addParticipantToRoom(roomId, socket);
            socket.emit("room created", roomId);
            console.log(`Room created: ${roomId} by ${socket.id}`);
        }
        else {
            socket.emit('roomCreationFailed', `Room with ID ${roomId} already exist.`);
        }
    });
    socket.on('joinRoom', (roomId) => {
        const room = roomManager.getRoom(roomId);
        if (room) {
            const added = roomManager.addParticipantToRoom(roomId, socket);
            if (added) {
                socket.emit("joinedRoom", roomId);
                console.log(`User ${socket.id} joined room: ${roomId}`);
            }
            else {
                socket.emit("joinRoomFailed", `Could not join room ${roomId}.`);
            }
        }
        else {
            socket.emit("roomNotFound", `Room with ID ${roomId} not found.`);
        }
    });
    socket.on("offer", (offer, remoteSocketId) => {
        socket.to(remoteSocketId).emit("offer", offer, socket.id);
    });
    socket.on("answer", (answer, remoteSocketId) => {
        socket.to(remoteSocketId).emit("answer", answer, socket.id);
    });
    socket.on("iceCandidate", (iceCandidate, remoteSocketId) => {
        socket.to(remoteSocketId).emit("iceCandidate", iceCandidate, socket.id);
    });
    socket.on("disconnected", () => {
        console.log(" A user disconnected");
        userManger.removeUser(socket.id);
    });
});
server.listen(3000, () => {
    console.log('listening on * : 3000');
});
