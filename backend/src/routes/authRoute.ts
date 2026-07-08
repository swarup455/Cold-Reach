import { Router } from "express";
import {
    registerUser,
    verifyOTP,
    resendOTP,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateProfile,
    deleteAccount,
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

router.get("/me", verifyJWT, getCurrentUser);
router.patch("/update-profile", verifyJWT, updateProfile);
router.delete("/delete-account", verifyJWT, deleteAccount);

export default router;