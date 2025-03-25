import { Socket } from "socket.io";


interface User {
    socket : Socket;
    name : string;
   
}

export class UserManger {

    private users : User[];
    private queue : String[]
    constructor() {
        this.users = [];
        this.queue = [];
    }

    addUser(name : string , socket : Socket ) {
       this.users.push({
        name,
        socket,
       })
       this.queue.push(socket.id);
       socket.emit("lobby" , "waiting ....")
       console.log(`User added: ${name} (${socket.id})`);
    }

    removeUser(socketId : string) {
       const user = this.users.find(x => x.socket.id === socketId);
       if(!user) {
        return;
       }

       this.users = this.users.filter(x => x.socket.id !== socketId);
       this.queue = this.queue.filter(x => x !== socketId);

       
    }

}