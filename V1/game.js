var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;

// MOUSE //

var Mouse = {
	x:canvas.width/2,
	y:canvas.height/2
};
window.onmousemove = function(e){
	Mouse.x = e.clientX - canvas.offsetLeft - canvas.parentNode.offsetLeft;
	Mouse.y = e.clientY - canvas.offsetTop - canvas.parentNode.offsetTop;
}

// KEYS //
var Key = {};
var KEY_CODES = {
	37:"left", 38:"up", 39:"right", 40:"down",
	65:"left", 87:"up", 68:"right", 83:"down",
	16:"shift", 32:"space",
	27:"pause", 80:"pause"
};
Key.onKeyDown = function(event){
	var code = KEY_CODES[event.keyCode];
    Key[code] = true;
    if(code=="pause"){
    	Game.togglePause();
    }
    event.stopPropagation();
    event.preventDefault();
}
Key.onKeyUp = function(event){
	var code = KEY_CODES[event.keyCode];
    Key[code] = false;
    event.stopPropagation();
    event.preventDefault();
}
window.top.addEventListener("keydown",Key.onKeyDown,false);
window.top.addEventListener("keyup",Key.onKeyUp,false);
window.addEventListener("keydown",Key.onKeyDown,false);
window.addEventListener("keyup",Key.onKeyUp,false);

// CLICK //

var socialDOM = document.getElementById("social");
var scrollY = 10;

window.onclick = function(){

	//if(cam.flash!=0) return;

	// Get image data
	var imageData = ctx.getImageData(cam.x-cam.width/2, cam.y-cam.height/2, cam.width, cam.height);

	// Snap photo
	var photo = document.createElement("canvas");
	photo.width = cam.width;
	photo.height = cam.height;
	photo.getContext("2d").putImageData(imageData,0,0);

	// Add photo
	photo.style.top = -(scrollY-10)+"px";
	socialDOM.appendChild(photo);
	socialDOM.style.top = scrollY+"px";
	scrollY += photo.height+10;

	// Remove old photos
	/*while(socialDOM.children.length>4){
		socialDOM.removeChild(socialDOM.children[0]);
	}*/

	// Flash
	cam.flash = 1;

}

// RENDERING //

var cam = {
	x: Mouse.x,
	y: Mouse.y,
	width: 270,
	height: 150,
	flash: 0
};

// IMAGES //
var reporterImage = document.getElementById("reporter");
var bgImage = document.getElementById("bg");

// SPRITE //
function Sprite(image){

	var self = this;
	self.image = image;

	self.x = 0;
	self.y = 0;
	self.regX = image.width/2;
	self.regY = image.height;

	self.scaleX = 1;
	self.scaleY = 1;

	self.draw = function(ctx){
		ctx.save();
		ctx.translate(self.x, self.y);
		ctx.scale(self.scaleX,self.scaleY)
		ctx.translate(-self.regX,-self.regY);
		ctx.drawImage(self.image,0,0);
		ctx.restore();
	};

}

var background = new Sprite(bgImage);
background.regX = 0;
background.regY = 0;

// PLAYER //
var player = (function(){

	var player = new Sprite(reporterImage);
	player.x = 200;
	player.y = 240;
	player.scaleX = 0.5;
	player.scaleY = 0.5;

	var hopAnim = 0;

	player.update = function(){

		if(Key.left){
			player.x -= 4;
			player.scaleX = -0.5;
		}
		if(Key.right){
			player.x += 4;
			player.scaleX = 0.5;
		}
		if(Key.up) player.y -= 3;
		if(Key.down) player.y += 3;

		if(!(Key.left || Key.right || Key.up || Key.down)){
			hopAnim = 0;
		}else{
			hopAnim = (hopAnim+1)%6;
		}
		player.regY = (hopAnim<3) ? 200 : 206;

	};

	return player;

})();

var worldX = 0;

function render(){

	// Clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// World Camera Position
	ctx.save();
	ctx.translate(-worldX,0);

	// Draw BG
	background.draw(ctx);

	// Draw Player
	player.update();
	player.draw(ctx);
	if(player.y<20){ player.y=20; }
	if(player.y>480){ player.y=480; }
	if(player.x<worldX){
		player.x=worldX;
	}
	if(player.x>worldX+640){
		player.x = worldX+640;
	}
	if(player.x>worldX+320){
		worldX = player.x-320;
		if(worldX>640) worldX=640;
	}

	// World Camera Position
	ctx.restore();

	// Your Camera Position
	var x = Mouse.x;
	if(x<cam.width/2) x=cam.width/2;
	if(x>canvas.width-cam.width/2) x=canvas.width-cam.width/2;
	var y = Mouse.y;
	if(y<cam.height/2) y=cam.height/2;
	if(y>canvas.height-cam.height/2) y=canvas.height-cam.height/2;
	cam.x = x;
	cam.y = y;

	// Your Camera frame
	ctx.beginPath();
	ctx.rect(cam.x-cam.width/2, cam.y-cam.height/2, cam.width, cam.height);
	if(cam.flash>0.01){
		ctx.fillStyle = 'rgba(255,255,255,'+cam.flash+')';
		ctx.fill();
		cam.flash *= 0.9;
	}else{
		cam.flash = 0;
	}
	var left = cam.x-cam.width/2-2;
	var right = cam.x+cam.width/2+2;
	var top = cam.y-cam.height/2-2;
	var bottom = cam.y+cam.height/2+2;
	ctx.beginPath();
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'rgba(0,0,0,0.2)';
	ctx.moveTo(left,top+50); ctx.lineTo(left,top); ctx.lineTo(left+50,top);
	ctx.moveTo(right-50,top); ctx.lineTo(right,top); ctx.lineTo(right,top+50);
	ctx.moveTo(right,bottom-50); ctx.lineTo(right,bottom); ctx.lineTo(right-50,bottom);
	ctx.moveTo(left+50,bottom); ctx.lineTo(left,bottom); ctx.lineTo(left,bottom-50);
	ctx.stroke();
	/*ctx.beginPath();
	ctx.fillStyle = 'rgba(0,0,0,0.2)';
	ctx.arc(cam.x, cam.y, 4, 0, 2 * Math.PI, false);
	ctx.fill();*/

}

// ANIMATION LOOP //

window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame || function(callback){ window.setTimeout(callback,1000/60); };
(function animloop(){
	requestAnimFrame(animloop);
	render();
})();

