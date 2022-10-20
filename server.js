// A simple TCP/OSC server.

var osc = require ('osc');
var net = require ('net');
var util = require ('util');

const LISTEN_PORT = 50123;				// port to listen on
const LISTEN_ADDRESS = "0.0.0.0";		// all interfaces

var serverPort = net.createServer (function(socket) {
	var tcpServerPort = new osc.TCPSocketPort ({
		socket: socket
	});

	tcpServerPort.on ("open", function () {
		console.log ('opened');
	})

	tcpServerPort.on ("error", function (err) {
		console.error (err);
	});

	tcpServerPort.on ("message", function (msg) {
		switch (msg.address) {
			case "/reverse" :
				tcpServerPort.send ({
					address : "/reversed_response",
					args : [{
						type : "s",
						value : reverse (msg.args[0])
					}]
				});
			break;
			case "/uppercase" : 
				tcpServerPort.send({
					address : "/uppercase_response",
					args : [{
						type : "s",
						value : msg.args[0].toUpperCase()
					}]
				});
			break;

			case "/lowercase" :
			break;
		}
		console.log (`Message from ${socket.remoteAddress}:${socket.remotePort} - ${util.inspect (msg)}`);
	});
})

// start listening 
serverPort.listen(LISTEN_PORT, LISTEN_ADDRESS, function () {
	console.log (`listening on ${serverPort.address().address} : ${serverPort.address().port}`);
});


function reverse(value) {  
	return Array.from(String(value || '')).reverse().join('')
}