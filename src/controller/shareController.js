// share controller --

import { createShareLinkService } from "../service/shareService.js";

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
