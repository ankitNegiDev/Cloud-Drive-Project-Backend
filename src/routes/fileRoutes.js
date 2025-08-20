// all routes realted to file handeling

import express from 'express';
import { getFilesByParentIdController, uploadFileController } from '../controller/fileController.js';
import { upload } from '../middleware/multer.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const fileRouter=express.Router();

// (1) to upload any type of file --- parent id should be passed by client in req.body
fileRouter.post('/', authMiddleware,upload.single('file'),uploadFileController);

// (2) get all files in a parent folder (parentId passed as query param)
fileRouter.get('/', authMiddleware, getFilesByParentIdController);




export default fileRouter;
