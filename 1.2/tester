const fs = require("fs");
const { get, Agent } = require("http");
const { url } = require("inspector");
let data = fs.readFileSync("./http.txt", "utf-8");



function getObj (item){
    const endOfLine = item.indexOf("\n")+1;
    const emptyLine = item.indexOf("\n\n");
    const [method,url] = item.slice(0,endOfLine).split(" ");
    const headersStrings = item.
    slice(endOfLine,emptyLine).
    split("\n").
    reduce((accum,current) => {
        const[key,value] = current.split(":");
        accum[key] = value;
        return accum;
    },{});
    const body = item.slice(emptyLine+1,-1);
    return {
        method,
        url,
        headers : headersStrings,
        body,
        }
    }

    console.log(getObj(data));

    
