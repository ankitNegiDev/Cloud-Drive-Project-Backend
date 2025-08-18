import express from 'express';
import { signupController } from '../controller/authController.js';

const authRouter=express.Router();

authRouter.post('/singup', signupController);

export default authRouter;