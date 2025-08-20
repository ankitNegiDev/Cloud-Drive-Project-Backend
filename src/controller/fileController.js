// file controller that will handel all requst for a file.

import { fileUploadService, getFilesByParentIdService } from "../service/fileService.js";

// (1) upload file..

export async function uploadFileController(req,res){
    try{
        // getting user id from auth middleware
        let userId=req.user.id;

        // getting file from that multer will attach to request body.
        const file=req.file;

        // now getting the parentId from the req.body because its client responsibility to send parent id which will decide inside which folder this file will be uploded.
        const parentId=req.body.parentId || null; // a fallback parent id for root

        // calling service
        const result = await fileUploadService (userId,file,parentId);

        // returning the response
        return res.status(200).json({
            success:true,
            message:"Congratulasition file is uploaded successfully",
            data:result
        });
    }catch(error){
        console.log("sorry error occured in the fileController and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}

// (2) get all files inside a parent folder -- id

export async function getFilesByParentIdController(req,res){
    try{
        // getting user id from auth middleware
        const userId=req.user.id;

        // getting parent id from the query params
        const parentId=req.query.parentId || null;

        // calling service --
        const result = await getFilesByParentIdService(userId,parentId);

        return res.status(200).json({
            success:true,
            message:`congrats files are fetched successfully inside folder with parentId : ${parentId}`,
            data:result
        });

    }catch(error){
        console.log("error occuured in getFilesByParentIdController and erorr is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}