import express from 'express';
import authRouter from './authRoutes.js';
import userRouter from './userRouter.js';

const apiRouter=express.Router();

// if the api start with /api/auth -- then send request to authRouter.
apiRouter.use('/auth',authRouter);

// if the api start with /api/user -- then send request to userRouter.
apiRouter.use('/user',userRouter);

export default apiRouter;