// share servicde -- 


import { supabase } from "../config/supabaseClient.js";
import { randomBytes } from 'crypto';


// getting the share info of a item
export async function getShareInfoByItemIdService(ownerId, itemId) {
    try {
        // fetch all shares for the item
        const { data, error } = await supabase
            .from("shares")
            .select("id, item_id, owner_id, share_type, shared_with, shared_email, token, role, expires_at, created_at")
            .eq("item_id", itemId)
            .eq("owner_id", ownerId);

        if (error) {
            const err = new Error(error.message || "Error fetching share info");
            err.status = error.status || 500;
            throw err;
        }

        console.log("data for share info in service is : ",data);

        return data;
    } catch (error) {
        console.error("Error in getShareInfoByItemIdService:", error);
        throw error;
    }
} 


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
        const { data: signedUrlData, error: signedUrlError } = await supabase
            .storage
            .from('files') // the supbase private storage name is 'files'
            .createSignedUrl(item.path, 60*60); // valid only for 1 hrs or we can change it later
        
        
        // in case if we got error in generating the signed url
        if (signedUrlError) {
            const err = new Error("Could not generate signed URL for the file");
            err.status = 500;
            throw err;
        }

        console.log("sigened url data is  : ",signedUrlData);

        // now return the file/folder data as item and signedurl data as signedUrlData
        // return {
        //     item,
        //     signedUrlData
        // }

        return {
            item,
            signedUrl: signedUrlData.signedUrl,
            expiresIn: "1 hour"
        };
        
    }catch(error){
        console.log("error occured in accessPublicShareLinkService and error is : ", error);

        // throwing error back to controller.
        throw error;
    }
}


// ===========================================================

//* Restricted Sharing --- service


// (1) creating restricted sahre..

export async function createRestrictedShareService(ownerId, itemId, email, role, expiresAt){
    try{

        // first we need to check if user exist with this email or not ..
        const { data: user, error: userError } = await supabase
            .from("auth.users")
            .select("id")
            .eq("email", email)
            .single();
        

        let sharedWithId = null;
        let sharedEmail = null;

        if (user) {
            sharedWithId = user.id; // if user exists then store userId
        } else {
            sharedEmail = email; // if user does not exist yet in user table in supabase then store email
        }

        // now inserting the data in the shares table
        const { data, error } = await supabase
            .from("shares")
            .insert([{
                item_id: itemId,
                owner_id: ownerId,
                share_type: "restricted",
                shared_with: sharedWithId,
                shared_email: sharedEmail,
                role,
                expires_at: expiresAt || null
            }])
            .select()
            .single();

        if (error){
            const err=new Error("error in inserting data in the share table");
            err.status=error.status;
            throw err;
        }
        return data;

    }catch(error){
        console.log("Error in createRestrictedShareService and erorr is : ", error);

        // throwing eror back to controller.
        throw error;
    }
}


// (2) Delete restricted share

export async function deleteRestrictedShareService(ownerId,itemId){
    try{
        const { error } = await supabase
            .from("shares")
            .delete()
            .eq("owner_id", ownerId)
            .eq("item_id", itemId)
            .eq("share_type", "restricted");
        
        if (error) {
            const err = new Error("error in deleting the share data from the share table");
            err.status = error.status;
            throw err;
        }

        // just for debugging

        return {success:true};
    }catch(error){
        console.log("Error in deleteRestrictedShareService and eror is : ", error);
        throw error;
    }
}


// (3) access share 
/*
export async function accessRestrictedShareService(userId,shareId){
    try{
        // getting the data fro mthe share table using sahre id.
        const { data: share, error: shareError } = await supabase
            .from("shares")
            .select("id, item_id, shared_with, shared_email, role, expires_at")
            .eq("id", shareId)
            .eq("share_type", "restricted")
            .single();
        
        // in case if e got error 
        if(shareError || !share){
            const err=new Error("sorry we got error in getting the data from share table using shareId");
            err.status=shareError.status;
            throw err;
        }

        // Checking expirary
        if (share.expires_at && new Date(share.expires_at) < new Date()) {
            const err = new Error("Share has expired");
            err.status = 401;
            throw err;
        }

        // Checking  permission
        if (share.shared_with !== userId) {
            const err = new Error("You do not have access to this item");
            err.status = 403;
            throw err;
        }


        // Fetching  actual item data from the items table
        const { data: item, error: itemError } = await supabase
            .from("items")
            .select("*")
            .eq("id", share.item_id)
            .single();
        
        // in case if we got error in getting the single itme from the items table using item id
        if(itemError || !item){
            const err=new Error("sorry we got error in fetching the item from the items table");
            err.status=itemError.status;
            throw err;
        }

        // now generating the signed url since our supabase storage is private.
        let signedUrl = null;
        console.log("Item path:", item.path);
        console.log("Item type:", item.type);
        if (item.type === "file") {
            const { data: signedData, error: signedError } = await supabase
                .storage
                .from("files")
                .createSignedUrl(item.path, 60*60); // for 1 hr

            if (signedError) throw new Error("Could not generate signed URL");
            signedUrl = signedData.signedUrl;
        }

        // now returning the data
        return { item, signedUrl, role: share.role };
    }catch(error){
        console.log("Error in accessRestrictedShareService and erorr is : ", error);
        throw error;
    }
}
*/


// (3) Access a restricted share 
export async function accessRestrictedShareService(userId, shareId) {
    try {
        // Fetch the share info
        const { data: share, error: shareError } = await supabase
            .from("shares")
            .select("id, item_id, shared_with, shared_email, role, expires_at")
            .eq("id", shareId)
            .eq("share_type", "restricted")
            .single();

        if (shareError || !share) {
            const err = new Error("Error fetching share data");
            err.status = shareError?.status || 500;
            throw err;
        }

        // Check expiry
        if (share.expires_at && new Date(share.expires_at) < new Date()) {
            const err = new Error("Share has expired");
            err.status = 401;
            throw err;
        }

        // Check permission
        if (share.shared_with !== userId) {
            const err = new Error("You do not have access to this item");
            err.status = 403;
            throw err;
        }

        // Fetch item info
        const { data: item, error: itemError } = await supabase
            .from("items")
            .select("*")
            .eq("id", share.item_id)
            .single();

        if (itemError || !item) {
            const err = new Error("Error fetching item data");
            err.status = itemError?.status || 500;
            throw err;
        }

        let signedUrl = null;
        console.log("item is : ",item);

        if (item.type === "file") {
            // Encode the path to handle spaces or special characters
            const encodedPath = encodeURI(item.path);
            console.log("encoded path is : ",encodedPath);

            const { data: signedData, error: signedError } = await supabase
                .storage
                .from("files")
                .createSignedUrl(encodedPath, 60 * 60); // 1 hour

            if (signedError || !signedData?.signedUrl) {
                throw new Error("Could not generate signed URL");
            }
            console.log("signed data is : ",signedData);

            signedUrl = signedData.signedUrl;
        }

        return { item, signedUrl, role: share.role };
    } catch (error) {
        console.log("Error in accessRestrictedShareService:", error);
        throw error;
    }
}



// (4) List of items shared with me

/*
export async function sharedWithMeService(userId){
    try{
        const { data, error } = await supabase
            .from("shares")
            .select("id, item_id, owner_id, role, expires_at")
            .eq("shared_with", userId)
            .eq("share_type", "restricted");
        
        if (error) throw error;
        return data;

    }catch(error){
        console.log("Error in sharedWithMeService and error is : ", error);
        throw error;
    }
}
*/

// updated the shareWithMe searvice

export async function sharedWithMeService(userId) {
    try {
        //  Getting all shares restricted to this current user ---- this will return all files that are shared with the current user --- (userId which is coming from auth middleware --> which is nothing but the loged in user)
        const shareResult = await supabase
            .from("shares")
            .select(`
                id,
                item_id,
                owner_id,
                role,
                expires_at,
                shared_with,
                items (
                    id,
                    name,
                    type,
                    size,
                    mime_type
                )
            `)
            .eq("share_type", "restricted")
            .eq("shared_with", userId);

        if (shareResult.error) {
            throw shareResult.error;
        }

        const shares = shareResult.data;

        // here we are running a map(loop) on shares object which contain all the user that share files with this current user -- and we are returning their owner id
        const ownerIds = shares.map(function (share) {
            return share.owner_id;
        });

        // now once we get owner id then -- we need only unique owner id -- it might be possible that same user A shared 3 files with B user so in that case we will have 3 owner id but since we know onwer id is same so we can skip rest 2..
        const uniqueOwnerIds = Array.from(new Set(ownerIds));

        // Now based on these unique owner id -- we are  getting the id,full name from the profiles table.
        const profileResult = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", uniqueOwnerIds);

        if (profileResult.error) {
            throw profileResult.error;
        }

        const profiles = profileResult.data;

        // Formating  the data for frontend so that it won't conflict with normal data that is sent when we are showing file/folder on the dashboard for like files/folder inside a folder
        const formattedData = shares.map(function (share) {
            const ownerProfile = profiles.find(function (profile) {
                return profile.id === share.owner_id;
            });

            return {
                id: share.id,               // share row id
                name: share.items.name,
                type: share.items.type,
                size: share.items.size,
                mime_type: share.items.mime_type,
                owner: ownerProfile ? ownerProfile.full_name : "Unknown",
                role: share.role,
                expires_at: share.expires_at,
                signedUrl: share.items.signedUrl || null // can populate later
            };
        });

        return formattedData;

    } catch (error) {
        console.log("Error in sharedWithMeService:", error);
        throw error;
    }
}
