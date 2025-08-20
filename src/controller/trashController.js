// trash controller..

import { getTrashedItemsService } from "../service/trashService.js";

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
