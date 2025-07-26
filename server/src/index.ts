import dotenv from 'dotenv';
dotenv.config({ path: "../.env" })

import express, { NextFunction, Response, Request } from 'express';
import cors from 'cors';

import router from './routes';
import { Server } from 'socket.io';
import { createServer } from 'http';
import socketService from './service/socket';

const app = express();

//Socket Initialization
const server = createServer(app);
export const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

socketService(io);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", router);

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to WarNet API!" });
})

// app.post("/api/mac", (req, res) => {
//     console.log(req.body);
//     res.status(200).json({ message: "OK" });
// })

app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    console.error(err.message);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})