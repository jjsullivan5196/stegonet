function check(ev) {
	checkOld = inImg.getImageData(0, 0, org.width, org.height).data; checkNew = outImg.getImageData(0, 0, org.width, org.height).data; count = 0;
	for(var i = 0; i < (checkOld.length/4); i++) {
		oldColor = getPixel(checkOld, i);
		newColor = getPixel(checkNew, i);
		if((oldColor[0] != newColor[0]) || (oldColor[1] != newColor[1]) || (oldColor[2] != newColor[2]) || (oldColor[3] != newColor[3])) count++;
	} console.log("Pixel differences found: " + count);
}