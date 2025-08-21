// share servicde -- 

import { supabase } from "../config/supabaseClient.js";

// (1) create sharable link - public

// here ownerId is same the userId -- means -- the current user that is loged in is the owner of this file for which he is gneerating the link
export async function createShareLinkService(ownerId,itemId){
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