var ALPHA = 255;

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
	var spacer = base - 1; var outColor = [0, 0, 0, ALPHA];
	for(var i = 0; i < 3; i++)
		outColor[i] = ((baseColor[i] < spacer) ? (baseColor[i] + dataColor[i]) : ((baseColor[i] - spacer) + dataColor[i]));
	return outColor;
}
function retrieveColor(finalColor, baseColor, base) {
	var spacer = base - 1; var outColor = [0, 0, 0, ALPHA];
	for(var i = 0; i < 3; i++)
		outColor[i] = ((baseColor[i] < spacer) ? (finalColor[i] - baseColor[i]) : (finalColor[i] + spacer - baseColor[i]));
	return outColor;
}
function avgColor(col1, col2) {
	var outColor = [0, 0, 0, ALPHA];
	for(var i = 0; i < 3; i++)
		outColor[i] = parseInt((col1[i] + col2[i])/2);
	return outColor;
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