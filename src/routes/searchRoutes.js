// search router


import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { searchItemsController } from '../controller/searchController.js';
;

const searchRouter = express.Router();

// GET /api/search?query=&type=&parentId=&limit=&offset=
searchRouter.get('/', authMiddleware, searchItemsController);

export default searchRouter;