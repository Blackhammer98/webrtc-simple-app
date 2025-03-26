"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
class RoomManager {
    constructor() {
        this.rooms = new Map();
    }
    createRoom(roomId) {
        if (this.rooms.has(roomId)) {
            console.log(`Room with ID ${roomId} already exist`);
            return undefined;
        }
        const newRoom = {
            roomId: roomId,
            participants: new Map(),
        };
        this.rooms.set(roomId, newRoom);
        console.log(`Room created : ${roomId}`);
        return newRoom;
    }
    getRoom(roomId) {
        return this.rooms.get(roomId);
    }
    addParticipantToRoom(roomId, socket) {
        const room = this.rooms.get(roomId);
        if (room) {
            if (!room.participants.has(socket.id)) {
                room.participants.set(socket.id, socket);
                console.log(`Socket ${socket.id} joined the room`);
                return true;
            }
            else {
                console.log(`Socket ${socket.id} is already in room ${roomId}`);
                return false;
            }
        }
        else {
            console.log(`Room with  ID ${roomId} not found.`);
            return false;
        }
    }
    getParticipantsInRoom(roomId) {
        const room = this.rooms.get(roomId);
        return room === null || room === void 0 ? void 0 : room.participants;
    }
}
exports.RoomManager = RoomManager;
