// folder service..

import { supabase } from "../config/supabaseClient.js";

// (1) create folder 

export async function createFolderService({name,parentId,userId}){
    try{
        // now adding the folder in the table.
        const { data, error } = await supabase
            .from("items")
            .insert([{
                name,
                type: "folder",
                parent_id: parentId || null,
                user_id: userId
            }])
            .select()
            .single();
        
        // if error then
        if(error){
            const err = new Error("Error occured in adding folder in the items table");
            err.status = 404;
            throw err;
        }

        // if no error then
        return data;
    }catch(error){
        console.log("error occured in the createFolderService and error is : ",error);

        // throwing errorback to controller.
        throw error;
    }
}

// (2) get folders by parent id...

export async function getFoldersService({parentId,userId}){
    try{
        // getting all folder from the table.
        const { data, error } = await supabase
            .from("items")
            .select("*")
            .eq("user_id", userId)
            .eq("type", "folder")
            .eq("parent_id", parentId || null);
        
        // in case if error occur
        if(error){
            const err=new Error("sorry faild to get folders from the table");
            err.status=404;
            throw err;
        }

        // if no error
        return data;

    }catch(error){
        console.log("error occured in getFolderService and error is : ",error);

        // throwing error back to controller.
        throw error;
    }
}

// (3) rename folder service..

export async function renameFolderService({id,newName,userId}){
    try{
        // renaming the folder name in the table.
        const { data, error } = await supabase
            .from("items")
            .update({ name: newName })
            .eq("id", id)
            .eq("user_id", userId)
            .select()
            .single();
        
        // in case if error occure
        if(error){
            const err=new Error("sorry error occured in re-nameing the folder");
            err.status=404;
            throw err;
        }

        // if no error then -- 
        return data;
    }catch(error){
        console.log("error occured in renameFolderService and error is : ",error);

        // throwing error back to controller
        throw error;
    }
}

// (4) delete folder by id 

export async function deleteFolderService({id,userId}){
    try{
        // deleting the folder from the items table
        const { error } = await supabase
            .from("items")
            .update({ is_deleted: true })
            .eq("id", id)
            .eq("user_id", userId);
        
        // if error occured
        if(error){
            const err=new Error("sorry error occured while deleting the folder from table");
            err.status=404;
            throw err;
        }
    }catch(error){
        console.log("error occured in deleteFolderServie and error is : ",error);

        // thrwoing erro back to controller
        throw error;
    }
}