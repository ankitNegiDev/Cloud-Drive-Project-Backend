/**
//  * signup -- api data for request
{
    "email":"bingolive9104@gmail.com",
    "password":"123456",
    "fullName":"Ankit Negi",
    "avatarUrl":"https://res.cloudinary.com/dyg3mh5wg/image/upload/v1755585491/main-sample.png"
}

token -- for bingolive email 

eyJhbGciOiJIUzI1NiIsImtpZCI6InJ1WVhNQWlvdllGT3FkZzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2p3Z3V2d2x0ZGFzZm95ZWNubHJvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI5NGY3YWQ2NC1iYjIzLTRjZGItYjM3MC01ZWJmYzE1Nzc3YmEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU1NTkwMDI0LCJpYXQiOjE3NTU1ODY0MjQsImVtYWlsIjoiYmluZ29saXZlOTEwNEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiYmluZ29saXZlOTEwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI5NGY3YWQ2NC1iYjIzLTRjZGItYjM3MC01ZWJmYzE1Nzc3YmEifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1NTU4NjQyNH1dLCJzZXNzaW9uX2lkIjoiYjQ3ODdlMjMtYmJlMi00NzI1LWIyYzMtMzliNmMyYWYwZGNjIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.HZTRqT6dzDntMxuTYMXHMcPPIDnONqg3HPfN2SAFJCo
*/



// auth controller -- that will accept signup and login request....

import { getAvatarSignedUrlService, getCurrentUserService, googleLoginService, linkSharesForLoggedInUser, loginService, logoutService, signupService, uploadAvatarService } from "../service/authService.js";

// upload avatar controller --
export async function uploadAvatarController(req,res){
    try{
        // getting the file or image from req.file
        const file =req.file;

        // in case if user don't send any file/image -- in this case we need to use fallback -- to generate a profile image with first letter of name just like google does.
        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No avatar file provided",
            });
        }

        // calling service 
        const avatarPath = await uploadAvatarService(file);

        return res.status(200).json({
            success: true,
            message: "Avatar uploaded successfully",
            path: avatarPath,
        });

    }catch(error){
        console.error("Error in uploadAvatarController:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}


// avatar signed url controller

export async function getAvatarSignedUrlController(req,res){
    try{
        // getting user id from auth middleware
        const userId=req.user.id;
        console.log("user id in auth controller for avatar is : ",userId);

        // calling service layer
        const signedUrl = await getAvatarSignedUrlService(userId);
        console.log('signed url for avatar in auth controller is : ',signedUrl);
        
        // returning the response
        return res.status(200).json({
            success:true,
            message:"signed url for user avatar iamge is generated successfully",
            signedUrl
        });

    }catch(error){
        console.error('Error occured in getAvatarSignedUrlController and error is :', error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
}




// signup controller.

export async function signupController (req,res){
    try {
        console.log("req.body is : ", req.body);

        // destructuring req.body to get email and password.
        const {email,password,fullName,avatarUrl}=req.body;
        /** make sure the frontend send the key same as fullName not like FullName or full_name */
        
        // calling the service layer for signup
        const data = await signupService (email,password,fullName,avatarUrl);

        console.log("response of singup service in controller before returning to user is : ",data);


        // Link any shares that were created for this email before the user existed
        await linkSharesForLoggedInUser(data.user.id, data.user.email);

        return res.status(200).json({
            success:true,
            message: "User signedUp successfully",
            response: data
        });
    }catch(error){
        console.log("error occured in the signup controller and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "Internal server error - user failed to signUp"
        });
    }
}

// login controller 

export async function loginController(req,res){
    try{
        const {email,password}=req.body;

        // calling service layer
        const data=await loginService(email,password);

        console.log("repsone of login service in login controller before returning to user is : ",data);


        // Link any shares created for this email before login
        await linkSharesForLoggedInUser(data.user.id, data.user.email);


        return res.status(200).json({
            success:true,
            message:"Congratulasation user logedIn successfully",
            response:data
        });

    }catch(error){
        return res.status(error.status || 500).json({
            success:true,
            message:error.message || "internal server error - user failed to login"
        })
    }
}

// logout controller.

export async function logoutController(req,res){
    try{
        // calling service
        const data = await logoutService();

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
            response: data
        });
    }catch(error){
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error - user failed to logout"
        });
    }
}

// get current user controller..

export async function getCurrentUserController(req,res){
    try {

        // getting token from request object..
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            const err = new Error("Unauthorized: Missing token");
            err.status = 401;
            throw err;
        }

        // calling service 
        const data = await getCurrentUserService(token);

        // sending resposne 
        return res.status(200).json({
            success: true,
            message: "Fetched current user successfully",
            response: data
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Failed to fetch current user"
        });
    }
}

// google login controller 

export async function googleLoginController(req, res) {
    try {
        // callin service.
        const data = await googleLoginService();

        // sending respone
        return res.status(200).json({
            success: true,
            message: "Google login initiated",
            response: data
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Google login failed"
        });
    }
}