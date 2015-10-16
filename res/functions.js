var fileExt = {
	'jpeg'	:	'image/jpeg',
	'jpg'	:	'image/jpeg',
	'png'	:	'image/png',
	'webm'	:	'video/webm',
	'txt'	:	'text/plain'
};
var ALPHA = 255;

function getMime(fname) {
	/*var ext = new String();
	for(var i = (fname.length - 1); fname[i] != '.'; i--) {
		ext = fname[i].toLowerCase() + ext;
		if(i == 0) return fileExt['txt'];
	}
	if(!(ext in fileExt)) return fileExt['txt'];
	else return fileExt[ext];*/
	if(fname.indexOf('.') >= 0) {
		var ext = fname.substring((fname.lastIndexOf('.')) + 1);
		return (!(ext in fileExt) ? (fileExt['txt']) : (fileExt[ext]));
	}
	else return fileExt['txt'];
}
function dataURLToBlob(dataURL) {
	var BASE64_MARKER = ';base64,';
	if (dataURL.indexOf(BASE64_MARKER) == -1) {
		var parts = dataURL.split(',');
		var contentType = parts[0].split(':')[1];
		var raw = decodeURIComponent(parts[1]);

		return new Blob([raw], {type: contentType});
	}

	var parts = dataURL.split(BASE64_MARKER);
	var contentType = parts[0].split(':')[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;

	var uInt8Array = new Uint8Array(rawLength);

	for (var i = 0; i < rawLength; ++i) {
		uInt8Array[i] = raw.charCodeAt(i);
	}

	return new Blob([uInt8Array], {type: contentType});
}

function setPixel(data, idx, color) {
	idx = idx*4;
	for(var i = 0; i < color.length; i++) data[idx+i] = color[i];
}
function getPixel(data, idx) {
	idx = idx*4;
	return [data[idx+0],data[idx+1],data[idx+2],data[idx+3]];
}

function valToRGBA(val, base) {
	color = [0, 0, 0, ALPHA];
	
	hundreds = (val - (val%Math.pow(base, 2)))/Math.pow(base, 2);
	color[2] = parseInt(hundreds);
	val -= hundreds * Math.pow(base, 2);
	
	tens = (val - (val%base))/base;
	color[1] = parseInt(tens);
	val -= tens * base;
	
	color[0] = parseInt(val);
	return color;
}
function rgbaToVal(color, base) {
	return (color[0] + (color[1] * base) + (color[2] * Math.pow(base, 2)));
}
function injectColor(baseColor, dataColor, base) {
	var r = baseColor[0],g = baseColor[1],b = baseColor[2];
	var x = dataColor[0],y = dataColor[1],z = dataColor[2];
	var spacer = base - 1;

	r = ((r < spacer) ? (r + x) : ((r - spacer) + x));
	g = ((g < spacer) ? (g + y) : ((g - spacer) + y));
	b = ((b < spacer) ? (b + z) : ((b - spacer) + z));
	return [r, g, b, ALPHA];
}
function retrieveColor(finalColor, baseColor, base) {
	var r = finalColor[0],g = finalColor[1],b = finalColor[2];
	var x = baseColor[0],y = baseColor[1],z = baseColor[2];
	var spacer = base - 1;
	
	r = ((x < spacer) ? (r - x) : (r + spacer - x));
	g = ((y < spacer) ? (g - y) : (g + spacer - y));
	b = ((z < spacer) ? (b - z) : (b + spacer - z));
	return [r, g, b, ALPHA];
}
function avgColor(col1, col2) {
	var outCol = [];
	outCol.push(parseInt((col1[0] + col2[0])/2));
	outCol.push(parseInt((col1[1] + col2[1])/2));
	outCol.push(parseInt((col1[2] + col2[2])/2));
	outCol.push(ALPHA);
	return outCol;
}

function xthPattern(idx, xth) {
	if((idx + 1) % xth == 0) return true;
	else return false;
}
function checkSize(inBytes, imgLength, pattern, args) {
	var count = 0;
	for(var i = 4; i < imgLength; i++) if(pattern(i, args)) count++;
	if(count >= inBytes) return true;
	else return false;
}