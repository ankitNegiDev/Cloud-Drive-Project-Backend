# Project thinking for cloud drive project

* in this project we are using supabase in backend but i am trying to write my custom backend as a wrapper over supabase sdk
* and the articheture that i am following is this..

    ```text
    Client (React) 
    ↓ (HTTP request)
    Express Route → Controller → Service → Supabase (SDK/queries = Repository) → DB/Storage
    ```

* or we can say our service layer will directly communicate with `Supabase (Postgres DB + Storage + Auth inside Supabase)`

* ## A basic overview of how the setup will work

* the client will send request which is then accepted by our server (routes specific) and then route will send the request to controller (here data parsing will be done) then controller will send request to service where actual business logic will be implemented and then service layer will communicate with supabase for db , storage , and auth.

* ### Routes layer

  * the routes layer will look like this....

    ```js
    import express from "express";
    import { signup } from "../controllers/authController.js"; // importing from controller layer

    const router = express.Router();
    router.post("/signup", signup);

    export default router;
    ```

* ### Controller layer

  * the controller layer will look like this ...

    ```js
    import { signupService } from "../services/authService.js"; // importing from service layer

    export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await signupService(email, password); // calling service layer
        res.json({ success: true, data }); // sending response (valid)
    } catch (err) {
        res.status(400).json({ error: err.message }); // sending response (error)
    } 
    };
    ```

* ### Service layer

  * the service layer will look like this ....

    ```js
    import supabase from "../config/supabaseClient.js"; // importing supabase ..

    export async function signupService(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password }); // calling supabase for auth
    if (error) throw new Error(error.message);
    return data;
    }

    ```

* Although we are using Supabase for Auth/Storage/DB, but I wrapped it with a custom backend architecture so that i could show my understanding of backend development (routes, controllers, services) etc.

---

## Starting with setting up supabase

* now we are going to setup the supabase.
* headover to this link [supabase official](https://supabase.com/)

* ### Step 1 Create a Supabase Project

  * Choose organization & project name and Supabase will automatically create a Postgres DB + Auth + Storage for us.

* ### Step 2 Get your API keys

  * In our Supabase dashboard → go to Project Settings → API Keys.
  * Now we will see two important keys:
    * `anon key` → for client-side usage (public).
    * `service_role key` → for backend only (has full access Never ever exposed it put it in .env).
    * ![screenshot attached](./supabase%20project%20setup.png)
  * now store these keys in the .env file like this --

    ```env
    SUPABASE_URL=https://your-project.supabase.co // copy it from the url bar.
    SUPABASE_ANON_KEY=your-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    ```

  * but if we want cleaner way then we can generate our own custom publishable key and secret key..
  * ![attached screenshot](./supabase%20new%20keys%20setup.png)

    | Legacy (old) key        | New (recommended) key | Use case                                                                                |
    | ----------------------- | --------------------- | --------------------------------------------------------------------------------------- |
    | `anon` (public)         | **Publishable key**   | Safe to expose in frontend (React, browser). Works with RLS.                            |
    | `service_role` (secret) | **Secret key**        | Full access. Use only in backend (Express, server functions). Never expose in frontend. |

  * and use it like in your .env file like this ---

    ```env
    # SUPABASE_URL=https://<your-project-ref>.supabase.co // search for project id in setting and then click general u will get it there project id.
    # SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxx
    # SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxx
    ```

* ### Step 3 Install Supabase SDK in backend

  * to install sdk of supabase use this command

    ```sh
    npm install @supabase/supabase-js

    ```

* ### Step 4 Setup supabase client

  * now we need to setup the supabase client so that we can connect with the supabase and by providing the url and secret key the sdk of supabase will connect to that project where it is.

    ```js
    import { createClient } from "@supabase/supabase-js";
    // importing dotenv
    import dotenv from 'dotenv';

    // loading all environment variables .
    dotenv.config();

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables in .env");
    }

    export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    ```

  * createClient is a function that is provided by the supabase sdk.And When we call it then it creates a Supabase client instance that knows:
    * Where our project is present (SUPABASE_URL = our project's API endpoint).
    * And how to authenticate (SUPABASE_SERVICE_ROLE_KEY or anon key).
  * After this we can use this client (supabase) to talk to our Supabase project (DB, Auth, Storage, Realtime, Functions) without writing any raw SQL or HTTP fetch requests.

  * #### what does this line do -- `export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);`

    ```js
    export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    ```

  * `supabaseUrl` → It tells the SDK which Supabase project to connect.

  * `supabaseServiceRoleKey` → It acts like the “password” (secret key) so that our backend can access protected operations.

  * `supabase` → this is now an object with methods like:
    * supabase.auth.signUp() → for user signup
    * supabase.from("files").insert() → for inserting data into a DB table
    * supabase.storage.from("bucket").upload() → for uploading a file etc.

---

## Testing supabase connection and basic server connection

* this is the code to test basic server setup and supabase setup.

    ```js

    // now creating a basic express server setup 

    import express, { response } from 'express';
    import cors from 'cors';
    import { PORT } from './config/serverConfig.js';
    import { supabase } from './config/supabaseClient.js';
    const app=express();

    // using cors
    app.use(cors({
        origin:["links"],
        Credentials: true
    }));

    // inbuilt middleware
    app.use(express.json()); // parse json data
    app.use(express.text()); // parse plane text or incoming plane text payload
    app.use(express.urlencoded({extended:true})); // parse form submission

    app.listen(PORT,function callback(){
        console.log("server is listening on port : ",PORT);
    })

    // a dummy route or test route
    app.get('/ping',function callback(req,res){
        console.log("request ping to server sucessfully");
        return res.send("<h1>request is pingeed to server sucessfully<h1>");
    })

    // test route to check supabase is working or not ...

    app.get('/test', async function callback(req,res){
        try{
            const { data, error } = await supabase.auth.admin.listUsers({ limit: 1 });
            if (error) {
                return res.status(500).json({ success: false, message: "Supabase error", error });
            }
            res.status(200).json({
                success: true, 
                message: "Supabase connected", 
                response : data  
            })
        }catch(error){
            res.status(500).json({ success: false, message: error.message });
        }
    })
    ```

* response when api hit - `http://localhost:300/test`

    ```json
    {
    "success": true,
    "message": "Supabase connected",
    "response": {
        "users": [],
        "aud": "authenticated",
        "nextPage": null,
        "lastPage": 0,
        "total": 0
    }
    }
    ```

* repsonse when api hit -- `http://localhost:3000/ping`

    ```text
    request is pingeed to server sucessfully
    ```

---

* next -- do define api routes -- for auth , user , file ,folder , shared routes and search one.
* authRoutes.js ,userRoutes.js,fileRoutes.js,folderRoutes.js,shareRoutes.js,searchRoutes.js

---

## Authentication and autherisization using supabase

* now to do authentication - `Authentication` is a process of verifying the user identity.
* `Autherisization` is a process to verify weather the user is allowed to do certain task or not.
* now since supabase has its own pre-defined tables for the auth so we can start with directly coding.
* now so far what i understand is - supabase does the fully authentication part but when it comes to autherisization we need to check like which route we want to protected or not and for that we need to create custom auth middleware that check for token either it is being sent from client side or not..
* and inorder to give social login we need to integreate it in frontend using supabase..

* this is how the flow will work.

    ```text
    User clicks "Login with Google" button
        ↓
    Frontend calls supabase.auth.signInWithOAuth({ provider: "google" })
        ↓
    Supabase redirects to Google Auth page
        ↓
    User logs in with Google → redirected back to our frontend
        ↓
    Supabase creates user in auth.users table + generates JWT session
        ↓
    Frontend stores session token → uses it for API calls (or any protected api routes)
    ```

* now for auth we have a seprate router -- authRouter that will handel only signup and login request -- we will see for password reset -- in future weather to put here or in userRouter.
* now we will also create a auth middleware so that we can protect our routes.