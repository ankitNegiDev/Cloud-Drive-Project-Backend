// share servicde -- 

import { supabase } from "../config/supabaseClient.js";
import { randomBytes } from 'crypto';


// (1) create sharable link - public

// here ownerId is same the userId -- means -- the current user that is loged in is the owner of this file for which he is gneerating the link
export async function createPublicShareService(ownerId,itemId){
    try{
        // now we will create a random link -- after that we will insert it inside the shares table and then sending it back to frontend and later we will show this link in the ui so that user can copy it and share --
        const token = randomBytes(16).toString("hex");
        /**
         * randomBytes(16).toString("hex") comes from Node.js’s built-in crypto module.
            * randomBytes(16) → generates 16 random bytes (cryptographically secure)
                * And each byte = 8 bits.
                * so 16 bytes = 128 bits of randomness.
                * and its almost impossible to guess. 
        
        * .toString("hex") → converts those random bytes into a hexadecimal string.
            * Each byte becomes 2 hex characters.
            * So 16 bytes → 32 hex characters.
        */
        console.log("random bytes are without hexadecimal : ",randomBytes(16)); 


        // inserting this token or link into the shares table
        const { data, error } = await supabase
            .from("shares")
            .insert([{ item_id: itemId, owner_id: ownerId, share_type: "link", token }])
            .select()
            .single();
        
        // in case any error
        if(error){
            const err=new Error("sorry error occured in creating the public sharable link");
            err.message=error.message;
            err.status=error.status || 500;
            throw err;
        }

        // if no error
        return data;

    }catch(error){
        console.log("error occured in createShareLinkService and error is : ",error);

        // throwing error back to controller.
        throw error;
    }
}

// (2) delete public share link
export async function deletePublicShareService(ownerId,itemId){
    try{
        const { error } = await supabase
            .from("shares")
            .delete()
            .eq("item_id", itemId)
            .eq("owner_id", ownerId)
            .eq("share_type", "link");
        
        // in case if error occured...
        if(error){
            const err = new Error("sorry error occured in deleting the public sharable link");
            err.message = error.message;
            err.status = error.status || 500;
            throw err;
        }

        // just for debugging
        return {success:true};
    }catch(error){
        console.log("error occured in deleteShareLinkService and error is : ", error);

        // throwing error back to controller.
        throw error;
    }
}

// (3) accesing item from public link .. means any user with public link can access the item (file/folder)

export async function accessPublicShareService(token){
    try{
        // getting the data from the share table using token
        const { data: share, error } = await supabase
            .from('shares')
            .select('item_id, expires_at')
            .eq('token', token)
            .eq('share_type', 'link')
            .single();
        
        // in case if we got error in fetching the data from the shaare table
        if (error || !share) {
            const err = new Error("Sorry, error occurred accessing item via public share link");
            err.message = error?.message || "Share not found";
            err.status = error?.status || 404;
            throw err;
        }

        // checking link expirary
        if (share.expires_at && new Date(share.expires_at) < new Date()) {
            const err = new Error("Link has expired");
            err.status = 401;
            throw err;
        }

        // now getting the actual item(file/folde) from the item table
        const { data: item, error: itemError } = await supabase
            .from("items")
            .select("*")
            .eq("id", share.item_id)
            .single();
        
        // if we got error in fetching the item from the item table
        if (itemError || !item) {
            const err = new Error("File/folder (item) not found in items table");
            err.status = 404;
            throw err;
        }

        // now creating the signed url -- so that user can directly access the file
        const { data: signedUrlData, error: signedUrlError } = supabase
            .storage
            .from('files') // the supbase private storage name is 'files'
            .createSignedUrl(item.path, 60); // valid only for 60 sec or we can change it later
        
        
        // in case if we got error in generating the signed url
        if (signedUrlError) {
            const err = new Error("Could not generate signed URL for the file");
            err.status = 500;
            throw err;
        }

        // now return the file/folder data as item and signedurl data as signedUrlData
        return {
            item,
            signedUrlData
        }
        
    }catch(error){
        console.log("error occured in accessPublicShareLinkService and error is : ", error);

        // throwing error back to controller.
        throw error;
    }
}