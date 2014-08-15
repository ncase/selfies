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
	while(socialDOM.children.length>4){
		socialDOM.removeChild(socialDOM.children[0]);
	}

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
		ctx.translate(self.x-self.regX, self.y-self.regY);
		ctx.scale(self.scaleX,self.scaleY);
		ctx.drawImage(self.image,0,0);
		ctx.restore();
	};

}

var player = new Sprite(reporterImage);
player.x = 200;
player.y = 200;

function render(){

	// Clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw BG
	ctx.fillStyle = "#DA7A55";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	// Draw Player
	player.draw(ctx);

	// Camera Position
	var x = Mouse.x;
	if(x<cam.width/2) x=cam.width/2;
	if(x>canvas.width-cam.width/2) x=canvas.width-cam.width/2;
	var y = Mouse.y;
	if(y<cam.height/2) y=cam.height/2;
	if(y>canvas.height-cam.height/2) y=canvas.height-cam.height/2;
	cam.x = x;
	cam.y = y;

	// Camera frame
	ctx.beginPath();
	ctx.rect(cam.x-cam.width/2-4, cam.y-cam.height/2-4, cam.width+8, cam.height+8);
	if(cam.flash>0.01){
		ctx.fillStyle = 'rgba(255,255,255,'+cam.flash+')';
		ctx.fill();
		cam.flash *= 0.9;
	}else{
		cam.flash = 0;
	}
	ctx.lineWidth = 4;
	ctx.strokeStyle = 'rgba(0,0,0,0.2)';
	ctx.stroke();

}

// ANIMATION LOOP //

window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame || function(callback){ window.setTimeout(callback,1000/60); };
(function animloop(){
	requestAnimFrame(animloop);
	render();
})();

