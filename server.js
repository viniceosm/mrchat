var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/js', express.static(__dirname + '/node_modules/socket.io-client/dist'));

app.listen(process.env.PORT || 5000, function () {
	console.log('listening on *:'+process.env.PORT);
});

app.get('/', function(req, res){
	res.sendFile(__dirname +'/index.html');
});

io.on('connection', function(socket){
	console.log('Um usuario conectado');
	connections.push(socket);

	socket.on('disconnect', function(){
		users.splice(users.map(function(e) { return e.username; }).indexOf(socket.username), 1);
		connections.splice(connections.indexOf(socket), 1);
		console.log('Um usuario disconnectado');
		io.sockets.emit('mostrar personagens', users);
	});

	socket.on('chat message', function(dado){
		io.emit('chat message', {msg: dado, user: socket.username});
 	});

	socket.on('is typing', function(dado){
		socket.broadcast.emit('typing', dado);
	});

	socket.on('novo usuario', function(dado, callback){
		callback(true);
		socket.id = users.length;
		socket.username = dado;
		socket.x = 10;
		socket.y = 10;
		users.push({username: socket.username, x:socket.x, y:socket.y});

		io.sockets.emit('mostrar personagens', users);
	});

	socket.on('mover personagem', function(direcao){
		if(direcao=="direita"){
			socket.x+=30;
		}else if (direcao=="esquerda") {
			socket.x-=30;
		}else if (direcao=="cima") {
			socket.y-=30;
		}else if (direcao=="baixo") {
			socket.y+=30;
		}
		users[socket.id].x = socket.x;
		users[socket.id].y = socket.y;
		io.sockets.emit('mostrar personagens', users);
	});

});
