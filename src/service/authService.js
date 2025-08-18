// auth service that will handel -- communicating with the supabase for the user signup and login.

import { supabase } from "../config/supabaseClient.js";

// here we need to import supabase from supabaseClient that we setup and this supabase object will have different function that we will use for singup and login.

export async function signupService(email,password){
    try{
        // calling supabase internal function for signup.
        const {data,error}=await supabase.auth.signUp({email,password}); 

        // in case if error occur
        if(error){
            const err=new Error("sorry there is some issue with supabase.auth.singUp");
            err.status=404;
            err.message=error.message;
            throw err;
        }

        // if no error then 
        return data;
    }catch(error){
        console.log("erorr occured in the singup service layer and error is : ",error);
        // throwing error back to controller.
        throw error; 
    }
}


// login service 

export async function loginService(email,password){
    try{
        const {data,error}=await supabase.auth.signInWithPassword({email,password});

        // incase if error occur
        if(error){
            const err=new Error("sorry there is some issue with supabase.auth.signInWithPassword");
            err.message=error.message;
            err.status=404;
            throw err;
        }

        // if no error then
        return data;
    }catch(error){
        console.log("error occured in the login service and error is : ",error);
        
        // throwing error back to controller.
        throw error;
    }
}