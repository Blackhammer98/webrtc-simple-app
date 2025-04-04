import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { UserManger } from "./managers/userManger";
import { RoomManager } from "./managers/RoomManager";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
const userManger = new UserManger();
const roomManager = new RoomManager();

io.on("connection", (socket: Socket) => {
  console.log(" A user connected : ", socket.id);

  const userName = "userName";
  userManger.addUser(userName, socket);
  socket.emit("connected", { userId: socket.id, userName });

  socket.on("requestNewRoomId", () => {
    const newRoomId = uuidv4(); // Generate a UUID
    socket.emit("newRoomId", newRoomId);
  });

  socket.on("createRoom", (roomId: string) => {
    const room = roomManager.createRoom(roomId);
    if (room) {
      roomManager.addParticipantToRoom(roomId, socket);
      socket.emit("room created", roomId);
      console.log(`Room created: ${roomId} by ${socket.id}`);
    } else {
      socket.emit('roomCreationFailed', `Room with ID ${roomId} already exist.`);
    }
  });

  socket.on('join-room', (roomId: string) => {
    console.log('Received join-room request for roomId:', roomId, 'from userId:', socket.id);
    const room = roomManager.getRoom(roomId);
    if (room ) {
      roomManager.addParticipantToRoom(roomId, socket);
      console.log(`User ${socket.id} joined room ${roomId}. Participants:`, Array.from(room.participants.keys()));

      for (const participantId of room.participants.keys()) {
        if (participantId !== socket.id) {
          console.log(`Backend emitting 'user-joined' to ${participantId} with userId ${socket.id}`);
          io.to(participantId).emit('user-joined', { userId: socket.id });
          console.log(`Backend emitting 'user-joined' to ${socket.id} with userId ${participantId}`);
          io.to(socket.id).emit('user-joined', { userId: participantId }); // Notify new user about existing ones
        }
      }
    }else {
      console.log(`Room with ID ${roomId} not found when user ${socket.id} tried to join.`);
      socket.emit('roomNotFound', `Room with ID ${roomId} not found.`);
    }
  });

  socket.on('offer', ({ offer, receiverId, roomId }) => {
    io.to(receiverId).emit('offer', { offer, senderId: socket.id });
  });

  socket.on('answer', ({ answer, receiverId, roomId }) => {
    io.to(receiverId).emit('answer', { answer, senderId: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, receiverId, roomId }) => {
    io.to(receiverId).emit('ice-candidate', { candidate, senderId: socket.id });
  });

  socket.on("disconnect", () => {
    console.log(" A user disconnected", socket.id);
    const room = roomManager.findRoomByParticipant(socket.id);
    if (room) {
      roomManager.removeParticipantFromRoom(room.roomId, socket.id);
      for (const participantId of room.participants.keys()) {
        if (participantId !== socket.id) {
          io.to(participantId).emit('user-left', { userId: socket.id });
        }
      }
    }
    userManger.removeUser(socket.id);
  });
});

server.listen(3000, () => {
  console.log('listening on * : 3000');
});