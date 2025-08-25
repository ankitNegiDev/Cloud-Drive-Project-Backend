import express from 'express';
import { getCurrentUserController, loginController, logoutController, signupController } from '../controller/authController.js';

const authRouter=express.Router();

// route for signup
authRouter.post('/singup', signupController);

// route for login or sign in
authRouter.post('/login', loginController);

// route for logout--
authRouter.post('/logout', logoutController);

// get current user.
authRouter.get('/me', getCurrentUserController);


export default authRouter;