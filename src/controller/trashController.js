// trash controller..

import { getTrashedItemsService, permanentlyDeleteItemService, restoreItemService } from "../service/trashService.js";

// (1) get all trashed items of current user

export async function getTrashedItemsController(req,res){
    try{
        // getting user id from auth 
        const userId=req.user.id;

        // calling service
        const items = await getTrashedItemsService(userId);

        return res.status(200).json({
            success:true,
            message:"congrats all files and folder in trash are fetched successfully for current user",
            data:items
        });
    }catch(error){
        console.log("error occured in getTrashedItemsController and eror is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}


// (2) restore an item from trash

export async function restoreItemController(req,res){
    try{
        // getting user id from auth
        const userId=req.user.id;

        // getting id from url params
        const { id } = req.params;

        // calling service
        const restored = await restoreItemService(userId, id);
        return res.status(200).json({
            success: true,
            message: "congrats the file/folder is restored successfully",
            data: restored
        });
    }catch(error){
        console.log("erorr occured in restoreItemController and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}

// (3) permanently delete item

export async function permanentlyDeleteItemController(req,res){
    try{
        // getting user id from auth
        const userId=req.user.id;

        // getting id from url prams
        const {id}=req.params;

        // calling service 
        await permanentlyDeleteItemService(userId, id);
        return res.status(200).json({
            success:true,
            message:"Item permanently delted"
        });
    }catch(error){
        console.log("erorr occured in permanentlyDeletedItemController and erorr is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}