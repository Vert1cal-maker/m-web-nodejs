import { Request,Response } from "express";
import express from "express";

const app = express();
const port = 3000;


app.get('/', (req: Request, res: Response) => {
    const filePath = '/static/index.html';
    res.sendFile(filePath, { root: "../src" });
});


app.listen(port, ()=>{
    console.log(`U are welcom for front server on ${port}`)
})