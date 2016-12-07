function randFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rainbow(step, numOfSteps) {
	// // return 'black';

	// // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
	// // Adam Cole, 2011-Sept-14
	// // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
	var r, g, b;
	var h = step / numOfSteps;
	var i = ~~(h * 6);
	var f = h * 6 - i;
	var q = 1 - f;
	switch(i % 6){
		case 0: r = 1; g = f; b = 0; break;
		case 1: r = q; g = 1; b = 0; break;
		case 2: r = 0; g = 1; b = f; break;
		case 3: r = 0; g = q; b = 1; break;
		case 4: r = f; g = 0; b = 1; break;
		case 5: r = 1; g = 0; b = q; break;
	}
	var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
	return (c);

	// var value = Math.random() * 0xFF | 0;
	// var grayscale = (value << 16) | (value << 8) | value;
	// var color = '#' + grayscale.toString(16);
	// return color;
}

function randColor() {
	// return 'white';
	return rainbow(Math.random(), Math.random());
}

function render()
{
	// create svg drawing
	var svgEl = document.createElement('div');
	svgEl.className = 'art';
	document.body.appendChild(svgEl);
	var draw = SVG(svgEl);

	var rect = draw.rect(100, 100);

	draw.viewbox({ x:0, y:0, width:100, height:100 });

	var group = draw.group();

	rect.fill({ color:'black' });
	// group.clear();

	var numLines = randInt(1, 30);
	// console.log(numLines);
	for(var k = 0, total = numLines; k < total; k++)
	{
		// console.log(k, total);

		try
		{
			switch(randInt(0, 7))
			{
				case 0:
				case 1:
					var x1 = randInt(-100, 200);
					var y1 = randInt(-100, 200);
					var x2 = randInt(-100, 200);
					var y2 = randInt(-100, 200);
					var w = randFloat(0.01, 0.2);
					var c = randFloat(0, 0xFFFFFF);

					group.line(x1, y1, x2, y2).stroke({ width:w, color:randColor() });
					break;

				case 2:
					var r = randInt(1, 50);
					// r = 10;
					var w = randFloat(0.01, 0.2);
					var x = randInt(0, 100);
					var y = randInt(0, 100);
					var s;
					var c;
					var sw;

					if(randInt(0, 1))
					{
						s = 'white';
						c = 'black';
						sw = randFloat(0.01, 0.2);
					}
					else
					{
						c = s = randColor();
						sw = 0.01;
					}

					group.circle(r).stroke({ width:sw, color:s }).fill({ color:c }).move(x - r / 2, y - r / 2);
					break;

				case 3:
				case 4:
				case 5:
					var w = randInt(1, 100);
					var h = randInt(1, 100);
					var d = randInt(0, 360);
					var s;
					var c;
					var sw;

					if(randInt(0, 1))
					{
						s = 'white';
						c = 'black';
						sw = randFloat(0.01, 0.2);
					}
					else
					{
						c = s = randColor();
						sw = 0.01;
					}

					group.rect(w, h).stroke({ width:sw, color:s }).fill({ color:c }).move(randInt(-110, 200), randInt(-110, 200)).rotate(d);
					break;

				case 6:
					var numPoints = randInt(3, 20);
					var points = '';
					for(var i = 0, len = numPoints; i < len; i++)
					{
						var x = randInt(-100, 200);
						var y = randInt(-100, 200);
						points += x + "," + y + " ";
					}

					if(randInt(0, 1))
					{
						s = 'white';
						c = 'black';
						sw = randFloat(0.01, 0.2);
					}
					else
					{
						c = s = randColor();
						sw = 0.01;
					}

					group.polygon(points).fill({ color:c }).stroke({ width:sw, color:s });
					break;

				case 7:
					pathStr = 'M ' + randInt(-100, 200) + ' ' + randInt(-100, 200) + ' ';

					var numPoints = randInt(3, 3);
					for(var i = 0, len = numPoints; i < len; i++)
					{
						pathStr += 'C ' + randInt(-100, 200) + ' ' + randInt(-100, 200) + ' ' + randInt(-100, 200) + ' ' + randInt(-100, 200) + ' ' + randInt(-100, 200) + ' ' + randInt(-100, 200) + ' ';
					}

					if(randInt(0, 1))
					{
						s = 'white';
						c = 'black';
						sw = randFloat(0.01, 0.2);
					}
					else
					{
						c = s = randColor();
						sw = 0.01;
					}

					group.path(pathStr).fill({opacity:0}).stroke({width:sw, color:s});
					break;
			}
		}
		catch(e) {
		}

	}

	return svgEl.childNodes[0];
}

function makePng(el) {
	// console.log('mp', el);
	var svgString = new XMLSerializer().serializeToString(el);
	// console.log('svgString', svgString);

	var canvas = document.createElement("canvas");
	canvas.width = 2000;
	canvas.height = 2000;
	var ctx = canvas.getContext("2d");
	var DOMURL = self.URL || self.webkitURL || self;
	var img = new Image();
	// document.body.appendChild(img);
	var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
	var url = DOMURL.createObjectURL(svg);
	// console.log(url);
	img.onload = function() {
		ctx.drawImage(img, 0, 0);
		var png = canvas.toDataURL("image/png");
		// var pngContainer = document.createElement('div');
		// document.body.appendChild(pngContainer);
		// pngContainer.innerHTML = '<img src="'+png+'"/>';
		DOMURL.revokeObjectURL(png);

		var pom = document.createElement('a');
		// pom.setAttribute('href', 'data:application/octet-stream,' + encodeURIComponent(canvas.toDataURL("image/png")));
		pom.setAttribute('href', canvas.toDataURL("image/png"));
		pom.setAttribute('download', 'art_' + Date.now() + '.png');
		pom.style.display = 'none';
		document.body.appendChild(pom);
		pom.click();
		document.body.removeChild(pom);
	};
	img.src = url;


}


// setInterval((function() {
// 	var svgs = document.getElementsByClassName('art');
// 	if(svgs.length > 0) {
// 		for(var i = 0; i < svgs.length; i++)
// 		{
// 			svgs[i].parentElement.removeChild(svgs[i]);
// 		}
// 	}

// 	try
// 	{
// 		el = render();
// 	}
// 	catch(e)
// 	{

// 	}


// }).bind(this), 100);





// var numRenders = 1;
var numRenders = 100;
for(var i = 0, len = numRenders; i < len; i++)
{
	el = render();
	el.addEventListener('click', (function(svgEl) {
		makePng(svgEl);
	}).bind(this, el));

}