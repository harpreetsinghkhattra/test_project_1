import { Index } from './index';
export class Chat {
    socket: any;
    IO: any;
    constructor(socket, io) {
        this.socket = socket;
        this.IO = io;
    }

    chatInit() {

        this.messages();
    }

    /** Private messaging */
    messages() {
        this.socket.on('/socket/api/message', (data: Message) => {
            this.IO.to(data.receiverId).emit('/socket/api/response/message', data.message);
            this.IO.to(data.senderId).emit('/socket/api/response/message', data.message);
        });
    }
}

interface Message {
    senderId: string;
    receiverId: string;
    message: string;
}