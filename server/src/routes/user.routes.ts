import { Router } from "express";
import { addChild, create, getUser, toggleStatus } from "../controllers/user";
import { auth } from "../middlewares/auth";

const userRouter = Router();

userRouter
    .post("/user", create)
    .get("/user", auth, getUser)
    .post("/user/member", auth, addChild)
    .patch("/user/member", auth, toggleStatus)

export default userRouter;