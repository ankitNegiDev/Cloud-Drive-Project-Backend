// folder controller...

import { createFolderService, deleteFolderService, getFolderByIdService, getFoldersByParentIdService, renameFolderService } from "../service/folderService.js";

// (1) create new folder

export async function createFolderController(req,res){
    try{
        // destructuring the request body.
        const {name,parentId}=req.body;

        // getting user id from auth middleware which attach userid to incoming request
        const userId=req.user.id;

        // calling service layer.
        const folder = await createFolderService({name,parentId,userId});

        return res.status(200).json({
            success:true,
            message:"folder created successfully",
            folder
        });
    }catch(error){
        console.log("error occured in the createFolderController and error is : ",error);
        res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error"
        });
    }
}

// (2) get folder using parent id.

export async function getFoldersByParentIdController(req,res){
    try{
        // getting the parent id from url params
        const { parentId } = req.query;

        // usr id that auth middleware attaches
        const userId=req.user.id

        // calling service
        const folders = await getFoldersByParentIdService({parentId,userId});

        return res.status(200).json({
            success:true,
            message:"successfully fetched the folders",
            folders
        });
    }catch(error){
        console.log("error occured in getFoldersController and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error -- faild to fetch folders"
        });
    }
}

// (2a) get folder by its id

export async function getFolderByIdController(req,res){
    try{
        // getting the folder id from the url params
        const {folderId}=req.params;

        // getting user id from auth middleware
        const userId=req.user.id;

        // calling service
        const folderDetails = await getFolderByIdService(userId,folderId);

        // in case if no folder found
        if(!folderDetails){
            return res.status(404).json({
                success:false,
                message:"Folder not found"
            });
        }

        // if folder found then
        return res.status(200).json({
            success:true,
            message:"congrats folder found and below are its details",
            data:folderDetails
        })
    }catch(error){

        console.log("error occured in the getFolderByIdController and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server deatials"
        });
    }
}


// (3) rename folder 

export async function renameFolderController(req,res){
    try{
        // getting the id
        const { id } = req.params;
        console.log("id in the rename from the url params is : ",id);

        // destructuring req.body
        const {newName}=req.body;
        console.log("new name is : ",newName);

        // getting user id that is attached by auth middleware
        const userId=req.user.id;

        // calling service layer
        const folder=await renameFolderService({id,newName,userId});

        return res.status(200).json({
            success:true,
            message:"congrats folder is re-named successfully",
            folder,
        });

    }catch(error){
        console.log("error occured in renameFolderController and error is : ",error);

        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error - folder is not re-named"
        })
    }
}

// (4) delete folder using id -- means only loged in user can delete its own folder...

export async function deleteFolderController(req,res){
    try{
        // getting id from url params
        const {id}=req.params;

        // user id -- attached by auth middleware
        const userId=req.user.id;

        // calling service 
        await deleteFolderService({id,userId});

        return res.status(200).json({
            success:true,
            message:"congrats folder is deleted successfully"
        });
    }catch(error){
        console.log("erorr occured in deleteFolderController and error is : ",error);
        return res.status(error.status || 500).json({
            success:false,
            message:error.message || "Internal server error -- failed to delete folder"
        });
    }
}