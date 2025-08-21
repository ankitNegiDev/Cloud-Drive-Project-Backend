// share controller --

import { accessPublicShareService, createPublicShareService, deletePublicShareService } from "../service/shareService.js";


// ---- Public share ----

// (1) creating the public share link

export async function createPublicShareController(req,res){
    try{
        // getting user id from - auth middleware
        const ownerId=req.user.id;

        // getting itemId from path params.
        const {itemId}=req.params;

        // calling service -- 
        const result = await createPublicShareService(ownerId,itemId);

        return res.status(200).json({
            success:true,
            message:"congrats public sharable link is generated",
            data:result
        })

    }catch(error){
        console.log("error in createPublicShareController and erorr is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}

// (2) deleting the public share controller.

export async function deletePublicShareController(req,res){
    try{
        // getting user id from auth middleware....
        const ownerId =req.user.id;
        
        // getting item id from path params
        const {itemId}=req.params;

        // calling service..
        await deletePublicShareService(ownerId,itemId);

        return res.status(200).json({
            success:true,
            message:"Public share link is deleted"
        })
    }catch(error){
        console.log("error in deletePublicShareController and erorr is : ", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

// (3) accesing the public share link -- by generating the signed url ---
export async function accessPublicShareController(req,res){
    try{
        // getting the token from the path params
        const {token}=req.params;

        // calling service 
        const item = await accessPublicShareService(token);

        return res.status(200).json({
            success: true,
            message: 'congrats item is successfully accesd by public link',
            data: item
        });

    }catch(error){
        console.log("error in accessPublicShareController and erorr is : ", error);
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}