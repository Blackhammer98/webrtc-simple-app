import { useCallback, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { io, Socket } from "socket.io-client";
import { userIdState, userNameState } from "../store/atoms/userAtom";


const SERVER_URL = 'http://localhost:3000';

export const useSocket = () => {

const [socket , setSocket] = useState<Socket | null>(null);
const [isConnected , setIsConnected] = useState(false);
const [socketError , setSocketError] = useState<string | null>(null);
const setUserId = useSetRecoilState(userIdState);
const setUserName = useSetRecoilState(userNameState);

useEffect(() => {
 const newSocket = io(SERVER_URL,{
    autoConnect : true
 });
 setSocket(newSocket);

 newSocket.on('connect', () => {
    setIsConnected(true);
    setSocketError(null);
    console.log("Connected to server")
 });

 newSocket.on('disconnect', () => {
    setIsConnected(false);
    console.log('Disconnected from server')
 });

 newSocket.on('connect_error', (error) => {
   setIsConnected(false);
   setSocketError(`Connection error: ${error.message}`);
   console.error('Connection Error :' , error);

 });

 newSocket.on('connected', (data : { userId : string , userName : string}) => {
   setUserId(data.userId);
   setUserName(data.userName);
   console.log("Connected  event received" , data);
 });
return () => {
    newSocket.off('connect');
    newSocket.off('disconnect');
    newSocket.off('connect_error');
    newSocket.off('connected');
    newSocket.off('roomId');
    newSocket.off('joinedRoom');
    newSocket.off('roomNotFound');
    newSocket.off('joinedRoomFailed');
    newSocket.off('room created'); 
    newSocket.off('roomCreationFailed');
};
},[setUserId , setUserName]);

const requestNewRoomId = useCallback(() => {
if(socket && isConnected) {
  console.log('Emitting requestNewRoomId');
    socket.emit('requestNewRoomId');
}else {
    console.warn('Socket not connected , cannot request new Room Id');
    setSocketError("Not connected to server")
}
},[socket , isConnected]);

const createRoom = useCallback((roomId : string) => {
  if(socket && isConnected) {
    socket.emit('createRoom', roomId);
  }else {
    console.warn("Scoket not Connected , cannot create room")
    setSocketError("Not connected to server")
  }
},[socket , isConnected]);

const joinRoom = useCallback((roomId : string) => {
  if(socket && isConnected) {
    console.log('Emitting joinRoom:', roomId);
    socket.emit('joinRoom' , roomId);
  }else { 
    console.warn("Scoket not Connected , cannot join room")
    setSocketError("Not connected to server")
  }
},[socket , isConnected]);

return {
    socket,
    isConnected,
    socketError,
    requestNewRoomId,
    createRoom,
    joinRoom
};
}
 
