// trash routes.

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getTrashedItemsController } from "../controller/trashController.js";

const trashRouter=express.Router();


// (1) get all trashed items of current user
trashRouter.get("/", authMiddleware, getTrashedItemsController);

// (2) restore an item from trash
trashRouter.put("/:id/restore", authMiddleware, restoreItemController);

// (3) permanently delete an item
trashRouter.delete("/:id", authMiddleware, permanentlyDeleteItemController);

export default trashRouter;
