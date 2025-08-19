// importing express

import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { deleteUserProfileController, getUserProfileController, updateUserProfileController } from '../controller/userController.js';

const userRouter=express.Router();

// we need a auth middleware here for protected routes.

// to get current user / loged in user profile
userRouter.get('/profile', authMiddleware,getUserProfileController);

// to update the loged in user profile
userRouter.put('/profile',authMiddleware,updateUserProfileController);

// to delete the user profile  or delete account feature 
userRouter.delete('/profile',authMiddleware,deleteUserProfileController)


export default userRouter;