// item controller

import { getItemByIdService, getItemsByParentIdService } from "../service/itemService.js";

// (1) get item by parent id which is passed by query params..

export async function getItemsByParentIdController(req,res){
    try{
        // getting the parentId from the query params
        const parentId = req.query.parentId; // or {parentId}=req.query  --- GET /items?parentId=123

        // getting userId from auth middleware
        const userId=req.user.id;

        // calling service
        const items = await getItemsByParentIdService(parentId,userId);

        return res.status(200).json({
            success:true,
            message:`congrats all file and folder are fetched successfully inside folder that have parent id : ${parentId}`,
            data:items
        });
    }catch(error){
        console.log("error occured in getItemsByParentIdController and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server erorr"
        });
    }
}


// (2) get single item by id -- either it is file or folder

export async function getItemByIdController(req,res){
    try{
        // getting id from url params
        const {id}=req.params;

        // getting userId from auth
        const userId=req.user.id;

        // calling service
        const item = await getItemByIdService(id, userId);

        return res.status(200).json({
            success: true,
            message: `congrats file/folder with id : ${id} is fetched successfully`,
            data: item
        });
    }catch(error){
        console.log("error occured in getItemByIdController and error is : ", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server erorr"
        });
    }
}