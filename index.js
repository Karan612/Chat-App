//get the server and export it 
var app = require("./server/server.js");

app.listen(process.env.PORT || 3000,()=>{
    console.log(`GBC Chat is live on port 3000`);
})
//export the chating app
module.exports = app;