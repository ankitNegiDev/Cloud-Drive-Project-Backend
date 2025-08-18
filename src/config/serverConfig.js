// basic server config file

// importing dot env..
import dotenv from 'dotenv';

// loading all environment variables.
dotenv.config();

// checking port for debug.
console.log("Port from .env file is : ",process.env.PORT);
export const PORT=process.env.PORT || 4000; // providing a fallback..