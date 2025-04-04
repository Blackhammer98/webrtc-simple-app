import { Socket } from "socket.io";

interface Room {
    roomId: string;
    participants: Map<string, Socket>; // Key: socket.id, Value: Socket object
    // Add other room-specific properties if needed (e.g., room name, settings)
}

export class RoomManager {
    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map<string, Room>();
    }

    createRoom(roomId: string) {
        if (this.rooms.has(roomId)) {
            console.log(`Room with ID ${roomId} already exist`);
            return undefined;
        }

        const newRoom: Room = {
            roomId: roomId,
            participants: new Map(),
        };

        this.rooms.set(roomId, newRoom);
        console.log(`Room created : ${roomId}`);
        return newRoom;
    }

    getRoom(roomId: string) {
        return this.rooms.get(roomId);
    }

    addParticipantToRoom(roomId: string, socket: Socket): boolean {
        const room = this.rooms.get(roomId);

        if (room) {
            if (!room.participants.has(socket.id)) {
                room.participants.set(socket.id, socket);
                console.log(`Socket ${socket.id} joined the room ${roomId}`);
                return true;
            } else {
                console.log(`Socket ${socket.id} is already in room ${roomId}`);
                return false;
            }
        } else {
            console.log(`Room with  ID ${roomId} not found.`);
            return false;
        }
    }

    getParticipantsInRoom(roomId: string) {
        const room = this.rooms.get(roomId);
        return room?.participants;
    }

    findRoomByParticipant(participantId: string): Room | undefined {
        for (const room of this.rooms.values()) {
            if (room.participants.has(participantId)) {
                return room;
            }
        }
        return undefined;
    }

    removeParticipantFromRoom(roomId: string, participantId: string): boolean {
        const room = this.rooms.get(roomId);
        if (room && room.participants.has(participantId)) {
            room.participants.delete(participantId);
            console.log(`Participant ${participantId} removed from room ${roomId}`);
            return true;
        } else if (!room) {
            console.log(`Room with ID ${roomId} not found for removing participant ${participantId}`);
            return false;
        } else {
            console.log(`Participant ${participantId} not found in room ${roomId}`);
            return false;
        }
    }
}