// items routes


import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getItemByIdController, getItemsByParentIdController } from "../controller/itemController.js";

const itemRouter=express.Router();


// (1) Get all items (files + folders) inside a parent folder
// parentId passed as query param (null for root)
itemRouter.get('/', authMiddleware, getItemsByParentIdController);

// (2) Get single item (file OR folder) by id
itemRouter.get("/:id", authMiddleware, getItemByIdController);

export default itemRouter;

