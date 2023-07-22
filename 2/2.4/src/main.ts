import express from "express";
import router from "./modules/Routers";
import oneHeandler from "./api/v2/v2";
import corsConfig from "./modules/CorsConfig";
import dataSession from './modules/DataSession'
import dotenv from 'dotenv';
dotenv.config({path: '..env'});

const app = express();
const port = process.env.PORT


app.use(express.json()); 
app.use(corsConfig);
app.use(dataSession); 
app.use("/api", router); 
app.use("/api", oneHeandler); 


app.listen(port, () => {
    console.log(`Server start on ${port}`)
})