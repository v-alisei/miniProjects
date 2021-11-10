const FieldSize = 3;
const WinLineLength = 3;
const AgainstAI = true;
const AIdepth = 6;

let aiWorking = false;
let gameEnd = false;//status
let Field = [];
let CrossOrZero = 1;//1-❌ 2-⭕
for(let i = 0; i < FieldSize; i++){
	Field[i] = [];
	for(let k = 0; k < FieldSize; k++){
		Field[i][k] = 0;
	}
}
//init end
 


//create table
let table = document.getElementById("table");
for(let i = 0; i < FieldSize; i++){
	let row = document.createElement("tr");
	table.appendChild(row);
	for(let k = 0; k < FieldSize; k++){
		let cell = document.createElement("td");
		cell.id = i+"-"+k;
		cell.onclick = worker;
		table.appendChild(cell)
	}
}




//handle click event; called after player clicked on a cell
function worker(e){
	if (gameEnd || aiWorking) return
	let clickedCell = e.currentTarget;
	let cords = clickedCell.id.split("-");
	let x = Number(cords[0]);//cell xy which was clicked just now
	let y = Number(cords[1]);
	if(clickedCell.innerText != ``) return


	if(AgainstAI){
		clickedCell.innerText = "❌"
		Field[x][y] = 1;
		aiWorking = true;
		if(checkWin(x, y, 1, Field)) win(1);

		let max = -1;
		let bestMoveX = 0;
		let bestMoveY = 0;
		for(let x1 = 0; x1 < FieldSize; x1++){	
			for(let y1 = 0; y1 < FieldSize; y1++){
				let childField = JSON.parse(JSON.stringify(Field));
				if(childField[x1][y1] != 0) continue;
				childField[x1][y1] = 2;
				if(checkWin(x1, y1, 2, childField)) {
					bestMoveX = x1;
					bestMoveY = y1;
				}
				let r = minimax(childField, 1, 0);
				if(checkWin(x1, y1, 2, childField)) r = 1
				if (r > max){
					max = r;
					bestMoveX = x1;
					bestMoveY = y1;
				} 
			}
		}
		Field[bestMoveX][bestMoveY] = 2;
		if(checkWin(bestMoveX, bestMoveY, 2, Field)) win(2);
		document.getElementById(bestMoveX + "-" + bestMoveY).innerText = "⭕";
		aiWorking = false;
	} else {

		//against human on same machine
		if(CrossOrZero == 1){
			clickedCell.innerText = "❌"
			CrossOrZero = 2;
			Field[x][y] = 1;
		} else if(CrossOrZero == 2) {
			clickedCell.innerText = "⭕"
			CrossOrZero = 1;
			Field[x][y] = 2;
		}
		if(checkWin(x, y, CrossOrZero, Field)){
			setTimeout(win,1000, CrossOrZero);
		}

	}
}


function minimax(table, player, depth){
	//
	if(depth == AIdepth) return 0;
	let result = 0;
	let m = 0;
	if (player == 1) {
		for(let x = 0; x < FieldSize; x++){	
			for(let y = 0; y < FieldSize; y++){
				let childField = JSON.parse(JSON.stringify(table));
				if(childField[x][y] != 0) continue;
				childField[x][y] = 1;
				if(checkWin(x, y, 1, childField)) return -1;
				let result = minimax(childField, 2, depth+1);
				if (result < m){
					m = result;
				} 
			}
		}
	}


	else {
		for(let x = 0; x < FieldSize; x++){	
			for(let y = 0; y < FieldSize; y++){
				let childField = JSON.parse(JSON.stringify(table));
				if(childField[x][y] != 0) continue;
				childField[x][y] = 2;
				if(checkWin(x, y, 2, childField)) return 1;
				let result = minimax(childField, 1, depth+1);
				if (result > m){
					m = result;
				} 
			}
		}
	}
	

	return result
}



//params determine last marked sign, we don't check another ones
function checkWin(x, y, CrossOrZero, Field){
	let marksInLine = 0;
	for(let i = -WinLineLength; i<=WinLineLength; i++){
		if(x+i < 0 || x+i >= FieldSize) continue
		if(y+i < 0 || y+i >= FieldSize) continue
		if(Field[x+i][y+i] == CrossOrZero){
			marksInLine++;
			if(marksInLine == WinLineLength) return true;
		} else {
			marksInLine = 0;
		}
	}
	marksInLine = 0;
	for(let i = -WinLineLength; i<=WinLineLength; i++){
		if(x+i < 0 || x+i >= FieldSize) continue
		if(y-i < 0 || y-i >= FieldSize) continue
		if(Field[x+i][y-i] == CrossOrZero){
			marksInLine++;
			if(marksInLine == WinLineLength) return true;
		} else {
			marksInLine = 0;
		}
	}
	marksInLine = 0;
	for(let i = -WinLineLength; i<=WinLineLength; i++){
		if(y+i < 0 || y+i >= FieldSize) continue
		if(Field[x][y+i] == CrossOrZero){
			marksInLine++;
			if(marksInLine == WinLineLength) return true;
		} else {
			marksInLine = 0;
		}
	}
	marksInLine = 0;
	for(let i = -WinLineLength; i<=WinLineLength; i++){
		if(x+i < 0 || x+i >= FieldSize) continue
		if(Field[x+i][y] == CrossOrZero){
			marksInLine++;
			if(marksInLine == WinLineLength) return true;
		} else {
			marksInLine = 0;
		}
	}
	return false
}



function win(whoWon){
	alert((whoWon-1 ? "zeros" :"crosses") + " won!")
	gameEnd = true;
}