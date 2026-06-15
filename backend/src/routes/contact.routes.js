import { Router } from "express";
import {
  createContact,
  getAllContacts,
  markContactRead,
} from "../controllers/contact.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateContact } from "../middleware/validate.middleware.js";
import { contactLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();
router.post("/", contactLimiter, validateContact, createContact);
router.get("/", requireAuth, getAllContacts);
router.patch("/:id/read", requireAuth, markContactRead);
export default router;
