"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManger = void 0;
class UserManger {
    constructor() {
        this.users = [];
        this.queue = [];
    }
    addUser(name, socket) {
        this.users.push({
            name,
            socket,
        });
        this.queue.push(socket.id);
        socket.emit("lobby", "waiting ....");
        console.log(`User added: ${name} (${socket.id})`);
    }
    removeUser(socketId) {
        const user = this.users.find(x => x.socket.id === socketId);
        if (!user) {
            return;
        }
        this.users = this.users.filter(x => x.socket.id !== socketId);
        this.queue = this.queue.filter(x => x !== socketId);
    }
}
exports.UserManger = UserManger;
