// all folder routes...

import express from "express";
import { createFolderController, deleteFolderController, getFoldersController, renameFolderController } from "../controller/folderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const folderRouter=express.Router();

// (1) to create a folder
folderRouter.post('/',authMiddleware,createFolderController);

// (2) to get all folders in a parent folder or root
// folderRouter.get('/:parentId?', authMiddleware, getFoldersController);
/**
 * in our app we must want to support root folders (no parentId) and nested folders (with parentId) using the same route, then ? is useful. that's why it is written at the end . if we don't write ? at the end the api call at /folder will give error (which is for root folder) 
 *! but this is not supported now in v5 of express os we are using query params.
 */

// get folders (root or inside parent)
folderRouter.get('/', authMiddleware, getFoldersController);


// (3) rename folder using id --- not parent id
folderRouter.put("/:id", authMiddleware, renameFolderController);

// (4) delete folder using  id..  --- not parent id
folderRouter.delete("/:id", authMiddleware, deleteFolderController);




export default folderRouter;