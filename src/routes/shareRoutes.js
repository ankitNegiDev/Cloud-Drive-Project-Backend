// share routes will handel all request that are done for sharing 

import express from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { accessPublicShareController, accessRestrictedShareController, createPublicShareController, createRestrictedShareController, deletePublicShareController, deleteRestrictedShareController, getShareInfoByItemIdController, sharedWithMeController } from '../controller/shareController.js';

const shareRouter=express.Router();

// GET /share/:itemId ---> to fetch all share info for an item
shareRouter.get("/:itemId", authMiddleware, getShareInfoByItemIdController);

//* (A) Routes for public sharing...

// (1) creating the public share link
shareRouter.post('/public/:itemId', authMiddleware, createPublicShareController);

// (2) deleting the public share link
shareRouter.delete('/public/:itemId', authMiddleware, deletePublicShareController)

// (3) accessing the public share link
shareRouter.get('/public/:token', accessPublicShareController); // here no auth is required.  but we need to generate a signed url since our storage bucket is private so --


// ==========================================================================

//* (B) Routes for Restricted Sharing

// (1) Create a restricted share (with email or existing user)
shareRouter.post('/restricted/:itemId', authMiddleware, createRestrictedShareController);

// (2) Delete a restricted share
shareRouter.delete('/restricted/:itemId', authMiddleware, deleteRestrictedShareController);

// (3) Access a restricted share using signed url.
/**
 * now this sahreId is what  this `shareRouter.post('/restricted/:itemId', authMiddleware, createRestrictedShareController);` route return the response --- this share response will have the id which is our share id.
 */
shareRouter.get('/restricted/:shareId', authMiddleware, accessRestrictedShareController);

// (4) List of all files/folders shared with me
shareRouter.get('/shared-with-me', authMiddleware, sharedWithMeController);

export default shareRouter;

