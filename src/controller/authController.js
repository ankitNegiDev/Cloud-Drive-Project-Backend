// auth controller -- that will accept signup and login request....

import { signupService } from "../service/authService.js";

// signup controller.

export async function signupController (req,res){
    try {
        // destructuring req.body to get email and password.
        const {email,password}=req.body;
        
        // calling the service layer for signup
        const data = await signupService (email,password);
        return res.status(200).json({
            success:true,
            message: "User signedUp successfully",
            response: data
        });
    }catch(error){
        console.log("error occured in the signup controller and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message: error.message || "User failed to do signUp"
        });
    }
}