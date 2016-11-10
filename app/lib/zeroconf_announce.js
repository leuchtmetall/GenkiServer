var bonjour = require('bonjour')();
var config = require('../config');
var isWin = /^win/.test(process.platform);

if(!isWin) {
  var mdns = require('mdns');
	// var service = bonjour.publish({ name: 'Web Server Test', type: config.zeroconfTypeServer, port: 3000 });
  // service.stop();
  var ad = mdns.createAdvertisement(mdns.tcp(config.zeroconfTypeServer), 3000);
  ad.start();

} else {
	var exec = require('child_process').exec;

	var shellCommand = 'bin\\dns-sd.exe -R "Genki Server" "_'+config.zeroconfTypeServer+'._tcp" local 3000';
	console.log(shellCommand);
	var child = exec(shellCommand, function (error, stdout, stderr) {
		console.log("ERR: " + error);
		console.log("STDOUT: " + stdout);
		console.log("STDERR: " + stderr);
	});


	// clean up dns-sd process on exit
	process.stdin.resume();//so the program will not close instantly

	function exitHandler(options, err) {
    	if (options.cleanup) {
    		console.log('clean');
    		child.kill('SIGINT');
    	}
	    if (err) console.log(err.stack);
	    if (options.exit) process.exit();
	}

	//do something when app is closing
	process.on('exit', exitHandler.bind(null,{cleanup:true}));

	//catches ctrl+c event
	process.on('SIGINT', exitHandler.bind(null, {exit:true}));

	//catches uncaught exceptions
	process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

}







