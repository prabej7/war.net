import { Users } from '../../generated/prisma';
import { NextFunction, Request, Response } from 'express'
import { prisma } from "../config/db";

declare global {
    namespace Express {
        interface Request {
            user: Users
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.headers.authorization?.split(" ")[1];
        if (!id) {
            res.status(401).json({ message: "Access Denied. No token provided." });
            return;
        }
        const user = await prisma.users.findUnique({ where: { userId: id }, include:{
            children: true,
            location: true,
        } });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: (error as Error).message })
    }
}