//get the server and export it 
var app = require("./server/server.js");

app.listen(process.env.PORT || 8080,()=>{
    console.log(`GBC Chat is live on port 8080`);
})
//export the chating app
module.exports = app;