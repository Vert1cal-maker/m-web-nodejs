function readHttpLikeInput() {
  var fs = require("fs");
  var res = "";
  var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  let was10 = 0;
  for (;;) {
    try {
      fs.readSync(0 /*stdin fd*/, buffer, 0, 1);
    } catch (e) {
      break; /* windows */
    }
    if (buffer[0] === 10 || buffer[0] === 13) {
      if (was10 > 10) break;
      was10++;
    } else was10 = 0;
    res += new String(buffer);
  }

  return res;
}

let contents = require("fs").readFileSync("./text.txt", "utf-8");

// відповідь
function outputHttpResponse(statusCode, statusMessage, headers, body) {

  
  const protocol = "HTTP/1.1";
  const date = new Date();
  const server = "Apache/2.2.14 (Win32)";
  const contentLenght = body.lenght;
  const connection = "Closed";
  const contentType = "application/x-www-form-urlencoded";

  console.log(`${protocol} ${statusCode} ${statusMessage}\nDate: ${date}\nServer: ${server}\nContent-Lenght : ${contentLenght}\nConnection: ${connection}
Content-Type: ${contentType}\n${body} `);
}

// Запит
function processHttpRequest(method, uri, headers, body) {
  const expectUri = "/api/checkLoginAndPassword";
  const expectContentType = "application/x-www-form-urlencoded";

  let passwordStorage;
  try {
    passwordStorage = require("fs").readFileSync("./password.txt", "utf-8");
  } catch (error) {
    outputHttpResponse(500, "Internet Serveral Error", headers, "Internet Serveral Error");
    return null;
  }


  if (uri != expectUri || headers["Content-Type"] != expectContentType) {
    outputHttpResponse(400, "Bad Request", headers, "Bad Request");
  } else {
    function takeBodyContent(){
      return body
       .trim()
       .split("&")
       .reduce((accum, element) => {
         let tmp = element.split("=");
         accum[tmp[0]] = tmp[1];
         return accum;
       }, {});
     } 
     let password = takeBodyContent();
     
     passwordStorage.includes(`${password.login}:${password.password}`) ? 
     outputHttpResponse(200, "OK", headers, "<h1 style=\"color:green\">FOUND</h1>") : 
     outputHttpResponse(404, "Not found", headers, "<h1 style=\"color:red\">no such user exists</h1>");
  }
}

function parseTcpStringAsHttpRequest(string) {
  const endOfLine = string.indexOf("\n") + 1;
  const emptyLine = string.indexOf("\n\n");
  const [method, uri] = string.slice(0, endOfLine).split(" ");
  const body = string.slice(emptyLine + 1);
  const headersStrings = string
    .slice(endOfLine, emptyLine)
    .split("\n")
    .reduce((accum, current) => {
      const [key, value] = current.split(":");
      accum[key] = value.trim();
      return accum;
    }, {});
  return {
    method,
    uri,
    headers: headersStrings,
    body,
  };
}

http = parseTcpStringAsHttpRequest(contents);

processHttpRequest(http.method, http.uri, http.headers, http.body);
