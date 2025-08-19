// creating a auth middleware that will help us to protect our routes...

import { supabase } from "../config/supabaseClient.js";

export async function authMiddleware(req,res,next){
    try{
        // the token is expected in header.
        const authHeader = req.headers.authorization;
        console.log("authheader is : ",authHeader);

        // a simple check that a token even exist or not 
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Missing or invalid Authorization header' });
        }

        // getting token 
        const token = authHeader.split(' ')[1];

        // verifying token with supabase 
        const {data ,error}=await supabase.auth.getUser(token);

        // getting user from data
        const {user}=data;

        // a simple check that user exist or not or did we get error
        if(error || !user){
            return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid or expired token' 
                });
        }

        // attaching user info to incoming request.
        req.user=user; 

        /*
        req.user = {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
        }; 
        */

        // calling next middleware or controller function
        next();
    }catch(error){
        console.log("Error occured in Auth middleware");
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error in Auth middleware"
        });
    }
}