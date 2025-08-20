// all routes realted to file handeling

import express from 'express';
import { deleteFileController, getFileByIdController, getFilesByParentIdController, renameFileController, uploadFileController } from '../controller/fileController.js';
import { upload } from '../middleware/multer.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const fileRouter=express.Router();

// (1) to upload any type of file --- parent id should be passed by client in req.body
fileRouter.post('/', authMiddleware,upload.single('file'),uploadFileController);

// (2) get all files in a parent folder (parentId passed as query param)
fileRouter.get('/', authMiddleware, getFilesByParentIdController);


// (3) get a file by its id
fileRouter.get('/:id', authMiddleware, getFileByIdController);

// (4) rename file using id
fileRouter.put('/:id', authMiddleware, renameFileController);

// (5) delete file using id soft deelte
fileRouter.delete('/:id', authMiddleware, deleteFileController);

export default fileRouter;
