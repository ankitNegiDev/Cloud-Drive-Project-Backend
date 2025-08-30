// user service --

import { supabase } from "../config/supabaseClient.js";

// (1) getUserProfileService 

export async function getUserProfileService(userId){
    try{
        // calling supabase getUserById function to get user info
        const {data:authData,error:authError}=await supabase.auth.admin.getUserById(userId);
        console.log("data we got from supabase using getUserById in service is : ", authData);

        
        // in case if error occured
        if(authError){
            const err=new Error("Sorry error occured in getting user from supabase using getUserById");
            err.message=authError.message,
            err.status=404;
            throw err;
        }

        // getting profile from profiles table
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", userId)
            // .single();
            .maybeSingle();

        // if there is error in fetching profile 
        if (profileError) {
            const err = new Error("Error getting profile from profiles table");
            err.message = profileError.message;
            err.status = 404;
            throw err;
        }


        // if no error
        const user=authData.user;
        return {
            user,
            profile:profileData
        }
    }catch(error){
        console.log("error occured in getUserProfileService and error is : ",error);

        // throwing error back to controller.
        throw error; 
    }
}

// (2) update userProfile service

export async function updateUserProfileService(userId,{fullName,avatarUrl}){
    try{
        // update only provided feilds
        const updates={};

        // the error that userId is valid or not that will be done by auth middleware that only loged in user is able to do changes.
        if(fullName){
            updates.full_name=fullName;
        }
        if(avatarUrl){
            updates.avatar_url=avatarUrl;
        }

        // now querying the supabase database for update
        const { data, error } = await supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId)
            .select()
            .single();
        
        // if error occur in updating..
        if (error) {
            const err = new Error("Error updating profile");
            err.message = error.message;
            err.status = 400;
            throw err;
        }

        // else return respone.
        return data;

    }catch(error){
        console.log("error in updateUserProfileService:", error);
        
        // throwing error back to controller
        throw error;
    }
}

// (3) delete user profile service ..

export async function deleteUserProfileService(userId){
    try{
        // first we will delte the user profile from profiles table.
        const { error: profileError } = await supabase
            .from("profiles")
            .delete()
            .eq("id", userId);
        
        // in case if any error occur during deleting the profile
        if (profileError) {
            const err = new Error("Error deleting profile");
            err.message = profileError.message;
            err.status = 400;
            throw err;
        }

        // now we will delte the user from auth.users
        const {error:authError}=await supabase.auth.admin.deleteUser(userId);

        // in case if any error occur
        if (authError) {
            const err = new Error("Error deleting user from auth");
            err.message = authError.message;
            err.status = 400;
            throw err;
        }

        // else rturn response
        return {success:true}; // just for debugging. if needed
    }catch(error){
        console.log("error occured in the delteUserProfile service and error is : ",error);

        // throwing error back to controller
        throw error;
    }
}