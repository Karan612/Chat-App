//Attach dependancies
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dataBaseConfig = require('./database/db');
const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const masterpath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const { generateMessage } = require('./utils/message');
const { Users } = require('./utils/users');
//creating app 
var app = express();
//creating app with http 
var server = http.createServer(app);
//adding socketio
var io = socketio(server);
//get user object 
var users = new Users();
app.use(express.static(masterpath));
//init socket 
io.on('connection', (socket) => {
    console.log("new user connection");
    socket.on('disconnect', () => {

        console.log("disconnected");
        var user = users.removeUser(socket.id);
        if (user) {
            
            io.to(user.room).emit('updateUsers', users.getList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the chat`));
        }

    });
    //Join Chat room

    socket.on('join', (params, callback) => {

        if ((params.Name == undefined || params.Name == "") || params.Room == undefined || params.Room == "") {

            callback('data is empty');

        } else {

            socket.join(params.Room);
            users.removeUser(socket.id);
            users.addUser(socket.id, params.Name, params.Room);

            io.to(params.Room).emit('updateUsers', users.getList(params.Room))

            socket.emit('newMessage', generateMessage('Admin', 'Welcome to GBC Chat App'));

            socket.broadcast.to(params.Room).emit('newMessage', generateMessage('Admin', ` ${params.Name} has joined`));

            callback();
        }
    });
    
    socket.on('createMessage', function(Nmessage) {
        //get user info 
        var user = users.getUser(socket.id);
        io.to(user.room).emit('newMessage', generateMessage(user.name, Nmessage.text));
        //send for all 
        //broadcast for all expect this user 
        //socket.broadcast.emit('newMessage', generateMessage('admin','new user joined'));
        

    });

});

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig.db, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database connected sucessfully ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

// Set up express js port
const historyRoute = require('./routes/history.route')
const eventRoute = require('./routes/event.route')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use('/', express.static(path.join(__dirname)));
app.use('/api', [historyRoute,eventRoute])

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = server;