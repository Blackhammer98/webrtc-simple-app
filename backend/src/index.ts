
import express from "express";

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { UserManger } from "./managers/userManger";

const app = express();
const server = createServer(app);
const io = new Server(server, { 
    cors: {
         origin :"*"
    }
 });
 const userManger = new UserManger()

io.on("connection", (socket : Socket) => {
  console.log(" A user connected");
  userManger.addUser("randomName" , socket)
socket.on("disconnected" , () => {
  console.log(" A user disconnected")
  userManger.removeUser(socket.id)
   });
});

server.listen(3000, () => {
  console.log('listening on * : 3000')
})
