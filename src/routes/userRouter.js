// importing express

import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getUserProfileController } from '../controller/userController.js';

const userRouter=express.Router();

// we need a auth middleware here for protected routes.

// to get current user profile
userRouter.get('/profile', authMiddleware,getUserProfileController);


export default userRouter;