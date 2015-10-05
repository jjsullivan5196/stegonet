var file;

function selectImage(ev) {
	imgFile = ev.target.files[0];
	reader = new FileReader();
	reader.onload = function() {
		im = new Image();
		imgURL = reader.result;
		im.onload = function() {
			org.width = im.width;
			org.height = im.height;
			org.name = imgFile.name;
			inImg.drawImage(im, 0, 0);
		};
		im.src = imgURL;
	};
	reader.readAsDataURL(imgFile);
}

function selectFile(ev) { file = ev.target.files[0]; }

function inject(ev) {
	link = document.getElementById('rFile');
	URL.revokeObjectURL(link.href);
	reader = new FileReader();
	imageData = inImg.getImageData(0, 0, org.width, org.height);
	newData = inImg.createImageData(org.width, org.height);
	data = imageData.data;
	ndata = newData.data;
	reader.onload = function(e) {
		fileCont = Array.from(new Uint8Array(e.target.result));
		fileName = [file.name.length];
		for(var i = 0; i < file.name.length; i++) fileName.push(file.name.charCodeAt(i));
		fileBytes = new Uint8Array(fileName.concat(fileCont));
		byteNum = fileBytes.length;
		
		xth = parseInt(document.getElementById('xthPixel').value);
		
		if(!checkSize(byteNum, (data.length/4), xthPattern, xth)) {
			console.log("In file too large to inject.");
			document.getElementById('err').innerHTML = "Jeeze, that file is too big for this image! Try again.";
			return false;
		}
		else document.getElementById('err').innerHTML = "";
		
		console.log("File name: " + file.name + "\nBytes to be injected: " + byteNum);
		
		ones = byteNum%1000;
		millions = (byteNum - (byteNum%1000000))/1000000;
		thousands = (byteNum - (byteNum%1000) - (millions * 1000000))/1000;
		col1 = valToRGBA(ones, 10);
		col2 = valToRGBA(thousands, 10);
		col3 = valToRGBA(millions, 10);
		setPixel(ndata, 0, injectColor(getPixel(data, 3), col1, 10));
		setPixel(ndata, 1, injectColor(getPixel(data, 3), col2, 10));
		setPixel(ndata, 2, injectColor(getPixel(data, 3), col3, 10));
		setPixel(ndata, 3, getPixel(data, 3));
		
		for(var i = 4, j = 0; i < (data.length/4); i++) {
			if( (xthPattern(i, xth)) && (j < fileBytes.length) ) {
				baseColor = avgColor(getPixel(data, (i-1)), getPixel(data, (i+1)));
				dataColor = valToRGBA(fileBytes[j], 7);
				finalColor = injectColor(baseColor, dataColor, 7);
				setPixel(ndata, i, finalColor);
				j++;
			}
			else setPixel(ndata, i, getPixel(data, i));
		}
		inImg.putImageData(newData, 0, 0);
		
		outBlob = dataURLToBlob(org.toDataURL());
		link.href = URL.createObjectURL(outBlob);
		link.download = "injected.png";
		link.innerHTML = "File injected, click to save new image";
	};
	reader.readAsArrayBuffer(file);
}
function retrieve(ev) {
	imageData = inImg.getImageData(0, 0, org.width, org.height);
	data = imageData.data;
	reader = new FileReader();
	buffer = [];
	fileName = new String();
	
	col1 = retrieveColor(getPixel(data, 0),getPixel(data, 3),10);
	col2 = retrieveColor(getPixel(data, 1),getPixel(data, 3),10);
	col3 = retrieveColor(getPixel(data, 2),getPixel(data, 3),10);
	byteNum = (rgbaToVal(col3, 10)*1000000) + (rgbaToVal(col2, 10)*1000) + rgbaToVal(col1, 10);
	
	xth = parseInt(document.getElementById('xthPixel').value);
	
	for(var i = 4; buffer.length < byteNum; i++) {
		if(xthPattern(i, xth)) {
			baseColor = avgColor(getPixel(data, (i-1)), getPixel(data, (i+1)));
			dataColor = retrieveColor(getPixel(data, i), baseColor, 7);
			inData = rgbaToVal(dataColor, 7);
			buffer.push(inData);
			}
	}
	
	nameBytes = buffer.splice(0, (buffer[0] + 1)); nameBytes.shift();
	for(var i = 0; i < (nameBytes.length); i++) fileName += String.fromCharCode(nameBytes[i]);
	
	console.log("File name: " + fileName + "\nBytes retrieved: " + buffer.length);
	
	byteBuffer = new ArrayBuffer(buffer.length);
	byteView = new Uint8Array(byteBuffer);
	for(var i = 0; i < buffer.length; i++) byteView[i] = buffer[i];
	newFile = new Blob([byteBuffer], {type:getMime(fileName)});
	
	link = document.getElementById('rFile');
	URL.revokeObjectURL(link.href);
	link.href = URL.createObjectURL(newFile);
	link.download = fileName;
	link.innerHTML = String("Retrieved: " + fileName);
}
function check(ev) {
	checkOld = inImg.getImageData(0, 0, org.width, org.height).data; checkNew = outImg.getImageData(0, 0, org.width, org.height).data; count = 0;
	for(var i = 0; i < (checkOld.length/4); i++) {
		oldColor = getPixel(checkOld, i);
		newColor = getPixel(checkNew, i);
		if((oldColor[0] != newColor[0]) || (oldColor[1] != newColor[1]) || (oldColor[2] != newColor[2]) || (oldColor[3] != newColor[3])) count++;
	} console.log("Pixel differences found: " + count);
}

window.onload = function() {
	org = document.getElementById('Image');
	inImg = org.getContext('2d');
	document.getElementById('inImage').addEventListener('change', selectImage, false);
	document.getElementById('inFile').addEventListener('change', selectFile, false);
	document.getElementById('inject').addEventListener('click', inject, false);
	document.getElementById('retrieve').addEventListener('click', retrieve, false);
	//document.getElementById('check').addEventListener('click', check, false);
};

