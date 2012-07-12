(function(window, undefined){
	'use strict';

	var init = function(tar){
		var target = tar;

		var canvasList = new Array(2);
		var contextList = new Array(2);

		var width =  200;
		var pagewidth = 100;
		var height = 200;

		var events = ["mousedown", "mousemove", "mouseup"];
		//var events = ["touchstart", "touchmove", "touchend"];
/*
		var img = new Image();
		img.onLoad = function(){
			console.log("load");
		}
		img.src="images/img1.jpg";
*/
		var img = loadimage("images/img1.jpg", function(){obj.render(this)});

		var obj = {
			initCanvases:function(){
				for(var i = 0; i<2; i++){
					var canvas = document.createElement('canvas');
					canvas.style.position = "absolute";

					target.appendChild(canvas);
					var ctx = canvas.getContext('2d');

					canvasList[i] = canvas;
					contextList[i] = ctx;

				}
			},
			resize: function(w, h){
				pagewidth = Math.floor(w /2);
				width = w;
				height = h;

				var halfheight = (height*0.5)

				target.style.webkitPerspectiveOrigin = pagewidth+"px "+halfheight+"px";

				for(var i = 0; i < 2; i++){
					var canvas = canvasList[i];
					canvas.width = pagewidth;
					canvas.height = h;
					canvas.addEventListener(events[0], dragStart);
					//canvas.className= "test";
					canvas.style.webkitTransformOrigin = (i%2 ? "0px "+halfheight+"px" : pagewidth+"px "+halfheight+"px");
					console.log(canvas);
					console.dir(canvas);

					if(i % 2){
						canvas.style.left = pagewidth+"px";
					}
				}
			},
			render: function(img1, img2){
				var ctx;
				console.log(pagewidth, height);
				for(var i = 0; i < contextList.length; i ++){
					ctx = contextList[i];
					ctx.clearRect(0, 0, pagewidth, height);

					ctx.fillStyle = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";  
        			ctx.fillRect (0, 0, pagewidth, height);  
				}

				if(img1){

					var imgW = img1.width*0.5;
					var imgH = img1.height;
					var factor = Math.min(pagewidth/imgW, height/imgH);

					var dnW = imgW*factor;
					var dnH = imgH*factor;

					contextList[0].drawImage(img1, 0, 0, imgW, imgH, Math.floor(pagewidth-dnW), Math.floor((height-dnH)*0.5), dnW, dnH);
					contextList[1].drawImage(img1, imgW, 0, imgW, imgH, 0, Math.floor((height-dnH)*0.5), dnW, dnH);

				}
			},
			stop: function(){
				clearInterval(id);
			},
			start: function(){
				id = setInterval(function(){
					for(var i = 0, length = canvasList.length; i < length; i++){
						var c = canvasList[i];
						c.style.webkitTransform = "rotateY("+count*(i%2?-1:1)+"deg)";
					}
					count = (count+1)%360;
				},1000/30);
			}
		}

		var step = function(){
			var target = canvasList[rightside ? 1: 0];
			target.style.webkitTransform = "rotateY("+((movingprops.dif/width)*180)+"deg)";
		}

		var animate = function(){

		}

		var movingprops = {start: 0, dif:0, rangeStart: 0, rangeStop: 1};
		var rightside = true;

		var dragStart = function(e){
			console.log("start:", e);
			rightside = (canvasList.indexOf(this) % 2) ? true : false;

			movingprops.rangeStart = rightside ? -width: 0;
			movingprops.rangeStop = rightside ? 0: width;
			movingprops.start = e.pageX;
			window.addEventListener(events[1], dragMove);
			window.addEventListener(events[2], dragEnd);

			e.preventDefault(); // disable the native scroling of pages on IOS
		}
		var dragMove = function(e){
			//console.log("move:", e);
			var dif = e.pageX-movingprops.start;
			if(dif < movingprops.rangeStart){
				dif = movingprops.rangeStart;
			}else if(dif > movingprops.rangeStop){
				dif = movingprops.rangeStop;
			}
			movingprops.speed = dif -movingprops.dif;
			movingprops.dif = dif;
			requestAnimationFrame(step);
		}
		var dragEnd = function(e){
			//console.log("end:",e);
			window.removeEventListener(events[1], dragMove);
			window.removeEventListener(events[2], dragEnd);

			console.log(movingprops.rangeStop, movingprops.dif, movingprops.speed);


		}

		obj.initCanvases();
		obj.resize(600, 600);
		obj.render();
		var count = 0;
		var id = 0
		return obj;
	};

	function loadimage(url, callback){
		var img = new Image();
		img.onload = callback;
		img.src = url;
		if(img.complete){
			console.log("is complete");
			callback();
		}

		return img;
	}

	window.Book = init;
})(window);

//request animation shim
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());