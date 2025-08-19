// user controller will accept all request that start with /api/user/profile --

import { getUserProfileService } from "../service/userService.js";


// (1) get user profile.

export async function getUserProfileController(req,res){
    try{
        // getting user id from req.user that is set by auth middleware
        const userId=req.user.id;
        console.log("userId in userProfileController is : ",userId);

        // calling service to get user profile by passing id.
        const userProfile=await getUserProfileService(userId);
        return res.status(200).json({
            success:true,
            message:"User profile fetched successfully",
            response: userProfile
        });
    }catch(error){
        console.log("error occured in userProfileController and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}