let table = document.getElementById("t");
let fieldInputArray;
createTable(3);


let sizeInput = document.getElementById("size");
sizeInput.oninput = function(){
	createTable(Math.max(2,Math.min(4,sizeInput.value)));
}
sizeInput.onblur = function(){
	let value = sizeInput.value;
	sizeInput.value = Math.max(2,Math.min(4,value));
}

let solveButton = document.getElementById("b");
solveButton.onclick = function () {
	let INArray = [];
	let size = fieldInputArray.length;
	for(let y = 0; y < size; y++){
		INArray.push([]);
		for(let x = 0; x < size; x++){
			INArray[y][x] = Number(fieldInputArray[y][x].value);
		}
	}
	let answer = solve(INArray);
	if (!answer) alert("it seems like you insert something incorrect");
	for(let y = 0; y < size; y++){
		for(let x = 0; x < size; x++){
			fieldInputArray[y][x].value = answer[y][x];
		} 
	}
}
let resetButton = document.getElementById("reset");
resetButton.onclick = function (){
	createTable(sizeInput.value);
}
let presetButton = document.getElementById("preset");
presetButton.onclick = function (){
	createTable(3);
	let p1 = [
		[8,0,0, 0,0,0, 0,0,0],
		[0,0,3, 6,0,0, 0,0,0],
		[0,7,0, 0,9,0, 2,0,0],

		[0,5,0, 0,0,7, 0,0,0],
		[0,0,0, 0,4,5, 7,0,0],
		[0,0,0, 1,0,0, 0,3,0],

		[0,0,1, 0,0,0, 0,6,8],
		[0,0,8, 5,0,0, 0,1,0],
		[0,9,0, 0,0,0, 4,0,0],
	];
	for(let y = 0; y < 9; y++){
		for(let x = 0; x < 9; x++){
			if (p1[x][y] == 0) continue;
			fieldInputArray[x][y].value = p1[x][y];
		}
	}
}




function solve(mainArray){
	let size = Math.sqrt(mainArray.length);
	let tableSize = mainArray.length;
	let somethingHasChanged = true;
	while(somethingHasChanged){
		somethingHasChanged = false;
		for(let y = 0; y < tableSize; y++){
			for(let x = 0; x < tableSize; x++){
				if (mainArray[y][x] != "" || mainArray[y][x] != 0) continue;
				let possibleOptions = [];
				for (let i = 1; i <= tableSize; i++) possibleOptions.push(i);
				for (let i = 0; i < tableSize; i++){
					if (possibleOptions.indexOf(mainArray[i][x]) != -1){
						possibleOptions.splice(possibleOptions.indexOf(mainArray[i][x]),1);
					} 
					if (possibleOptions.indexOf(mainArray[y][i]) != -1){
						possibleOptions.splice(possibleOptions.indexOf(mainArray[y][i]),1);
					} 
				}	
				for(let i = y - y % size; i < y + size - y % size; i++){
					for(let j = x - x % size; j < x + size - x % size; j++){
						if (possibleOptions.indexOf(mainArray[i][j]) != -1){
							possibleOptions.splice(possibleOptions.indexOf(mainArray[i][j]),1);
						}
					}
				}
				if (possibleOptions.length == 1){
					mainArray[y][x] = possibleOptions[0];
					somethingHasChanged = true;
				}
			}
		}
	}
	let minPossibleOptions = [];
	let minPossibleOptionsX ;
	let minPossibleOptionsY ;
	let haveZero = false;
	for (let i = 1; i <= tableSize + 1; i++) minPossibleOptions.push(i);
	for(let y = 0; y < tableSize; y++){
		for(let x = 0; x < tableSize; x++){
			if (mainArray[y][x] != "" || mainArray[y][x] != 0) continue;
			haveZero = true;
			let possibleOptions = [];
			for (let i = 1; i <= tableSize; i++) possibleOptions.push(i);
			for (let i = 0; i < tableSize; i++){
				if (possibleOptions.indexOf(mainArray[i][x]) != -1){
					possibleOptions.splice(possibleOptions.indexOf(mainArray[i][x]),1);
				} 
				if (possibleOptions.indexOf(mainArray[y][i]) != -1){
					possibleOptions.splice(possibleOptions.indexOf(mainArray[y][i]),1);
				} 
			}	
			for(let i = y - y % size; i < y + size - y % size; i++){
				for(let j = x - x % size; j < x + size - x % size; j++){
					if (possibleOptions.indexOf(mainArray[i][j]) != -1){
						possibleOptions.splice(possibleOptions.indexOf(mainArray[i][j]),1);
					}
				}
			}
			if (possibleOptions.length < minPossibleOptions.length){
				minPossibleOptions = possibleOptions;
				minPossibleOptionsX = x;
				minPossibleOptionsY = y;
			}
		}
	}
	if (!haveZero) return mainArray;
	else {
		if (minPossibleOptions.length == 0) return false;
		for (let i = 0; i < minPossibleOptions.length; i++){
			let guessArray = JSON.parse(JSON.stringify(mainArray));
			guessArray[minPossibleOptionsY][minPossibleOptionsX] = minPossibleOptions[i];
			let temp = solve(guessArray);
			if (temp) return temp;
		}
	}
	return false;
}

function createTable(size){
	table.innerHTML = "";
	fieldInputArray = [];
	let tableSize = size*size;
	let colgroup = document.createElement("colgroup");
	for(let i = 0; i < tableSize; i++){		
		let col = document.createElement("col");
		if (! ((i + 1) % size)) col.classList.add("b-right");
		colgroup.appendChild(col);
	}
	table.appendChild(colgroup);
	for(let i = 0; i < tableSize; i++){	
		let row = document.createElement("tr");
		fieldInputArray.push([]);
		for(let j = 0; j < tableSize; j++){
			let tdata = document.createElement("td");
			let input = document.createElement("input");
			input.setAttribute("type","text");
			input.setAttribute("pattern","[0-9\s]*");
			input.setAttribute("size",tableSize.toString().length);
			fieldInputArray[i].push(input);
			row.appendChild(tdata);
			tdata.appendChild(input);
		}
		if (! ((i + 1) % size)) row.classList.add("b-bottom");
		table.appendChild(row);
	}
	for (let i = 0; i < tableSize; i++){
		for (let j = 0; j < tableSize - 1; j++){
			fieldInputArray[i][j].oninput = function(){						
				if(fieldInputArray[i][j].value == " " || fieldInputArray[i][j].value.length == tableSize.toString().length){
					fieldInputArray[i][j+1].focus();
				}				
			}
			fieldInputArray[i][j].onblur = function(){
				if (isNaN(Number(fieldInputArray[i][j].value))){
					fieldInputArray[i][j].value = "";
				}
				fieldInputArray[i][j].value = Math.max(0,Math.min(tableSize,fieldInputArray[i][j].value));
				if (fieldInputArray[i][j].value == 0) fieldInputArray[i][j].value = "";

			}
		}
		if (i != tableSize - 1){
			fieldInputArray[i][tableSize - 1].oninput = function(){			
				if(fieldInputArray[i][tableSize - 1].value == " " || fieldInputArray[i][tableSize - 1].value.length == tableSize.toString().length){
					fieldInputArray[i+1][0].focus();
				}
			}
			fieldInputArray[i][tableSize - 1].onblur = function(){
				if (isNaN(Number(fieldInputArray[i][tableSize - 1].value))){
					fieldInputArray[i][tableSize - 1].value = "";
				}
				fieldInputArray[i][tableSize - 1].value = Math.max(0,Math.min(tableSize,fieldInputArray[i][tableSize - 1].value));
				if (fieldInputArray[i][tableSize - 1].value == 0) fieldInputArray[i][tableSize - 1].value = "";
			}
		} else {
			fieldInputArray[i][tableSize - 1].onblur = function(){
				if (isNaN(Number(fieldInputArray[i][tableSize - 1].value))){
					fieldInputArray[i][tableSize - 1].value = "";
				}
				fieldInputArray[i][tableSize - 1].value = Math.max(0,Math.min(tableSize,fieldInputArray[i][tableSize - 1].value));
				if (fieldInputArray[i][tableSize - 1].value == 0) fieldInputArray[i][tableSize - 1].value = "";
			} 
		}
	}
}