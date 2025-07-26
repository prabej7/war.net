import { Router } from "express";
import { connections } from "../controllers/connections";

const connectionRouter = Router();

connectionRouter.
    post("/mac", connections);

export default connectionRouter;