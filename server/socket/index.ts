import { UserData } from './user.data.interface';
import { Chat } from './chat';
import { User } from './user';
import { Product } from './product';

export class Index {
    public IO: any;
    public usersList: UserData[] = [];

    constructor(io ?: any) {
        this.IO = io;
    }

    /** Get socket instance */
    get socketInstance() {
        return this.IO;
    }

    /** Get users list */
    socketIdViaUserId(id): string {
        console.log(JSON.stringify(this.usersList));

        if (this.usersList.findIndex(ele => ele.userId === id) === -1) return '';
        return this.usersList[this.usersList.findIndex(ele => ele.userId === id)].socketId;
    }

    init() {
        this.IO.on('connection', (socket) => {
            console.log("userList", socket.id);

            socket.on('/socket/api/saveUser', (data) => {
                if (this.usersList.findIndex((item) => item.userId === data.id) === -1) {
                    this.usersList.push({ socketId: socket.id, userId: data.id });
                }

                console.log(this.usersList);
                this.IO.emit('/socket/api/updateUserList', { data: this.usersList });
            });

            /** Initialize chat sockets */
            const chatInstance = new Chat(socket, this.IO);
            chatInstance.chatInit();

            /** Initialize user sockets */
            const userSocketInstance = new User(socket, this.IO);
            userSocketInstance.userInit();

            const productInstance = new Product(socket, this.IO, this);
            productInstance.userInit();

            /** Disconnect user while disconnecting */
            socket.on('disconnect', (data) => {
                if (this.usersList.findIndex((item) => item.socketId === socket.id) > -1) this.usersList.splice(this.usersList.findIndex((item) => item.socketId === socket.id), 1);
                this.IO.emit('/socket/api/updateUserList', { data: this.usersList });
            });
        })
    }
}

// {
// 	"id": "5bd5d1bbd1d7fcf5fd4708a8",
//     "accessToken": "00c6da5c257b6efa5a27aa5e9350a79d",
//   	"senderId": "5bd5d1bbd1d7fcf5fd4708a8",
//   	"receiverId": "5bd5d1bdd1d7fcf5fd4708a9",
//   	"message": "fine it"
// }

// {
// 	"id": "5bd5d1bbd1d7fcf5fd4708a8",
//     "accessToken": "00c6da5c257b6efa5a27aa5e9350a79d",
//   	"senderId": "5bd5d1bdd1d7fcf5fd4708a9",
//   	"receiverId": "5bd5d1bbd1d7fcf5fd4708a8",
//   	"message": "fine it"
// }

// {
// 	"id": "5bd5d1bbd1d7fcf5fd4708a8",
//     "accessToken": "00c6da5c257b6efa5a27aa5e9350a79d",
//   	"senderId": "5bd5d1bbd1d7fcf5fd4708a8",
//   	"receiverId": "5bd5d1a7d1d7fcf5fd4708a6",
//   	"message": "fine it"
// }