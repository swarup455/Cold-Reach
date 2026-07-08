import { Router } from "express";
import { getCompanies, getCompanyById } from "../controllers/companyController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", verifyJWT, getCompanies);
router.get("/:id", verifyJWT, getCompanyById);

export default router;