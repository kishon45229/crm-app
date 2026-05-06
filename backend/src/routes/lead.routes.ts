import { Router } from "express";
import { leadController } from "../controller/lead.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

export const leadRouter = Router();

leadRouter.use(requireAuth);

leadRouter.post("/", asyncHandler(leadController.create));
leadRouter.post("/note/:id", asyncHandler(leadController.addNote));
leadRouter.get("/", asyncHandler(leadController.list));
leadRouter.get("/:id", asyncHandler(leadController.getById));
leadRouter.patch("/:id", asyncHandler(leadController.update));
leadRouter.patch("/:id/status", asyncHandler(leadController.updateStatus));
leadRouter.delete("/:id", asyncHandler(leadController.remove));
