let socket = new WebSocket("ws://localhost:8080");


document.forms.publish.onsubmit = function() {
  let outgoingMessage = this.message.value;

  socket.send(outgoingMessage);
	this.message.value = "";
  return false;
};


socket.onmessage = function(event) {
  let message = event.data;

  let messageElem = document.createElement('div');
  messageElem.textContent = message;
  document.getElementById('messages').append(messageElem);
}
socket.onerror = function(event){
	let messageElem = document.createElement('div');
  messageElem.textContent = "server:404";
  document.getElementById('messages').append(messageElem);
}