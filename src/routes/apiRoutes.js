import express from 'express';
import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import folderRouter from './folderRoutes.js';
import fileRouter from './fileRoutes.js';

const apiRouter=express.Router();

// if the api start with /api/auth -- then send request to authRouter.
apiRouter.use('/auth',authRouter);

// if the api start with /api/user -- then send request to userRouter.
apiRouter.use('/user',userRouter);

// if the api start with /api/folder -- then send request to folderRouter.
apiRouter.use('/folder',folderRouter);

// if the api strt with /api/file -- then send all request to file router.
apiRouter.use('/file',fileRouter);

export default apiRouter;
