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
            .single();

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