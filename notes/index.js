let express = require("express");
let app = express();
let fs = require("fs");


function getListHTMLCode(){
	let listHTMLCode = "";
	let filesArray = fs.readdirSync("notes");
	for(let i of filesArray){
		listHTMLCode = listHTMLCode + `<li><a href = "/notes/${i.slice(0, -4)}">${i.slice(0, -4)}</a></li>`;
	}
	return listHTMLCode;
}

function checkNameAvilable(name){
	let filesArray = fs.readdirSync("notes");
	for(let i of filesArray){
		if (i == name+".txt") return false;
	}
	if(/[<>:"|;?*/.,]/.test(name)) return false;
	return true;
}

app.get("/",function (req,res) {
	
	if (req.query.create) {
		let name = req.query.name;
		if(checkNameAvilable(name)){
			fs.writeFile(`notes/${name}.txt`,"",function(error){
				res.redirect(`../notes/${name}`);
			});
		} else {
			fs.readFile("site/index.html","utf8",function(error,data){
				data = data.replace("{notes}",getListHTMLCode());
				data = data.replace("//message","alert(`this name is invalid`);");
				res.end(data);
			});
		}
	} else {
		fs.readFile("site/index.html","utf8",function(error,data){
			data = data.replace("{notes}",getListHTMLCode());
			res.end(data);
		});
	}
});

app.get("/notes/:fileName",function(req,res){
	
	let name = req.params.fileName;
	let act = req.query.action;
	if (act == "delete"){
		
		fs.unlink(`notes/${name}.txt`,function(){
			res.redirect(`../`);
		});

	} else if (act == "rename"){
		
		let newName = req.query.newname;
		let oldFileData;
		if (checkNameAvilable(newName)){

			oldFileData = fs.readFileSync(`notes/${name}.txt`, "utf8");
			fs.renameSync(`notes/${name}.txt`, `notes/${newName}.txt`);
			fs.writeFileSync(`notes/${newName}.txt`, oldFileData);

			res.redirect(`../notes/${newName}`);

		} else {
			res.end(`<a href="/notes/${name}">back</a><h1>invalid name<h1>`);
		}

	} else if (act == "save"){
		
		let text = req.query.text;
		text = text == undefined ? "" : text;
		fs.writeFile(`notes/${name}.txt`,text,function(){
			res.redirect(`../notes/${name}`);
		});

	} else {
		//read note
		let fileData = fs.readFileSync(`notes/${name}.txt`,"utf8");
		fs.readFile("site/note.html","utf8",function(error,data){
			if (error) res.end("error");
			data = data.replace("{text}", fileData);
			data = data.replace("{NoteName}",name);
			res.end(data);
		});
	}
});





app.listen(443);
