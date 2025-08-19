// user controller will accept all request that start with /api/user/profile --

import { deleteUserProfileService, getUserProfileService, updateUserProfileService } from "../service/userService.js";


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

// (2) update user profile

export async function updateUserProfileController(req,res){
    try{
        // added by auth middleware
        const userId=req.user.id; 
        
        // destructuring fullname and avatar url from req.body
        const {fullName,avatarUrl}=req.body;

        // calling service layer to actually update the user profile.
        /*
        we can do like this and then pass this object in the service layer or we can directly pass the object..
        let updateFeilds={
            fullName,
            avatarUrl
        }
        */
        const updatedProfile = await updateUserProfileService(userId,{fullName,avatarUrl});
        
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            response:updatedProfile
        });


    }catch(error){
        console.log("error occured in the updateUserProfileController and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}

// (3) delete userProfile

export async function deleteUserProfileController(req,res){
    try{
        // getting the user id from that auth added.
        const userId=req.user.id;
        
        // calling service layer for performing delete account since if user want to deelte profile we need to delete user also.
        const response = await deleteUserProfileService(userId);
        console.log("response after deleting the user account and profile is : ",response);

        if(response){
            return res.status(200).json({
                success: true,
                message: "User account and profile deleted successfully"
            });
        }

    }catch(error){
        console.log("error in deleteUserProfileController:", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
}