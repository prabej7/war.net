import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandle.middleware";
import { io } from "..";

export const addWarZone = asyncHandler(async (req: Request, res: Response) => {
    io.emit("new-warzone", "Hello");
    res.status(200).json({ message: "War Zone alerted!" });
})