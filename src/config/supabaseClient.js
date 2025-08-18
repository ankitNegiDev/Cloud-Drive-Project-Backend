// importing create client function from the sdk
import { createClient } from "@supabase/supabase-js";

// importing dotenv
import dotenv from 'dotenv';

// loading all environment variables .
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
console.log("supabse url from .env is : ",supabaseUrl);

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log("supabase service role key form .env is : ",supabaseServiceRoleKey);

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables in .env");
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);