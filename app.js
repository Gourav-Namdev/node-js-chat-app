var express = require('express')
var http = require('http')
var socket = require('socket.io')

var app = express()
var server = http.createServer(app) 
var io = socket.listen(server);

var users =[];
var connetions = [];

var port = 3000;

// var server = http.createServer(function(req,res){
	// console.log("server is listening on http://localhost:%s"+port)
	// res.send("ok")
// })

app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html')
})


console.log("server is listening on http://localhost:%s",port)

//all the socket events will come here
io.sockets.on('connection',function(socket){
	connetions.push(socket)
	console.log("connected: %s socket connected",connetions.length)
	
	
	//disconnection
	socket.on('disconnect',function(data){
		//if(!socket.username)  return;
		users.splice(users.indexOf(socket.username),1)
		updateUserNames()
		connetions.splice(connetions.indexOf(socket),1)
		console.log('Disconnected : %s socket connected',connetions.length)
	})
	//send message
	socket.on('send message',function(data){
		console.log(data)
		io.sockets.emit('new message',{msg:data,user:socket.username})
	})
	
	//new user
	socket.on('new user',function(data,callback){
		callback(true)
		socket.username = data
		users.push(socket.username)
		updateUserNames()
	})
	
	function updateUserNames(){
		io.sockets.emit('get users',users)
		
		
	}
})
server.listen(port)