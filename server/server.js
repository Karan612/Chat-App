//Attach dependancies
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

module.exports = server;