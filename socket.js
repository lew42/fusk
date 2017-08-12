/*

I basically just need an ultra-simple fallback server...



*/

const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
// const fs = require("fs-extra");

var chokidar = require("chokidar");

const app = express();

app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocket.Server({
	perMessageDeflate: false,
	server: server
});

var socket, saving = false;

wss.on("connection", function(ws){
	console.log("connected");

	var update = function(){
		fs.readFile("./public/test.txt", 'utf8', (err, data) => {
			if (err) throw err;
			ws.send(data)
		});
	};

	socket = ws;
	ws.on("message", function(txt){
		saving = true;
		fs.writeFile("./public/test.txt", txt, (err) => {
			saving = false;
			if (err) throw err;
			console.log("saved", txt);
		})
	});


	chokidar.watch("./public/test.txt").on("change", () => {
		if (!saving){
			console.log("changed");
			update();
		}
	});
	update();
});


server.listen(80, function(){
	console.log("listening");
});