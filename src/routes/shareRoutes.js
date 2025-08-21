// share routes will handel all request that are done for sharing 

import express from 'express';
import { authMiddleware } from "../middleware/authMiddleware.js";
import { accessPublicShareController, createPublicShareController, deletePublicShareController } from '../controller/shareController.js';

const shareRouter=express.Router();

//* (A) Routes for public sharing...

// (1) creating the public share link
shareRouter.post('/public/:itemId', authMiddleware, createPublicShareController);

// (2) deleting the public share link
shareRouter.delete('/public/:itemId', authMiddleware, deletePublicShareController)

// (3) accessing the public share link
shareRouter.get('/public/:token', accessPublicShareController); // here no auth is required.  but we need to generate a signed url since our storage bucket is private so --


export default shareRouter;

