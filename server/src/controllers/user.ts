import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandle.middleware';
import { prisma } from '../config/db';

export const create = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body as { id: string };
    console.log(id);

    res.status(201).json({ message: "User created successfully!" });
})

export const getUser = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ message: "User found!", user: req.user });
})

export const addChild = asyncHandler(async (req: Request, res: Response) => {
    console.log("ok")
    await prisma.users.update({
        where: {
            id: req.user.id
        },
        data: {
            children: {
                create: {
                    status: "PRESENT",
                    userId: req.body.mac
                }
            }
        }
    });

    res.status(200).json({ message: "Child added successfully!" });
});

export const toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body as { id: string };
    const child = await prisma.users.findUnique({ where: { id } });
    const newStatus = child?.status == "MISSING" ? "PRESENT" : "MISSING";

    await prisma.users.update({
        where: { id },
        data: { status: { set: newStatus } }
    });
    
    res.status(200).json({ message: "Child updated successfully!" });
})