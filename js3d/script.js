let pi = Math.PI;


let ScreenHeight = 250;
let ScreenWidth = 250;
let updateDelay = 16;


let canvas = document.getElementById("canvas");
canvas.setAttribute("height", ScreenHeight);
canvas.setAttribute("width", ScreenWidth);
canvas = canvas.getContext("2d");

let camera = {
	viewAngleWidth: pi/2,
	viewAngleHeight: pi/2,
	rotationAngle: 0,
	x: 50,
	y: 0,
	z: 10,
	r: 0, //roll - z вертикальный поворот
	h: pi, //heading - xy горизонтальный поворот
}

let objects = [
	{
		points: [
			{ x: -5, y: -5, z: -5, },
			{ x: -5, y: -5, z: 5,  },
			
			{ x: 5,  y: -5, z: -5, },
			{ x: 5,  y: -5, z: 10, },
			
			{ x: 5,  y: 5,  z: -5, },
			{ x: 5,  y: 5,  z: 5,  },
			
			{ x: -5, y: 5,  z: -5, },
			{ x: -5, y: 5,  z: 10, },
		],
		edges: [
			[3,7],
			[0,1],
			[2,3],
			[4,5],
			[6,7],
			
			[0,2],
			[0,6],
			
			[4,6],
			[4,2],
			
			[1,3],
			[1,7],
			
			[5,7],
			[5,3],

			[1,5]
		]

	}

];


function update(){
	canvas.fillStyle = "yellow";
	canvas.fillRect(0, 0, ScreenWidth, ScreenHeight);
	canvas.fillStyle = "black";
	for (let object of objects){
		let screenCordsArray = [];
	  for (let point of object.points){
	  	let relativeCords = {
			  x: point.x - camera.x,
			  y: point.y - camera.y,
			  z: point.z - camera.z,
	  	}

	  	let absoluteAngles = {};
	  	absoluteAngles.h = Math.atan(relativeCords.y / relativeCords.x);
		  if (relativeCords.x <= 0) absoluteAngles.h += pi;
	  	if (absoluteAngles.h <= 0) absoluteAngles.h += 2*pi;
	  	absoluteAngles.r = Math.atan(relativeCords.z / Math.sqrt(relativeCords.x*relativeCords.x + relativeCords.y*relativeCords.y));

	  	let relativeAngles = {
			  h: absoluteAngles.h - camera.h,
		  	r: absoluteAngles.r - camera.r,
		  }
	  	if (relativeAngles.h >= pi) relativeAngles.h -= 2*pi;
		  if (relativeAngles.h <= -pi) relativeAngles.h += 2*pi;

	  	let screenCords = {
			  x: ScreenWidth - ((relativeAngles.h + camera.viewAngleWidth/2) * ScreenWidth / camera.viewAngleWidth),
		  	y: ScreenHeight - ((relativeAngles.r + camera.viewAngleHeight/2) * ScreenHeight / camera.viewAngleHeight),
	  	}

	  	screenCordsArray.push([screenCords.x,screenCords.y]);
  	}
		for (let edge of object.edges){
			let x1 = screenCordsArray[edge[0]][0];
			let y1 = screenCordsArray[edge[0]][1];
			let x2 = screenCordsArray[edge[1]][0];
			let y2 = screenCordsArray[edge[1]][1];
			if (x1 * x2 <= 0 || y1 * y2 <= 0) continue;
			canvas.beginPath();
			canvas.moveTo(x1,y1);
			canvas.lineTo(x2,y2);
			canvas.stroke();
		}
	}
	camera.rotationAngle += pi/120;
	if (camera.rotationAngle >= pi*2) camera.rotationAngle = 0;
	camera.h += pi/120;
	if (camera.h >= pi*2) camera.h = 0;
	camera.x = 50*Math.cos(camera.rotationAngle);
	camera.y = 50*Math.sin(camera.rotationAngle);
}


setInterval(update, updateDelay);

