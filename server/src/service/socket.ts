import { Server, Socket } from "socket.io";
import { addUser } from "../utils/socketUtils";

export default function socketService(io: Server) {
    io.on("connection", connectionHandler);
}

function connectionHandler(socket: Socket) {
    console.log(`Socket connected: `, socket.id);
    socket.on("auth", (userId: string) => handleAuthentication(userId, socket));
}

function handleAuthentication(userId: string, socket: Socket) {
    addUser(socket, userId);
}


