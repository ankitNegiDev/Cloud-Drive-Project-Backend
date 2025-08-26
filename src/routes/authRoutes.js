import express from 'express';
import { getCurrentUserController, googleLoginController, loginController, logoutController, signupController } from '../controller/authController.js';

const authRouter=express.Router();

// route for signup
authRouter.post('/signup', signupController);

// route for login or sign in
authRouter.post('/login', loginController);

// route for logout--
authRouter.post('/logout', logoutController);

// get current user.
authRouter.get('/me', getCurrentUserController);

// signup with google
authRouter.get('/google', googleLoginController);

export default authRouter;