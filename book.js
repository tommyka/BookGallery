(function(window, undefined){
	'use strict';

	var init = function(tar){
		var target = tar;

		var canvasList = new Array(2);
		var contextList = new Array(2);

		var width =  200;
		var pagewidth = 100;
		var height = 200;
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

				for(var i = 0; i < 2; i++){
					var canvas = canvasList[i];
					canvas.width = pagewidth;
					canvas.height = h;
					canvas.className= "test";
					console.log(canvas);
					console.dir(canvas);

					if(i % 2){
						canvas.style.left = pagewidth+"px";
					}
				}
			},
			render: function(img1, img2){
				var ctx;
				for(var i = 0; i < contextList.length; i ++){
					ctx = contextList[i];

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
						c.style.webkitTransform = "rotateY("+count*(i%2?1:-1)+"deg)";
					}
					count = (count+1)%360;
				},1000/30);
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