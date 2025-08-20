// item service..

import { supabase } from "../config/supabaseClient.js";

// (1) get all files and folder using parent id -- parent id is passed as query params

export async function getItemsByParentIdService(parentId, userId){
    try{
        // calling supabase --- items table 
        const query = supabase
            .from("items")
            .select("*")
            .eq("user_id", userId)
            .eq("is_deleted", false);

        if (parentId) {
            query.eq("parent_id", parentId);
        } else {
            query.is("parent_id", null); // root folder
        }

        const { data, error } = await query;

        // if eror occured
        if(error){
            const err=new Error("Sorry error occured while fetching all files and folder from items table using parentId");
            err.status=500 || error.status;
            throw error;
        }

        // else 
        return data;
    }catch(error){
        console.log("erorr occured in getItemsByParentIdService and erorr is : ",error);

        // throwing eror back to controller
        throw error;
    }
}

// (2) Fetch single item by id

export async function getItemByIdService(id,userId){
    try{
        // calling supabase -- items table
        const { data, error } = await supabase
            .from("items")
            .select("*")
            .eq("id", id)
            .eq("user_id", userId)
            .eq("is_deleted", false)
            .single();
        
        // if eror occured
        if (error) {
            const err = new Error("Sorry error occured while fetching file/folder from items table using id");
            err.status = 500 || error.status;
            throw error;
        }

        // if not then return 
        return data;
    }catch(error){
        console.log("erorr occured in getItemByIdService and erorr is : ", error);

        // throwing eror back to controller
        throw error;
    }
}