var imgTabuleiro = new Image;
var imgPersonagem = new Image;
imgTabuleiro.src = '../img/tabuleiro.png';
imgPersonagem.src = '../img/personagem.png';

window.onload = function() {
	var socket = io.connect();
	$('#formUsuario').submit(function(e){
		e.preventDefault();
		socket.emit('novo usuario', $('#nomeUsuario').val(), function(dado){
			if(dado){
				$('#formUsuario').hide();
				$('#areaMensagem').show();
			}
		});
		$('#nomeUsuario').val('');
	});

	$('#paneMensagem').submit(function(){
		if($('#txtMensagem').val()!=""){
			socket.emit('chat message', $('#txtMensagem').val());
			$('#txtMensagem').val('');
		}
		return false;
	});
	socket.on('chat message', function(dado){
		$('#mensagens').append('<li><strong>'+dado.user +'</strong>:'+ dado.msg);
	});

	// window.onkeydown = function(e){
	// 	console.log('trau');
	// 	if(e.keyCode == 39){
	// 		socket.emit('mover personagem', "direita");
	// 	}else if(e.keyCode == 37){
	// 		socket.emit('mover personagem', "esquerda");
	// 	}else if(e.keyCode == 38){
	// 		socket.emit('mover personagem', "cima");
	// 	}else if(e.keyCode == 40){
	// 		socket.emit('mover personagem', "baixo");
	// 	}else if(e.keyCode == 13){
	// 		$('#txtMensagem').focus();
	// 	}
	// };

window.addEventListener("keydown", (function(canMove) {
	return function(event) {
		if (!canMove) return false;
		canMove = false;
		setTimeout(function() { canMove = true; }, 100);
		switch (event.keyCode) {
			case 39: return move("direita");
			case 40: return move("baixo");
			case 37: return move("esquerda");
			case 38: return move("cima");
		}
	};
})(true), false);

function move(direction) {
	socket.emit('mover personagem', direction);
}

	canvas = document.getElementById('tabuleiro');
	ctx = canvas.getContext("2d");

	canvas.height= 468;
	canvas.width= 1049;

	ctx.drawImage( imgTabuleiro, 0, 0);

	socket.on('mostrar personagens', function(dados){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		ctx.drawImage( imgTabuleiro, 0, 0);

		for(var i=0;i<dados.length;i++){
			ctx.drawImage( imgPersonagem, 0, 0, 45, 110,dados[i].x, dados[i].y, 45, 110);
			ctx.font = "25px Tahoma";
			ctx.fillStyle = "white";
			ctx.strokeStyle = "black";
			ctx.fillText(dados[i].username, dados[i].x, dados[i].y);
			ctx.strokeText(dados[i].username, dados[i].x, dados[i].y);
		}
	});
};
