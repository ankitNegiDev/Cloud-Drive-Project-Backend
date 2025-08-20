// trash service ---

import { supabase } from "../config/supabaseClient.js";

// (1) get all trashed items

export async function getTrashedItemsService(userId){
    try{
        const { data, error } = await supabase
            .from("items")
            .select("*")
            .eq("user_id", userId)
            .eq("is_deleted", true);
        
        // if error occured
        if(error){
            const err=new Error("eror occured in getting all items in trash for current user");
            err.status=error.status || 500;
            throw err;
        }

        // if not then return 
        return data;
    }catch(error){
        console.log("error occured in getTrashedItemsService and erorr is : ",error);

        // throwing erorr back to controller.
        throw error;
    }
}