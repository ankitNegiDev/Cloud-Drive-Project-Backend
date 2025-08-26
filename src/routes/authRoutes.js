import express from 'express';
import { getCurrentUserController, googleLoginController, loginController, logoutController, signupController, uploadAvatarController } from '../controller/authController.js';
import { upload } from '../middleware/multer.js';

const authRouter=express.Router();

// we need a upload file route for uploading the avatar image -- 
authRouter.post("/", upload.single("avatar"), uploadAvatarController);


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