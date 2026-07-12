import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";
import {
    connectGoogle,
    googleCallback,
    getGoogleStatus,
    disconnectGoogle,
    sendEmail,
} from "../controllers/googleController.js";

const router = Router();

router.get("/connect", verifyJWT, connectGoogle);
router.get("/callback", googleCallback);
router.get("/status", verifyJWT, getGoogleStatus);
router.delete("/disconnect", verifyJWT, disconnectGoogle);
router.post("/send-email", verifyJWT, sendEmail);

export default router;