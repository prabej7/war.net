import { Router } from "express";
import userRouter from "./user.routes";
import warZoneRouter from "./warzone";
import connectionRouter from "./connection";

const router = Router();

router.use(userRouter);
router.use(warZoneRouter);
router.use(connectionRouter);

export default router;