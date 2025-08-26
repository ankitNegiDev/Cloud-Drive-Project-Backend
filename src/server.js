
// now creating a basic express server setup 

import express from 'express';
import cors from 'cors';
import { PORT } from './config/serverConfig.js';
import { supabase } from './config/supabaseClient.js';
import apiRouter from './routes/apiRoutes.js';
const app=express();

// using cors
app.use(cors({
    origin: "http://localhost:5173",
    Credentials: true
}));

// inbuilt middleware
app.use(express.json()); // parse json data
app.use(express.text()); // parse plane text or incoming plane text payload
app.use(express.urlencoded({extended:true})); // parse form submission

// using /api router 
app.use('/api',apiRouter);


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


// this route is imp for email confirmation -- 

app.get('/', (req, res) => {
    res.send('<h1>Welcome to Cloud Drive API</h1>');
});
