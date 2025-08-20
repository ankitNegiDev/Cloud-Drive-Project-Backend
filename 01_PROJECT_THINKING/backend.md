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

* or we can say like this

    ```text
    User signs up → Supabase creates user → frontend redirected to login
    User logs in → Supabase returns session (access_token) → frontend stores token
    Frontend calls protected API → sends token in headers
    Backend authMiddleware verifies token → request allowed or rejected
    ```

* now for auth we have a seprate router -- authRouter that will handel only signup and login request -- we will see for password reset -- in future weather to put here or in userRouter.
* now we will also create a auth middleware so that we can protect our routes.

* ## signup

  * for this the api will be `http://localhost:3000/api/auth/signup` and the auth router will hit the get request and the routes will look like this.

    ```js
    import express from 'express';
    import { signupController } from '../controller/authController.js';

    const authRouter=express.Router();

    authRouter.get('/singup', signupController);



    export default authRouter;
    ```

  * now the request will be accepted by the controller layer and it will call the service layer
  * and the signup controller will look like this.

    ```js
    // auth controller -- that will accept signup and login request....

    import { signupService } from "../service/authService.js";

    // signup controller.

    export async function signupController (req,res){
        try {
            // destructuring req.body to get email and password.
            const {email,password}=req.body;
            
            // calling the service layer for signup
            const data = await signupService (email,password);
            return res.status(200).json({
                success:true,
                message: "User signedUp successfully",
                response: data
            });
        }catch(error){
            console.log("error occured in the signup controller and error is : ",error);
            return res.status(error.status || 500).json({
                success:false,
                message: error.message || "User failed to do signUp"
            });
        }
    }
    ```

  * next this function will call the service layer and wait for the response since we are using async function.
  * now the service layer is responsible for calling the signup function of supabase.
  * and the signupService will look like this.

    ```js
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
    ```

  * based on the response either it is valid or not the response or error will be thrown to controller and then based on it the controller will return the data or error to user as a response and this is how the flow will go.

  * and the response will be like this if we hit this api `http://localhost:3000/api/auth/signup`

    ```json
    {
        "success": true,
        "message": "User signedUp successfully",
        "response": {
            "user": {
                "id": "6f45fc9c-c9ec-40e4-b979-6c539ddf77ae",
                "aud": "authenticated",
                "role": "authenticated",
                "email": "love123@gmail.com",
                "phone": "",
                "confirmation_sent_at": "2025-08-18T14:32:05.172130748Z",
                "app_metadata": {
                    "provider": "email",
                    "providers": [
                        "email"
                    ]
                },
                "user_metadata": {
                    "email": "love123@gmail.com",
                    "email_verified": false,
                    "phone_verified": false,
                    "sub": "6f45fc9c-c9ec-40e4-b979-6c539ddf77ae"
                },
                "identities": [
                    {
                        "identity_id": "482392d4-5578-4b91-bc6c-7f436c529c38",
                        "id": "6f45fc9c-c9ec-40e4-b979-6c539ddf77ae",
                        "user_id": "6f45fc9c-c9ec-40e4-b979-6c539ddf77ae",
                        "identity_data": {
                            "email": "love123@gmail.com",
                            "email_verified": false,
                            "phone_verified": false,
                            "sub": "6f45fc9c-c9ec-40e4-b979-6c539ddf77ae"
                        },
                        "provider": "email",
                        "last_sign_in_at": "2025-08-18T14:24:36.531131Z",
                        "created_at": "2025-08-18T14:24:36.531204Z",
                        "updated_at": "2025-08-18T14:24:36.531204Z",
                        "email": "love123@gmail.com"
                    }
                ],
                "created_at": "2025-08-18T14:24:36.473375Z",
                "updated_at": "2025-08-18T14:32:08.059689Z",
                "is_anonymous": false
            },
            "session": null
        }
    }
    ```

* ## loged in / sign in

  * for sign in the api will be `http://localhost:3000/api/auth/login` then request will be accepted by the controller and it will call service layer..
  * and the routes will look like this

    ```js
    import express from 'express';
    import { loginController, signupController } from '../controller/authController.js';

    const authRouter=express.Router();

    // route for signup
    authRouter.post('/singup', signupController);

    // route for login or sign in
    authRouter.post('/login', loginController);

    export default authRouter;
    ```

  * and the controller will look like this

    ```js

    // login controller 

    export async function loginController(req,res){
        try{
            const {email,password}=req.body;

            // calling service layer
            const data=await loginService(email,password);

            return res.status(200).json({
                success:true,
                message:"Congratulasation user logedIn successfully",
                response:data
            });

        }catch(error){
            return res.status(error.status || 500).json({
                success:true,
                message:error.message || "internal server error - user failed to login"
            })
        }
    }
    ```

  * and service will look like this where we are calling the `supabase.auth.signInWithPassword()` an inbuilt function of supabase for login

    ```js

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
    ```

  * if the user is loged in successfully but before that supabase will ask for the confirm email so we created a home route so that our email get verifyed.

    ```js

    // this route is imp for email confirmation -- 
    app.get('/', (req, res) => {
        res.send('<h1>Welcome to Cloud Drive API</h1>');
    });
    ```

  * and the response will be like this

    ```json
    {
        "success": true,
        "message": "Congratulasation user logedIn successfully",
        "response": {
            "user": {
                "id": "0158b4c3-69e0-4123-a2d7-575a90bc5457",
                "aud": "authenticated",
                "role": "authenticated",
                "email": "bingolive9104@gmail.com",
                "email_confirmed_at": "2025-08-18T14:57:26.839722Z",
                "phone": "",
                "confirmation_sent_at": "2025-08-18T14:56:57.509695Z",
                "confirmed_at": "2025-08-18T14:57:26.839722Z",
                "last_sign_in_at": "2025-08-18T15:00:16.892342468Z",
                "app_metadata": {
                    "provider": "email",
                    "providers": [
                        "email"
                    ]
                },
                "user_metadata": {
                    "email": "bingolive9104@gmail.com",
                    "email_verified": true,
                    "phone_verified": false,
                    "sub": "0158b4c3-69e0-4123-a2d7-575a90bc5457"
                },
                "identities": [
                    {
                        "identity_id": "cfbb406c-eb62-403a-95f9-404ad3fb86ef",
                        "id": "0158b4c3-69e0-4123-a2d7-575a90bc5457",
                        "user_id": "0158b4c3-69e0-4123-a2d7-575a90bc5457",
                        "identity_data": {
                            "email": "bingolive9104@gmail.com",
                            "email_verified": true,
                            "phone_verified": false,
                            "sub": "0158b4c3-69e0-4123-a2d7-575a90bc5457"
                        },
                        "provider": "email",
                        "last_sign_in_at": "2025-08-18T14:56:57.497842Z",
                        "created_at": "2025-08-18T14:56:57.49792Z",
                        "updated_at": "2025-08-18T14:56:57.49792Z",
                        "email": "bingolive9104@gmail.com"
                    }
                ],
                "created_at": "2025-08-18T14:56:57.477651Z",
                "updated_at": "2025-08-18T15:00:16.897196Z",
                "is_anonymous": false
            },
            "session": {
                "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6InJ1WVhNQWlvdllGT3FkZzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2p3Z3V2d2x0ZGFzZm95ZWNubHJvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiIwMTU4YjRjMy02OWUwLTQxMjMtYTJkNy01NzVhOTBiYzU0NTciLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU1NTMyODE2LCJpYXQiOjE3NTU1MjkyMTYsImVtYWlsIjoiYmluZ29saXZlOTEwNEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiYmluZ29saXZlOTEwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiIwMTU4YjRjMy02OWUwLTQxMjMtYTJkNy01NzVhOTBiYzU0NTcifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1NTUyOTIxNn1dLCJzZXNzaW9uX2lkIjoiMjlmNGY1MGItZTA4Mi00NWU0LTgyOTMtYmNiMDQ5MTYxOTk4IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.BJjpO8rpMvFjXv0OthnzXgTbpda-ETm15xMve9WzgHA",
                "token_type": "bearer",
                "expires_in": 3600,
                "expires_at": 1755532816,
                "refresh_token": "abawannzjlkp",
                "user": {
                    "id": "0158b4c3-69e0-4123-a2d7-575a90bc5457",
                    "aud": "authenticated",
                    "role": "authenticated",
                    "email": "bingolive9104@gmail.com",
                    "email_confirmed_at": "2025-08-18T14:57:26.839722Z",
                    "phone": "",
                    "confirmation_sent_at": "2025-08-18T14:56:57.509695Z",
                    "confirmed_at": "2025-08-18T14:57:26.839722Z",
                    "last_sign_in_at": "2025-08-18T15:00:16.892342468Z",
                    "app_metadata": {
                        "provider": "email",
                        "providers": [
                            "email"
                        ]
                    },
                    "user_metadata": {
                        "email": "bingolive9104@gmail.com",
                        "email_verified": true,
                        "phone_verified": false,
                        "sub": "0158b4c3-69e0-4123-a2d7-575a90bc5457"
                    },
                    "identities": [
                        {
                            "identity_id": "cfbb406c-eb62-403a-95f9-404ad3fb86ef",
                            "id": "0158b4c3-69e0-4123-a2d7-575a90bc5457",
                            "user_id": "0158b4c3-69e0-4123-a2d7-575a90bc5457",
                            "identity_data": {
                                "email": "bingolive9104@gmail.com",
                                "email_verified": true,
                                "phone_verified": false,
                                "sub": "0158b4c3-69e0-4123-a2d7-575a90bc5457"
                            },
                            "provider": "email",
                            "last_sign_in_at": "2025-08-18T14:56:57.497842Z",
                            "created_at": "2025-08-18T14:56:57.49792Z",
                            "updated_at": "2025-08-18T14:56:57.49792Z",
                            "email": "bingolive9104@gmail.com"
                        }
                    ],
                    "created_at": "2025-08-18T14:56:57.477651Z",
                    "updated_at": "2025-08-18T15:00:16.897196Z",
                    "is_anonymous": false
                }
            }
        }
    }
    ```

* auth middleware is left -- here
* if time allows -- put reset password and forget password and update password also --(check flow first)
* **for reset** -- flow will be user will put email -- then a call to supabase -- and user set new password. `User enters email → backend calls supabase.auth.resetPasswordForEmail(email) → user gets a link. and user set new password`
* **for update** -- flow will be user should be loged in -- means protected route -- and we will ask user to write current and new pass and then call supabase for update password. `User provides current password + new password (or just token + new password if using session). Backend calls supabase.auth.updateUser({ password: newPassword }).`

---

* next task ----> user routes , file routes , folder roues , share routes , search routes

---

* for user profile -- we can fetch info directly from provider -- like google , github -- as avatar url else we will create a table if it is needed...

---

## User Routes

* now for user routes we will focus only on basic crud one that are required for mvp.
* if we later required to add extra info in the user then we can create our own table for user instead of using default supabase one.
* now for the time being we don't know what supabase store with user beside email and password so first we will try to fetch the user and see what data we get.
* so we will create the userRouter that will handel all user rest api.

* now to fetch the user -- we had the api --- `http://localhost:3000/api/user/profile` seding get request on it will fetch the user.
* but make sure in postman we pass the token in the header as key -- Authorization and value --- Bearer token without string format.

```text
[{"key":"Authorization","value":" Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6InJ1WVhNQWlvdllGT3FkZzAiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2p3Z3V2d2x0ZGFzZm95ZWNubHJvLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiI2M2MyNTQwOC0zY2I4LTRiMGItYThkMy1kN2JkZGQwODIwODEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU1NTg1MTU3LCJpYXQiOjE3NTU1ODE1NTcsImVtYWlsIjoiYmluZ29saXZlOTEwNEBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoiYmluZ29saXZlOTEwNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiI2M2MyNTQwOC0zY2I4LTRiMGItYThkMy1kN2JkZGQwODIwODEifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc1NTU4MTU1N31dLCJzZXNzaW9uX2lkIjoiOWI1NTE3NDYtOGE3NS00YmYzLWJkMDEtMTc4ZDBjMDk1ZjcwIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.luPQZLQPhYvsp79DY67N0vCk5NRA2VywJ3FdM6EwQwo","description":"","type":"text","uuid":"e9ed158c-eee9-40a9-8f6c-21d9393f505c","enabled":true}]
```

* and the response we got is --

    ```json
    {
        "success": true,
        "message": "User profile fetched successfully",
        "response": {
            "user": {
                "id": "63c25408-3cb8-4b0b-a8d3-d7bddd082081",
                "aud": "authenticated",
                "role": "authenticated",
                "email": "bingolive9104@gmail.com",
                "email_confirmed_at": "2025-08-19T05:32:05.927276Z",
                "phone": "",
                "confirmation_sent_at": "2025-08-19T05:31:38.713502Z",
                "confirmed_at": "2025-08-19T05:32:05.927276Z",
                "last_sign_in_at": "2025-08-19T05:32:37.710127Z",
                "app_metadata": {
                    "provider": "email",
                    "providers": [
                        "email"
                    ]
                },
                "user_metadata": {
                    "email": "bingolive9104@gmail.com",
                    "email_verified": true,
                    "phone_verified": false,
                    "sub": "63c25408-3cb8-4b0b-a8d3-d7bddd082081"
                },
                "identities": [
                    {
                        "identity_id": "e740d38a-e263-4285-8378-808a4fc22427",
                        "id": "63c25408-3cb8-4b0b-a8d3-d7bddd082081",
                        "user_id": "63c25408-3cb8-4b0b-a8d3-d7bddd082081",
                        "identity_data": {
                            "email": "bingolive9104@gmail.com",
                            "email_verified": true,
                            "phone_verified": false,
                            "sub": "63c25408-3cb8-4b0b-a8d3-d7bddd082081"
                        },
                        "provider": "email",
                        "last_sign_in_at": "2025-08-19T05:31:38.703365Z",
                        "created_at": "2025-08-19T05:31:38.703418Z",
                        "updated_at": "2025-08-19T05:31:38.703418Z",
                        "email": "bingolive9104@gmail.com"
                    }
                ],
                "created_at": "2025-08-19T05:31:38.685185Z",
                "updated_at": "2025-08-19T05:32:37.71199Z",
                "is_anonymous": false
            }
        }
    }
    ```

* by this response we know that -- for extra info we need to create a table and then add the profile table while creating the user -- like at the time of signup and login.

---

## Changes -- we are adding our custom table -- profile for extra user info

* for user name , avatar and may be theme preference -- later we are using the custom profile table and now we have to update our login , signup and user services.

* the sql query we write is this

    ```sql
    create table profiles (
    id uuid references auth.users(id) primary key,
    full_name text,
    avatar_url text,
    bio text,
    created_at timestamp with time zone default now()
    );

    ```

* now we attach a custom table to the user so when we need extra info we can query this table.

---

## Response of this api -- `http://localhost:3000/api/user/profile` get request

* when the loged in user hit this api the response will be

```json
{
    "success": true,
    "message": "User profile fetched successfully",
    "response": {
        "user": {
            "id": "94f7ad64-bb23-4cdb-b370-5ebfc15777ba",
            "aud": "authenticated",
            "role": "authenticated",
            "email": "bingolive9104@gmail.com",
            "email_confirmed_at": "2025-08-19T06:44:36.560336Z",
            "phone": "",
            "confirmation_sent_at": "2025-08-19T06:42:39.672416Z",
            "confirmed_at": "2025-08-19T06:44:36.560336Z",
            "last_sign_in_at": "2025-08-19T06:53:44.107656Z",
            "app_metadata": {
                "provider": "email",
                "providers": [
                    "email"
                ]
            },
            "user_metadata": {
                "email": "bingolive9104@gmail.com",
                "email_verified": true,
                "phone_verified": false,
                "sub": "94f7ad64-bb23-4cdb-b370-5ebfc15777ba"
            },
            "identities": [
                {
                    "identity_id": "8effd9aa-a32f-496c-bd25-406c369e8eb2",
                    "id": "94f7ad64-bb23-4cdb-b370-5ebfc15777ba",
                    "user_id": "94f7ad64-bb23-4cdb-b370-5ebfc15777ba",
                    "identity_data": {
                        "email": "bingolive9104@gmail.com",
                        "email_verified": true,
                        "phone_verified": false,
                        "sub": "94f7ad64-bb23-4cdb-b370-5ebfc15777ba"
                    },
                    "provider": "email",
                    "last_sign_in_at": "2025-08-19T06:41:10.825282Z",
                    "created_at": "2025-08-19T06:41:10.825978Z",
                    "updated_at": "2025-08-19T06:41:10.825978Z",
                    "email": "bingolive9104@gmail.com"
                }
            ],
            "created_at": "2025-08-19T06:41:10.786869Z",
            "updated_at": "2025-08-19T06:53:44.115714Z",
            "is_anonymous": false
        },
        "profile": {
            "full_name": "Ankit Negi",
            "avatar_url": "https://res.cloudinary.com/dyg3mh5wg/image/upload/v1755585491/main-sample.png"
        }
    }
}
```

* task - complete user route -- then file , folder ,share , search etc

---

* the routes for update user profile `http://localhost:3000/api/user/profile` put request is done
* then for deeltion the api route is `http://localhost:3000/api/user/profile` delete request is also done - we will call this from frontend when user click on delete account button that means user want to delete his account.

---

## setup file storage in supabase

* even before writing the files and folder routes setup the storage and check it with a file upload routes..

---

## create a table items for file and folder

* the table will look like this

    ```sql
    CREATE TABLE items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text CHECK (type IN ('file', 'folder')) NOT NULL,
    parent_id uuid REFERENCES items(id) ON DELETE CASCADE, -- null = root folder
    user_id uuid REFERENCES users(id) NOT NULL,
    path text,      -- storage path (for files only)
    size bigint,    -- file size in bytes
    mime_type text, -- "image/png", "application/pdf", etc.
    is_deleted boolean DEFAULT false, -- for Trash
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
    );
    ```

## Folder routes

* now here we have two option either we choose seprate table but i guess it would become complex in terms of db query and we have to do at least two query every time.
* so we will create a single table where we will differenciate them using type column.

* now we have to create different routes based on what feature we are giving.

* ### (1) Create Folder

  * the api route will be post request on `http://localhost:3000/folders`
  * so in frontend we will have a button **create folder** and when user click it we will call our api to create a new folder inside the current folder.
  * the response of create folder is this

    ```json
    {
        "success": true,
        "message": "folder created successfully",
        "folder": {
            "id": "a0d9ca88-d636-4e09-96af-494212e8d371",
            "name": "My Root Folder",
            "type": "folder",
            "parent_id": null,
            "user_id": "3c9f73a9-4b4f-4bd2-9ba7-94e7e2d65c09",
            "path": null,
            "size": null,
            "mime_type": null,
            "is_deleted": false,
            "created_at": "2025-08-19T13:58:51.542774+00:00",
            "updated_at": "2025-08-19T13:58:51.542774+00:00"
        }
    }
    ```

* ### (2) Get folder using parent id as query parameters

  * the api route will be get request on `http://localhost:3000/api/folder` query params..
  * so when the user open any folder it will show all the files and folder inside it.
  * Reads all children items of the folder.
  * and same to show all the content on the root folder we can call our api with folderId for root.

  * the api route is `http://localhost:3000/api/folder` or with query parameter if parent id is avilable `http://localhost:3000/api/folder?parentId=abc123` --
  * it will show all the files and folder inside the abc123 parent folder id
  * **see i created first folder as my root folder -- in this folder i am getting parent id -- as null but how i create -- folder inside the root folder** so for this -- just copy the id the root folder and pass it as the parentId in the nested folder so nested folder will have parent id as root folder.

  * okey id will behave as parent --
  * but see in frontend most probably we will have a button to create new folder --
  * now when user created first folder that means it is considered as root folder -- since no folder exist --
  * and assume user created the root folder and add some file in it and then do some other thing -- but again he want to add a new folder inside the root one folder --- now tell me -- from where we will get the response of our first api call when we create root folder -- if for new folder root is parent then we need root id right ?? so how we will handel it ----- **so the ans is A breadcrumb is a navigation UI pattern that shows the path of folders (or pages) you’ve navigated, like this: `Root Folder > Projects > Project A > Docs`** we have to implement it in frontend... lets see it later

* ### (3) Rename Folder

  * the api route will be put request `http://localhost:3000/:id` here id is the id of folder that whose name we want to change.
  * Change name in DB so it updates instantly in frontend.
  * and the response will be like this

    ```json
    {
        "success": true,
        "message": "congrats folder is re-named successfully",
        "folder": {
            "id": "a2868d37-6a1a-4116-b8d8-cf676e47f75e",
            "name": "My another folder inside root updated",
            "type": "folder",
            "parent_id": null,
            "user_id": "3c9f73a9-4b4f-4bd2-9ba7-94e7e2d65c09",
            "path": null,
            "size": null,
            "mime_type": null,
            "is_deleted": false,
            "created_at": "2025-08-19T14:18:51.913375+00:00",
            "updated_at": "2025-08-19T14:18:51.913375+00:00"
        }
    }
    ```

* ### (4) Delete (Move to Trash)

  * DELETE `http://localhost:3000/folder/:id` (soft delete → mark is_deleted = true)
  * Lets user recover later if mistake.

    ```js
    await supabase
    .from("items")
    .update({ is_deleted: true })
    .eq("id", id)
    .eq("user_id", userId);

    ```

  * here we are not actually deleting the row from the database.
  * Instead we are just setting the column is_deleted = true. means that column acts like a “flag” to mark the folder as deleted.
  * So the folder is still in the table but  the normal folder listing queries should filter it out (e.g., .eq("is_deleted", false) when fetching folders).
  * we can later restore it by setting is_deleted = false.

---

## File routes

* ### (1) Upload file

  * the api route is post request on `http://localhost:3000/files`
  * so in frontend we will give drag or upload button and when user click upload button our api will hit and Uploads file to cloud (supabase storage) and stores info in DB so it appears in Drive. obiously to show file we need to fetch files from supabase storage..

---

## Trash routes

* so we need to create a trash router once we are done with file routes --
* GET /trash -- to list down all trashed items
* PATCH /items/:id/restore
* DELETE /items/:id/permanent

* ### (1) Restore from Trash

  * PATCH `/items/:id/restore`

* ### (2) Permanent Delete

  * DELETE `/items/:id/permanent`

* now we also need to previw the data -- so for that we need a preview route -- like when the user is on home page/root folder then we will show all the files and folder but when user click on any files then this preview route will hit which will generate a signed url -- only for loged in user -- for a certain time --
and then we can display and download the data like this functionality to user.

---

## Sharing Routes

* for sharing we will create permision table.

---

next -- is file routes - then trash routes , then sharing and searching --

* the file routes will look like this

    ```js
    // all file routes...
    import express from "express";
    import { 
        uploadFileController, 
        getFilesController, 
        renameFileController, 
        deleteFileController, 
        getFilePreviewController 
    } from "../controller/fileController.js";
    import { authMiddleware } from "../middleware/authMiddleware.js";
    // import multer -- from multer middleware

    // (1) Upload a file (parent folder is optional)
    fileRouter.post(
        '/', 
        authMiddleware, 
        upload.single('file'), // 'file' is the key sent from frontend
        uploadFileController
    );

    // (2) List files in a folder or root
    // parentId is optional here and passed as query parameter
    fileRouter.get('/', authMiddleware, getFilesController);

    // (3) Rename file using id as URL params
    fileRouter.put('/:id', authMiddleware, renameFileController);

    // (4) Soft delete file (move to Trash) using id as URL params
    fileRouter.delete('/:id', authMiddleware, deleteFileController);

    // (5) Get signed URL / preview for a file
    fileRouter.get('/:id/preview', authMiddleware, getFilePreviewController);

    export default fileRouter;
    ```

---

## File Routes

* here are imp file routes for mvp

* ### (1) Upload a file

  * the api route for this is `http://localhost:3000/file/` -- a post request will upload the file.

  * this is the controller.

    ```js
    export const uploadFileController = async (req, res) => {
    try {
        const userId = req.user.id; // from authMiddleware
        const file = req.file; // multer attaches this
        const parentId = req.body.parentId || null;

        const result = await uploadFileService(userId, file, parentId);
        return res.status(201).json({ success: true, data: result });
    } catch (error) {
        console.error("Upload File Error:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
    };
    ```

  * **the parent id -- is sent by the client -- ?? that means -- how the client will know -- inside which folder he is -- ?? i just confused ??**
  * so ans is -- > our frontend will somewhere maintains a current folder state and when the user navigates inside a folder we already have that folder's id (because we will fetched its contents).that means when the user uploads a file while inside that folder, the frontend passes that folder's id as parentId. and if the user upload file in the root in that case parentId will be null.

  * ### Uploading a file to the supabase storage

    * now to upload the file to the supabase storage we will use inbuilt function that supabase provide to us.

        ```js
        const { data: storageData, error: uploadError } = await supabase.storage
        .from("files") // bucket name in Supabase Storage
        .upload(`${userId}/${Date.now()}_${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        ```

    * here `supabase.storage.from("files")` →  is our Supabase Storage bucket and name of our storage bucket is files.
    * `.upload(path, file.buffer, options)` → this will uploads the actual file bytes (buffer) to our bucket named files or any bucket we use.
      * `Path = ${userId}/${Date.now()}_${file.originalname}`
        * here userId → separates users into folders.
        * Date.now() → prevents filename collisions.
        * file.originalname → keeps the original filename for reference.
    * The file is now physically stored in Supabase's object storage (like S3).
    * `storageData.path` → gives you the path inside the bucket where the file is stored.
    * that means `.upload(path, file.buffer,options)` here path is --`Path = ${userId}/${Date.now()}_${file.originalname}` and file.buffer is same and `options are -- {contentType: file.mimetype,upsert: false,}

  * ### Uploading a file into db in supabase after uploading to supabase storage

    * once we uploaded the file to the supabase storage then we need to insert it into the supabase db.

---

* ## (2) Get all files in a parent folder (parentId passed as query param)

  * the api route for this is -- `http://localhost:3000/api/file?parentId=2344` this will get all files inside this folder with parent id 2344. if not parentId then its root folder.

  * **but i am confused that -- suppose user click on a folder then -- what our goal is to show all file and folder inside that folder which is being clicked -- so we will call item router -- api that will fetch all files and folder -- and now my question is then where we will use this route of file and folder --- getting file and folder by parent id which is passed as query parameter**
  * now the ans is ---> our goal is to = show everything inside it → files + folders.
    * the best way is to call itemRouter → this will internally call:
      * getFilesByParentId(parentId)
      * getFoldersByParentId(parentId)
      * then return { files: [...], folders: [...] } in a single response. So frontend only calls 1 API.

  * **Then why do we still keep fileRouter.get('/',  getFilesByParentId) and folderRouter.get('/', getFolderByParentId)?**

    * Because they are useful for specialized use cases:

      * ***Files tab / All files view***
        * Maybe we want a "Recent Files" or "All Files" page (like Google Drive has).
        * That would only call fileRouter.get('/', getFilesByParentId) and ignore folders.

      * ***Folders tab / Folder picker dialog***
        * Example: when uploading a file we may want to show only folders (to choose where to upload). then we have to call folderRouter.get('/',getFoldersByParentId)

      * ***Internal re-use***
        * our itemRouter can internally call those services instead of duplicating queries.

* ## (3) get a file by its id

  * the api route will be -- `http://localhost:3000/api/file/:id` and it will get the specific file info using its id.

* ## (4) rename file using id

  * the api route will be - `http://localhost:3000/api/file/:id` and it will re-name the specific file using its id.

* ## (5) delete file using id

  * the api route will be `http://localhost:3000/api/file/:id` and it will delte the speicifif file using its id.

---

* next -- item routes - (combine route for fetching file and folders -- ) check other routes also acc to usecase , then trash route -- like to res-store or delete permanently -- then sharing route (signed url with time limit) then searching ---
