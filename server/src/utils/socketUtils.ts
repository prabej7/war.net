import { Socket } from "socket.io";
import { SocketUser } from "../constants/types";
import { prisma } from "../config/db";
import { io } from "..";


const users: SocketUser = {};

export async function addUser(socket: Socket, userId: string) {
    users[userId] = socket.id;
    console.log(users);

    // Creating user
    const isUser = await prisma.users.findUnique({ where: { userId } });
    if (!isUser) {
        await prisma.users.create({
            data: {
                status: "PRESENT",
                userId
            }
        })
    }
}

export function removeUser(socket: Socket) {
    const userId = Object.keys(users).find((id) => users[id] == socket.id);
    if (userId) {
        delete users[userId];
    }
}

export function handleFoundAlert(parentId: string) {
    const socketId = users[parentId];
    if (socketId) {
        io.to(socketId).emit("childFound", {
            message: "Your missing child has been found!",
            timestamp: new Date().toISOString()
        })
    } else {
        console.warn(`No active socket for parentId: ${parentId}`);
    }
}