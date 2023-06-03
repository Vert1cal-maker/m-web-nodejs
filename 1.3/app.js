const express = require('express');
const app = express();


app.use(express.static("public"));



app.get('/',(req, res) =>{
  res.sendFile(__dirname +'/templates/index1.html')
})


let port = 3000;
app.listen(port, () => {
  console.log(`server ready: htt://localhost:${port}`);
})
