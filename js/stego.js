function selectImage(ev) {
	var	canvas	=	document.getElementById('stegoImage'),
		ctx		=	canvas.getContext('2d'),
		imgFile	=	ev.target.files[0],
		reader	=	new FileReader();
	
	reader.onload = function() {
		im = new Image();
		imgURL = reader.result;
		im.onload = function() {
			canvas.width = im.width;
			canvas.height = im.height;
			ctx.name = imgFile.name;
			ctx.drawImage(im, 0, 0);
		};
		im.src = imgURL;
	};
	reader.readAsDataURL(imgFile);
}

function inject(ev) {
	var	file	=	document.getElementById('inFile').files[0],
		err		=	document.getElementById('stegoErr');
	if(!file) { //Check if there's a file to inject
		err.innerHTML = "Please select a file first.";
		return false;
	}
	var	canvas		=	document.getElementById('stegoImage'),
		ctx			=	canvas.getContext('2d'),
		file		=	document.getElementById('inFile').files[0],
		link		=	document.getElementById('stegoFile'),
		imageData	=	ctx.getImageData(0, 0, canvas.width, canvas.height),
		newData		=	ctx.createImageData(canvas.width, canvas.height),
		data		=	imageData.data,
		ndata		=	newData.data,
		xth			=	parseInt(document.getElementById('xthPixel').value),
		reader		=	new FileReader();
		
	if(link.href) URL.revokeObjectURL(link.href);
	
	reader.onload = function(e) {
		var	fileCont	=	Array.from(new Uint8Array(e.target.result)),
			fileName	=	[file.name.length];
		for(var i = 0; i < file.name.length; i++) fileName.push(file.name.charCodeAt(i));
		var	fileBytes	=	new Uint8Array(fileName.concat(fileCont)),
			byteNum		=	fileBytes.length;
			
		if(xth < 3) xth = determineBestChannel(byteNum, canvas.width, canvas.height);
		
		if(!checkSize(byteNum, (data.length/4), xthPattern, xth)) {
			console.log("In file too large to inject.");
			err.innerHTML = "Jeeze, that file is too big for this image! Try again.";
			return false;
		}
		else err.innerHTML = "";
		
		console.log("File name: " + file.name + "\nBytes to be injected: " + byteNum);
		
		var	ones		=	byteNum%1000,
			millions	=	(byteNum - (byteNum%1000000))/1000000,
			thousands	=	(byteNum - (byteNum%1000) - (millions * 1000000))/1000,
			col1		=	valToRGBA(ones, 10),
			col2		=	valToRGBA(thousands, 10),
			col3		=	valToRGBA(millions, 10);
		setPixel(ndata, 0, injectColor(getPixel(data, 3), col1, 10));
		setPixel(ndata, 1, injectColor(getPixel(data, 3), col2, 10));
		setPixel(ndata, 2, injectColor(getPixel(data, 3), col3, 10));
		setPixel(ndata, 3, getPixel(data, 3));

		for(var i = 4, j = 0; i < (data.length/4); i++) {
			if( (xthPattern(i, xth)) && (j < fileBytes.length) ) {
				var	baseColor	=	avgColor(getPixel(data, (i-1)), getPixel(data, (i+1))),
					dataColor	=	valToRGBA(fileBytes[j], 7),
					finalColor	=	injectColor(baseColor, dataColor, 7);
				setPixel(ndata, i, finalColor);
				j++;
			}
			else setPixel(ndata, i, getPixel(data, i));
		}
		ctx.putImageData(newData, 0, 0);
		
		link.href = URL.createObjectURL(dataURLToBlob(canvas.toDataURL()));
		link.download = "injected.png";
		link.innerHTML = "File injected, click to save new image";
	};
	reader.readAsArrayBuffer(file);
}
function retrieve(ev) {
	var	canvas		=	document.getElementById('stegoImage'),
		ctx			=	canvas.getContext('2d'),
		link		=	document.getElementById('stegoFile'),
		xth			=	parseInt(document.getElementById('xthPixel').value),
		imageData	=	ctx.getImageData(0, 0, canvas.width, canvas.height),
		data		=	imageData.data,
		reader		=	new FileReader(),
		fileName	=	'',
		buffer		=	[];
	
	var	col1	=	retrieveColor(getPixel(data, 0),getPixel(data, 3),10),
		col2	=	retrieveColor(getPixel(data, 1),getPixel(data, 3),10),
		col3	=	retrieveColor(getPixel(data, 2),getPixel(data, 3),10),
		byteNum	=	(rgbaToVal(col3, 10)*1000000) + (rgbaToVal(col2, 10)*1000) + rgbaToVal(col1, 10);
		
	if(xth < 3) xth = scanXth(data);
	
	for(var i = 4; buffer.length < byteNum; i++) {
		if(xthPattern(i, xth)) {
			var	baseColor	=	avgColor(getPixel(data, (i-1)), getPixel(data, (i+1))),
				dataColor	=	retrieveColor(getPixel(data, i), baseColor, 7),
				inData		=	rgbaToVal(dataColor, 7);
			buffer.push(inData);
		}
	}
	
	var nameBytes = buffer.splice(0, (buffer[0] + 1)); nameBytes.shift();
	for(var i = 0; i < (nameBytes.length); i++) fileName += String.fromCharCode(nameBytes[i]);
	
	console.log("File name: " + fileName + "\nBytes retrieved: " + buffer.length);
	
	var	byteBuffer	=	new ArrayBuffer(buffer.length),
		byteView	=	new Uint8Array(byteBuffer);
	for(var i = 0; i < buffer.length; i++) byteView[i] = buffer[i];
	var newFile = new Blob([byteBuffer], {type:MIME.get(fileName)});
	
	if(link.href) URL.revokeObjectURL(link.href);
	link.href = URL.createObjectURL(newFile);
	link.download = fileName;
	link.innerHTML = String("Retrieved: " + fileName);
}

window.onload = function() {
	titler();
	document.getElementById('inImage').addEventListener('change', selectImage, false);
	document.getElementById('stegoInject').addEventListener('click', inject, false);
	document.getElementById('stegoRetrieve').addEventListener('click', retrieve, false);
};