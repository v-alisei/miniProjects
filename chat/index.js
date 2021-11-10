const WebSocket = require('ws');

let express = require("express");
let app = express();

const clients = new Set();
const wss = new WebSocket.Server({ port: 8080 });

let messageList = [];
let online = 0;
let nameIsBusy = false;


app.listen(443);
app.use(express.static("client"))

wss.on('connection', (ws) => {
	console.log(messageList);
	online++;
	clients.add(ws);
	ws.send("Server:Назовитесь!");
	ws.isRegistered = false;

  ws.on('message', (message) => {

		if (!ws.isRegistered){
			for(let client of clients){
				if (message == client.name){
					ws.send("Имя занято!");
				  nameIsBusy = true;
				}
			}

			if (!nameIsBusy){
				ws.name = message;
				ws.send(`Server:Hey, ${ws.name}, welcome, komrade)`);
				ws.isRegistered = true;
				for(let i = 0; i < messageList.length;i++) ws.send(messageList[i]);
				for(let client of clients) client.send(`Server:${ws.name} вошёл в чат!`);
			}

		} else {

			for(let client of clients) {
				if(client.isRegistered){
      		client.send(ws.name+":"+message);
				}
    	}
			messageList.push(ws.name+":"+message);
			if (messageList.length > 20) messageList.shift();

		}
  });
	
	ws.on('close', function() {
    clients.delete(ws);
		online--;

		for(let client of clients) {
			client.send(`Server:боец ${ws.name} потерян`);
    }

  });

})
