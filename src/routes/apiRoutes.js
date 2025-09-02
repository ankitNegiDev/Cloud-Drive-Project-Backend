import express from 'express';
import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import folderRouter from './folderRoutes.js';
import fileRouter from './fileRoutes.js';
import itemRouter from './itemRoutes.js';
import trashRouter from './trashRoutes.js';
import shareRouter from './shareRoutes.js';
import searchRouter from './searchRoutes.js';

const apiRouter=express.Router();

// if the api start with /api/auth -- then send request to authRouter.
apiRouter.use('/auth',authRouter);

// if the api start with /api/user -- then send request to userRouter.
apiRouter.use('/user',userRouter);

// if the api start with /api/folder -- then send request to folderRouter.
apiRouter.use('/folder',folderRouter);

// if the api strt with /api/file -- then send all request to file router.
apiRouter.use('/file',fileRouter);

// if the api strt with /api/item -- then send all request to itemRouter.
apiRouter.use('/items',itemRouter);

// if the api start with /api/trash -- then send all request to trashRouter.
apiRouter.use('/trash',trashRouter);

// if the api start with /api/shares -- then send all request to shareRouter.
apiRouter.use('/shares',shareRouter);

// if the api start with /api/search -- then send all request to search rotuesr.
apiRouter.use('/search',searchRouter);
export default apiRouter;
