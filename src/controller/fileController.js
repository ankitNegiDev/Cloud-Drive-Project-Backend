// file controller that will handel all requst for a file.

import { deleteFileService, fileUploadService, getFileByIdService, getFilesByParentIdService, renameFileService } from "../service/fileService.js";

// (1) upload file..

export async function uploadFileController(req,res){
    try{
        // getting user id from auth middleware
        let userId=req.user.id;

        // getting file from that multer will attach to request body.
        const file=req.file;

        // now getting the parentId from the req.body because its client responsibility to send parent id which will decide inside which folder this file will be uploded.
        let parentId=req.body.parentId;
        // console.log("typeof parent id is : ",typeof parentId); //! bug was type of parent id is string -when it is root folder means value is "null" not null.
        parentId= parentId==="null" ? null :parentId;

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


// (3) get file by its id.

export async function getFileByIdController(req,res){
    try{
        // getting user id from auth
        const userId=req.user.id;

        // getting current file id from url params
        const fileId = req.params.id; // const {fileId}=req.params -- directly destructure

        // calling service
        const result = await getFileByIdService(userId,fileId);

        return res.status(200).json({
            success:true,
            message:`congrats file is successfully fetched by its id : ${fileId}`,
            data:result
        });
    }catch(error){
        console.log("error occured in the getFileByIdController and error is : ",error);

        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Intrernal server erorr"
        });
    }
}

// (4) re-name file using file id.

export async function renameFileController(req,res){
    try{
        // getting user id from auth middleware
        const userId=req.user.id;

        // getting file id from url params
        const fileId=req.params.id;

        // getting newName from req.body
        const {newName}=req.body;

        // calling service
        const result = await renameFileService (userId,fileId,newName);

        return res.status(200).json({
            success:true,
            message:"congrats file is re-named successfully",
            data:result
        });
    }catch(error){
        console.log("eror occured in renameFileController and erorr is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            mesasge:error.mesasge || "Internal server erorr"
        });
    }
}


// (5) deelteing the file --- 

export async function deleteFileController(req,res){
    try{
        // getting user id from auth
        const userId=req.user.id;

        // getting file id from url parasm
        const fileId = req.params.id; //! check if erorr comes then --- do const {fileId}=req.params - or check what is sent  GET /file?id=123 then we can use id but we are using fileId in frontend while sending the id then here we have to req.parms.fileId

        // calling service 
        const result = await deleteFileService(userId,fileId);

        return res.status(200).json({
            success:true,
            message:"congrats file is successfully moved to trash",
            data:result
        });
    }catch(error){
        console.log("eror occured in deleteFileController and erorr is : ", error);
        return res.status(error.status || 500).json({
            success: false,
            mesasge: error.mesasge || "Internal server erorr"
        });
    }
}