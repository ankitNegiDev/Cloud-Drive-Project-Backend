import express from 'express';
import authRouter from './authRoutes.js';

const apiRouter=express.Router();

// if the api start with /api/auth -- then send request to authRouter.
apiRouter.use('/auth',authRouter);

export default apiRouter;