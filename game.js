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

// CLICK //

var tweetDOM = document.getElementById("tweet");
var lastPhoto;
window.onclick = function(){

	// Get image data
	var imageData = ctx.getImageData(cam.x-cam.width/2, cam.y-cam.height/2, cam.width, cam.height);

	// Snap photo
	var photo = document.getElementById("photo");
	photo.width = cam.width;
	photo.height = cam.height;
	photo.getContext("2d").putImageData(imageData,0,0);

	// HACK: The text on this photo
	var stats = document.getElementById("stats");
	stats.innerHTML = "1,000,000 RETWEETS<br>10,000,000 FAVORITES";
	tweetDOM.style.left = "640px";

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
var placekitten = document.getElementById("placekitten");
function render(){

	// Clear
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw BG
	ctx.drawImage(placekitten,0,0);

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

