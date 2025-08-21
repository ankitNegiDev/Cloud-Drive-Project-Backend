// share controller --

import { accessShareLinkService, createShareLinkService, deleteShareLinkService } from "../service/shareService.js";

// (1) create public link ---

export async function createShareLinkController(req,res){
    try{
        // getting userId from auth middleware
        const userId=req.user.id;

        // getting itemId from url params
        const {itemId}=req.params;

        // calling service
        const result=await createShareLinkService(userId,itemId);

        return res.status(200).json({
            success:true,
            message:"congrats public sharable link is gnerated",
            data:result
        });
    }catch(error){
        console.log("error occured in createShareLinkController and error is : ",error);

        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}

// (2) delete share link ---

export async function deleteShareLinkController(req,res){
    try{
        // getting user id from auth middleware
        const userId=req.user.id;

        // getting item id from path params
        const {itemId}=req.params;

        // calling service
        await deleteShareLinkService(userId,itemId);

        return res.status(200).json({
            success: true,
            message: "congrats public sharable link is deleted"
        });
    }catch(error){
        console.log("error occured in deleteShareLinkController and error is : ", error);

        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

// (3) accessing public link... means accessing the file/folder on that link

export async function accessShareLinkController(req,res){
    try{
        // getting token form the path params.
        const {token}=req.params;

        // calling service
        const item=await accessShareLinkService(token);

        return res.status(200).json({
            success: true,
            message: "congrats public sharable link is accessed successfully",
            data: item
        });
    }catch(error){
        console.log("error occured in accessShareLinkController and error is : ", error);

        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}