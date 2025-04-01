
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
         origin :"*"
    }
 });
 const userManger = new UserManger();
 const roomManager = new RoomManager();

io.on("connection", (socket : Socket) => {
  console.log(" A user connected : " , socket.id);

  const userName = "userName"
  userManger.addUser(userName , socket);
  socket.emit("connected" , {userId : socket.id , userName});

  socket.on("requestNewRoomId", () => {
    const newRoomId = uuidv4(); // Generate a UUID
    socket.emit("newRoomId", newRoomId);
});

socket.on("createRoom" , (roomId : string) => {
  const room = roomManager.createRoom(roomId);
  if(room) {
    roomManager.addParticipantToRoom(roomId , socket);
    socket.emit("room created" , roomId);
    console.log(`Room created: ${roomId} by ${socket.id}`);
  } else {
    socket.emit('roomCreationFailed' , `Room with ID ${roomId} already exist.`);
  }
})  

socket.on('joinRoom', (roomId : string) => {
    const room  = roomManager.getRoom(roomId);

    if(room) {
      const added = roomManager.addParticipantToRoom(roomId , socket);
      if(added) {
        socket.emit("joinedRoom" , roomId)
        console.log(`User ${socket.id} joined room: ${roomId}`);
      } else {
        socket.emit("joinRoomFailed", `Could not join room ${roomId}.`);
      }
    } else{
      socket.emit("roomNotFound", `Room with ID ${roomId} not found.`);
    }
}) 

socket.on("offer" , (offer:string , remoteSocketId:string) => {

  socket.to(remoteSocketId).emit("offer" , offer , socket.id)
  
})

socket.on("answer" , (answer:string , remoteSocketId:string) => {
   socket.to(remoteSocketId).emit("answer" , answer , socket.id)
})

socket.on("iceCandidate" , (iceCandidate:string , remoteSocketId:string) => {
  socket.to(remoteSocketId).emit("iceCandidate" , iceCandidate , socket.id)
})

socket.on("disconnected" , () => {
  console.log(" A user disconnected")
  userManger.removeUser(socket.id)
   });
});

server.listen(3000, () => {
  console.log('listening on * : 3000')
})
