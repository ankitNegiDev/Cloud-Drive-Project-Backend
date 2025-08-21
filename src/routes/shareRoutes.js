// share routes will handel all request that are done for sharing 

import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { createShareLinkController } from '../controller/shareController.js';

const shareRouter=express.Router();

// (1) creating a shareable link. --POST request on  /api/shares/link/:itemId  -- here itemId will be provided by client in url params -- and this itemId is id of -- items table means either file id or folder id so that we can verify only owner can access it. and from frontend we can send Item id beacuse before creating link we have to fetch the file/folder so we cna store the response of that api call.
shareRouter.post('/link/:itemId', authMiddleware, createShareLinkController);



export default shareRouter;

