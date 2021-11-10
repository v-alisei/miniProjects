let canvas = document.getElementById("canvas");       
let ctx = canvas.getContext("2d");
let h = window.screen.availHeight;
let w = window.screen.availWidth;
let fieldNumberOfCells = 15;
let cellSize;
let gameField = [];
let direction = 1;//0 - west, 1 south 2 east 3 north
let snakeTail = [[10,6],[9,6],[8,6]]; //snakeTail[index of part][x/y of this part]
let snakeTailCopy;
let r;
let score = 0;
let highscore = document.cookie;
let foodCell;
let timer;
let isItAPc = 0;
let speed = 200;


addEventListener("keydown", rotate);


let up1 = document.getElementById("up");
up1.onmousedown = function(e){
	if(direction!=1){  
		direction = 3;
	}
};

let down1 = document.getElementById("down");
down1.onmousedown = function(e){
	if(direction!=3){  
		direction = 1;
	}
};

let left1 = document.getElementById("left");
left1.onmousedown = function(e){
	if(direction!=0){  
		direction = 2;
	}
};

let right1 = document.getElementById("right");
right1.onmousedown = function(e){
	if(direction!=2){  
		direction = 0;
	}
};

if (h>w){ //mobile
	document.getElementsByClassName('wrap')[0].style.width = w+"px";
	document.getElementsByClassName('wrap')[0].style.height = Math.round((h-w)/2-50)+"px";
	canvas.setAttribute("height",w);
	canvas.setAttribute("width",w);
	cellSize = Math.round(w/fieldNumberOfCells);        
}

if (h<=w){ //pc
	h = h-h/3;
	canvas.setAttribute("height",h);
	canvas.setAttribute("width",h);
	document.getElementById("wrap").innerHTML = "";//для пк кнопки не нужны
	isItAPc=1;
	cellSize = Math.round((h)/fieldNumberOfCells);
}
// init end 





launch();

function launch(){
	score=0;
	direction = 1;
	foodCell = [Math.floor(Math.random() * fieldNumberOfCells),Math.floor(Math.random() * fieldNumberOfCells)];
	snakeTail = [[10,6],[9,6],[8,6]];

	for (var i = 0; i < fieldNumberOfCells; i++){
  	gameField[i] = [];
  	for (var i2 = 0; i2 < fieldNumberOfCells; i2++){
    	gameField[i][i2] = 0;//gameField initialisation
		}
	}

	timer = setInterval(main,speed);
}


function main(){
	move();
	draw();
}
function rotate(e){

	if (r == 0){ // не позволяет сменить направление более чем один раз за цикл; возвращение к 0 в функции move

		if(e.keyCode == 37 && direction!=0){  
			direction = 2;
		}

		if(e.keyCode == 38 && direction!=1){  
			direction = 3;
		}

		if(e.keyCode == 39 && direction!=2){  
			direction = 0;
		}

		if(e.keyCode == 40 && direction!=3){  
			direction = 1;
		}

		r = 1;
	}


}
function move(){
	snakeTailCopy = snakeTail;
	snakeTailCopy = snakeTailCopy.slice();

	collisionCheck();

	if(direction==0){
		snakeTail[0] = [snakeTail[0][0]+1,snakeTail[0][1]];
	}

	if(direction==1){
		snakeTail[0] = [snakeTail[0][0],snakeTail[0][1]+1];
	}

	if(direction==2){
		snakeTail[0] = [snakeTail[0][0]-1,snakeTail[0][1]];
	}

	if(direction==3){
		snakeTail[0] = [snakeTail[0][0],snakeTail[0][1]-1];
	}

	for(let i = 1;i < snakeTail.length; i++){
		snakeTail[i] = snakeTailCopy[i-1];
	}

	for (let i = 0; i < snakeTail.length; i++){// copy invisible snaketail array to visible gameField array
		if (snakeTail[0][0] < gameField[0].length && snakeTail[0][0] >= 0){//защита от обращений к необьявленным элементам массива gameField
			gameField[snakeTail[i][0]][snakeTail[i][1]] = 1;
		}
	}

	eat();
	r = 0;
}

function eat(){

	if (snakeTail[0][0] == foodCell[0] && snakeTail[0][1] == foodCell[1]) {// eat food, increase snake leight
		snakeTail[snakeTail.length] = snakeTailCopy[snakeTailCopy.length - 1];
		score++;
		foodCell = [Math.floor(Math.random() * fieldNumberOfCells),Math.floor(Math.random() * fieldNumberOfCells)];
		
	} else {
	gameField[snakeTailCopy[snakeTailCopy.length-1] [0]]   [snakeTailCopy[snakeTailCopy.length-1] [1]] = 0;
	}
}

function collisionCheck(){

	//collision with walls
	if(direction==0 && snakeTail[0][0] + 1 == fieldNumberOfCells){
		gameover();
	}

	if(direction==1 && snakeTail[0][1] + 1 == fieldNumberOfCells){
		gameover();
	}

	if(direction==2 && snakeTail[0][0] - 1 == -1){
		gameover();
	}

	if(direction==3 && snakeTail[0][1] - 1 == -1){
		gameover();
	}


	//collision with tail
	for(let i = 1; i < snakeTail.length; i++) {

		if(direction==0 && snakeTail[0][0] + 1 == snakeTail[i][0] && snakeTail[0][1] == snakeTail[i][1]){
			gameover();
		}

		if(direction==1 && snakeTail[0][1] + 1 == snakeTail[i][1] && snakeTail[0][0] == snakeTail[i][0]){
			gameover();
		}

		if(direction==2 && snakeTail[0][0] - 1 == snakeTail[i][0] && snakeTail[0][1] == snakeTail[i][1]){
			gameover();
		}

		if(direction==3 && snakeTail[0][1] - 1 == snakeTail[i][1] && snakeTail[0][0] == snakeTail[i][0]){
			gameover();
		}

	}

}


function gameover(){

	clearInterval(timer);

	if(score > highscore){
		highscore = score;
		document.cookie = highscore;
	}

	/*
	if (isItAPc == 1 && score > 6 && score < worldHighscore) {
		screamer();
	} else {
		timer = setTimeout(launch, 1000);
	}*/
	
	timer = setTimeout(launch, 1000);
}






// function screamer(){
// 	console.log("boo");
// 	document.getElementById("img").requestFullscreen();			
// }

function draw(){
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, h, w);
	for(let i = 0; i < fieldNumberOfCells; i++){
		for(let i2 = 0; i2<fieldNumberOfCells; i2++){
			if (gameField[i][i2] == 1){// draw snake
				ctx.fillStyle = "white";
				ctx.fillRect(i*cellSize, i2*cellSize, cellSize, cellSize);
			}
			
			ctx.fillStyle = "blue";// draw food
			ctx.fillRect(cellSize*foodCell[0], cellSize*foodCell[1], cellSize, cellSize);
			
			document.getElementById("score").innerHTML = score+"  |  HI: "+highscore;
			
		}
	}
}




