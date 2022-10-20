var osc = require ("osc");
var util = require ("util");

const SERVER_ADDRESS = "127.0.0.1";
const SERVER_PORT = 50123;

var tcpClientPort = new osc.TCPSocketPort ({
	address: SERVER_ADDRESS,
	port : SERVER_PORT
});

tcpClientPort.open();	// open the port and try to connect

tcpClientPort.on ("error", function (err) {
});

tcpClientPort.on ("close", function (err) {
	stopSending();									// stop sending strings
	tcpClientPort.socket.removeAllListeners();		// if we don't do this, we get duplicate events when we reopen
	setTimeout (function() {
		tcpClientPort.open();						// try to reopen the port in 1 second
	}, 1000);
});

tcpClientPort.on ("open", function () {				// socket is connecting
	console.log ('trying to connect...');			
});

tcpClientPort.on ("ready", function () {			// we are connected to the server
	console.log (`connected to ${tcpClientPort.socket.remoteAddress}!`);
	startSending();
})

tcpClientPort.on ("message", function (msg) {		// we received a message
	console.log (`Message from ${tcpClientPort.socket.remoteAddress}:${tcpClientPort.socket.remotePort} - ${util.inspect (msg)}`);
})


/**
 * Send some strings to the server every few seconds to demonstrate functions
 **/
function startSending () {
	var reverseInterval = setInterval (function () {
		tcpClientPort.send ( {
			address : "/uppercase",
			args : [
			{
				type : "s",
				value : "Hello World"
			}]
		})
	},1000);

	var upperCaseInterval = setInterval (function () {
		tcpClientPort.send ( {
			address : "/reverse",
			args : [
			{
				type : "s",
				value : "Make me backwards please"
			}]
		})
	},2000);
}

/**
 * Clear the intervals if they are running
 **/
function stopSending() {
	if (typeof reverseInterval!=='undefined') clearInterval (reverseInterval);
	if (typeof upperCaseInterval!=='undefined') clearInterval (upperCaseInterval);
}
