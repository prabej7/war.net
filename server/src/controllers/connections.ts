import { Response, Request } from 'express'
import asyncHandler from "../middlewares/asyncHandle.middleware";
import { prisma } from '../config/db';
import { handleFoundAlert } from '../utils/socketUtils';

export const connections = asyncHandler(async (req: Request, res: Response) => {
    const { mac, connectedAt } = req.body as { mac: string, connectedAt: string };
    const user = await prisma.users.findUnique({ where: { userId: mac } });
    if (user) {
        if (user?.status == "MISSING" && user.parentId) {
            const parent = await prisma.users.findUnique({ where: { id: user.parentId } });
            if (parent)
                handleFoundAlert(parent?.userId)
        }
    }

    res.status(200).json({ message: "OK" });
})