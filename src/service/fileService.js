// file service -- that will handel all the logic and communication with supabase storage and client.

import { supabase } from "../config/supabaseClient.js";

/**
400 Bad Request → file is missing, invalid parentId, or something wrong with request.

401 Unauthorized → user not logged in / invalid token.

403 Forbidden → user is logged in but not allowed (e.g. trying to upload into another user’s folder).

404 Not Found → parent folder doesn’t exist.

413 Payload Too Large → file size exceeds allowed limit.

500 Internal Server Error → generic Supabase/storage failure.
 */
// (1) upload file

export async function fileUploadService(userId,file,parentId){
    try{
        // uploading file to supabase storage.
        // awat supabase.storage.from("name of bucket").upload(path,file.buffer,options); 
        const { data: storageData, error: uploadError } = await supabase.storage
            .from("files") // bucket name
            .upload(`${userId}/${Date.now()}_${file.originalname}`, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
        
        // if we want to get path inside the bucket we can use storageData.path
        console.log("file path inside the storage bucket is : ",storageData.path);

        // incase if any error occured during upload...
        if(uploadError){
            const error=new Error("error occured in uploading the file to supabase storage");
            error.status=500; // since its the storage issue
            throw error;
        }

        // saving file data to the db
        const { data, error: dbError } = await supabase
            .from("items")
            .insert([
                {
                    name: file.originalname,
                    type: "file",
                    parent_id: parentId,
                    user_id: userId,
                    path: storageData.path,
                    size: file.size,
                    mime_type: file.mimetype,
                },
            ])
            .select()
            .single();
        
        // if there is error in the saving data to db..
        if(dbError){
            const error = new Error("error occured in saving the file data to db in supabase");
            error.status = 500; // since its the supabase db issue
            throw error;
        }

        // if storage and saving info to db is working fine then return
        return data;

    }catch(error){
        console.log("error occured in uploadFileService and error is : ",error);

        // throwing error back to controller..
        throw error;
    }
}

// (2) get files by parent folder id

export async function getFilesByParentIdService(userId, parentId){
    try{
        // getting file from item table
        const { data, error } = await supabase
            .from("items")
            .select("*")
            .eq("user_id", userId)
            .eq("parent_id", parentId)
            .eq("is_deleted", false)
            .eq("type", "file");
        
        // in case if error occured
        if(error){
            const err=new Error("Sorry error occured in getting file from the table");
            err.status=error.status;
            throw err;
        }

        // if no error then return the data
        return data;

    }catch(error){
        console.log("error occured in the getFilesByParentIdService and error is : ",error);

        // throwing error back to controller.
        throw error;
    }
}