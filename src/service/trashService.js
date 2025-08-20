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

// (2)  restore item service 

export async function restoreItemService(userId, id){
    try{
        const { data, error } = await supabase
            .from("items")
            .update({ is_deleted: false })
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();

        // if error occured
        if (error) {
            const err = new Error("eror occured in restoring the file/folder using id");
            err.status = error.status || 500;
            throw err;
        }

        // if not then return 
        return data;
    }catch(error){
        console.log("error occured in restoreItemService and erorr is : ", error);

        // throwing erorr back to controller.
        throw error;
    }
}

// (3)  permanently delete item
export async function permanentlyDeleteItemService(userId, id){
    try{
        const { error } = await supabase
            .from("items")
            .delete()
            .eq("id", id)
            .eq("user_id", userId);
        
        // if error occured.
        if (error) {
            const err = new Error("eror occured in dleting the file/folder from table permanently");
            err.status = error.status || 500;
            throw err;
        }

        // returning response just for debugging
        return {success:true};
    }catch(error){
        console.log("error occured in permanentlyDeltedItemService and erorr is : ", error);

        // throwing erorr back to controller.
        throw error;
    }
}