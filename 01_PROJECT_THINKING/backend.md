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
