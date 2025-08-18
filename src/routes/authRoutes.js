import express from 'express';
import { loginController, signupController } from '../controller/authController.js';

const authRouter=express.Router();

// route for signup
authRouter.post('/singup', signupController);

// route for login or sign in
authRouter.post('/login', loginController);

export default authRouter;