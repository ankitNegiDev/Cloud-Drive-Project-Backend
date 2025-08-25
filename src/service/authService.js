// auth service that will handel -- communicating with the supabase for the user signup and login.

import { supabase } from "../config/supabaseClient.js";

// here we need to import supabase from supabaseClient that we setup and this supabase object will have different function that we will use for singup and login.

export async function signupService(email,password,fullName,avatarUrl){
    try{

        // calling supabase internal function for signup.
        const {data:authData,error:authError}=await supabase.auth.signUp({email,password}); 
        console.log("auth data in signup is : ",authData);

        // in case if error occur
        if(authError){
            const err=new Error("sorry there is some issue with supabase.auth.singUp");
            err.status=404;
            err.message=authError.message;
            throw err;
        }

        const user=authData.user;

        // inserting row into profile table.
        const {error:profileError}=await supabase.from("profiles").insert({
            id:user.id,
            full_name:fullName || null, // fallback
            avatar_url:avatarUrl || null
        });

        // if any error occur in while creating the row in profile table.
        if(profileError){
            const err=new Error("failed to create profile in signup service");
            err.message=profileError.message;
            err.status=400;
            throw err;
        }

        // if user is created in supabase and a row in profile table also created successfully then return data.
        /** we can add here if we need more data later like subsribed user or not etc.. */
        return {
            user,
            profile:{
                fullName,
                avatarUrl
            }
        }
    }catch(error){
        console.log("erorr occured in the singup service layer and error is : ",error);
        // throwing error back to controller.
        throw error; 
    }
}


// login service 

export async function loginService(email,password){
    try{
        const {data:authData,error:authError}=await supabase.auth.signInWithPassword({email,password});
        console.log("auth data in login is : ",authData);

        // incase if error occur
        if(authError){
            const err=new Error("Invalid credentials ---- there is some issue with supabase.auth.signInWithPassword");
            err.message=authError.message;
            err.status=401;
            throw err;
        }

        // const user=authData.user; // by doing this we specify that user is having only user related info--  but this user is having user data , session data although wwe send token to frontend but still i want to send whole response to frontend. later we can change during deploy.
        // const user=authData;

        //! but best is to send what frontend needs.
        const user=authData.user;


        // now fetching profile -- since in fronted we need to save this info in the localstorage so that we can show this on home page.
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", authData.user.id)
            .single();
        
        console.log("profile data in login is : ",profileData);
        
        // incase if error occure
        if(profileError){
            const err = new Error("Failed to fetch profile");
            err.message = profileError.message;
            err.status = 404;
            throw err;
        }

        return {
            user,
            profile:profileData,
            accessToken: authData.session.access_token,
        }
    }catch(error){
        console.log("error occured in the login service and error is : ",error);
        
        // throwing error back to controller.
        throw error;
    }
}


// logout service 

export async function logoutService(){
    try{
        // calling supabase 
        const { error } = await supabase.auth.signOut();

        if (error) {
            const err = new Error("Error occurred during logout");
            err.message = error.message;
            err.status = 400;
            throw err;
        }

        // reutrnign a object with mesage just for debugging purpose...
        return { message: "Logged out successfully" };
    }catch(error){
        console.log("error in logout service and error is : ", error);
        throw error;

    }
}

// get current user service

export async function getCurrentUserService(token){
    try{
        // now getting the user info from supabase.
        /**
         * {
                data: {
                    user: { id: "abc123", email: "test@example.com", ... }
                },
                error: null
            }
         */
        // here we are doing nested destructing
        const { data: { user }, error } = await supabase.auth.getUser(token);

        // in case if any error occures
        if (error || !user) {
            const err = new Error("Invalid or expired token");
            err.status = 401;
            throw err;
        }

        // fetching  profile data also for current user.
        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .single();

        // if any eror in fetching profiled ata.
        if (profileError) {
            const err = new Error("Failed to fetch profile");
            err.message = profileError.message;
            err.status = 404;
            throw err;
        }

        // returning the resposne.
        return {
            user,
            profile: profileData
        };
    }catch(error){
        console.log("error in getCurrentUserService: ", error);
        throw error;
    }
    
}

// google login service

export async function googleLoginService() {
    try {
        // calling supabase.
        /**
         * /auth/callback → the page/route you create in React to handle the OAuth response here callback is just symboolising that - once the user is loged in then user will be redirect to home page or any page where we want-- we can name anything like /auth/redirect or etc.
         */
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: "http://localhost:3000/auth/callback"
            }
        });

        // in case any erorr occured in login with google
        if (error) {
            const err = new Error("Failed to initiate Google login");
            err.message = error.message;
            err.status = 400;
            throw err;
        }

        // data.url is the Google OAuth redirect link
        return { url: data.url };
    } catch (error) {
        console.log("error in googleLoginService: ", error);
        throw error;
    }
}