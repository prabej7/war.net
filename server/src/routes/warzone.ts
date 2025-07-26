import { Router } from "express";
import { addWarZone } from "../controllers/warZoneContoller";

const router = Router();

router.post("/warzone", addWarZone);

export default router;