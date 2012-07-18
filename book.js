(function(window, undefined){
	'use strict';

	var init = function(tar){
		var target = tar;

		var canvasList = new Array(6);
		var contextList = new Array(6);

		var width =  200;
		var pagewidth = 100;
		var height = 200;

		var events = navigator.userAgent.toLowerCase().indexOf("ipad") != -1  ? ["touchstart", "touchmove", "touchend"] : ["mousedown", "mousemove", "mouseup"];
/*
		var img = new Image();
		img.onLoad = function(){
			console.log("load");
		}
		img.src="images/img1.jpg";
*/
		var img = loadimage("images/img1.jpg", function(){if(img.complete && img2.complete){obj.render(img, img2)}});
		var img2 = loadimage("images/img2.jpg", function(){if(img.complete && img2.complete){obj.render(img, img2)}});

		var obj = {
			initCanvases:function(){
				for(var i = 0; i<6; i++){
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

				for(var i = 0; i < canvasList.length; i ++){
					var canvas = canvasList[i];
					canvas.width = pagewidth;
					canvas.height = h;
					canvas.addEventListener(events[0], dragStart);
					//canvas.className= "test";
					canvas.style.webkitTransformOrigin = (i%2 ? "0px "+halfheight+"px" : pagewidth+"px "+halfheight+"px");

					if(i % 2){
						canvas.style.left = pagewidth+"px";
					}
				}

			},
			render: function(center, front, back){
				var ctx;

				for(var i = 0; i < contextList.length; i ++){
					ctx = contextList[i];
					ctx.clearRect(0, 0, pagewidth, height);

					ctx.fillStyle = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";  
        			ctx.fillRect (0, 0, pagewidth, height);  
				}

				if(center){
					drawToPlanes(center, contextList[2], contextList[3]);
				}
				if(front){
					drawToPlanes(front, contextList[0], contextList[1]);
					drawToPlanes(front, contextList[4], contextList[5]);
				}
			},
			next:function(){

			},
			prev:function(){

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
		var difval;
		var index;
		var page;
		var step = function(){

			var targetid = Math.floor((difval+1)*2)+1;

			if(index !== targetid && !isNaN(targetid) ){
				index = targetid;
				if(page !== undefined){

					page.style.zIndex = 3;
					setVisiblity(page, false);
				}
				page = canvasList[targetid];
				
				page.style.zIndex = 10;
				setVisiblity(page, true);

			}
			difval = (movingprops.dif/width);
			page.style.webkitTransform = "rotateY("+(-difval *180+(targetid == 2 || targetid == 3 ? 0 : -180))+"deg)";
			//target.style.webkitTransform = "rotateY("+ (-difval*180)+"deg)";
		}

		var animate = function(){

		}

		var movingprops = {start: 0, dif:0, rangeStart: 0, rangeStop: 1};
		var rightside = true;

		var dragStart = function(e){
			console.log("start:", e);
			rightside = (canvasList.indexOf(this) % 2) ? true : false;

			movingprops.rangeStart = -width;
			movingprops.rangeStop = width
			movingprops.start = e.pageX;
			window.addEventListener(events[1], dragMove);
			window.addEventListener(events[2], dragEnd);

			e.preventDefault(); // disable the native scroling of pages on IOS
		}
		var dragMove = function(e){
			//console.log("move:", e);
			var dif = movingprops.start-e.pageX;

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

		var drawToPlanes = function(img, c1,c2){
			var imgW = img.width*0.5;
			var imgH = img.height;
			var factor = Math.min(pagewidth/imgW, height/imgH);

			var dnW = imgW*factor;
			var dnH = imgH*factor;

			c1.drawImage(img, 0, 0, imgW, imgH, Math.floor(pagewidth-dnW), Math.floor((height-dnH)*0.5), dnW, dnH);
			c2.drawImage(img, imgW, 0, imgW, imgH, 0, Math.floor((height-dnH)*0.5), dnW, dnH);
		}
		var setVisiblity = function(target, value){
			if(value !== target.visible){
				target.style.visiblity = value ? "visible" : "hidden";
				target.visible = value;
			}
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