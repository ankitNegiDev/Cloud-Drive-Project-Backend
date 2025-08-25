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

import { loginService, signupService } from "../service/authService.js";

// signup controller.

export async function signupController (req,res){
    try {
        // destructuring req.body to get email and password.
        const {email,password,fullName,avatarUrl}=req.body;
        /** make sure the frontend send the key same as fullName not like FullName or full_name */
        
        // calling the service layer for signup
        const data = await signupService (email,password,fullName,avatarUrl);

        console.log("response of singup service in controller before returning to user is : ",data);
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