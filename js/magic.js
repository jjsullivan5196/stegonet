function determineBestChannel(fileSize, imageX, imageY)
{
	var s = 0;
	for(var x = 4; x <= imageX * imageY; x++)
	{
		if(x%2 == 0)
		{
			s++;
		}
	}
	if(s < fileSize)
	{
		return -1;
	}
	var best = 2;//max
	for (var x = 3; x <= 20; x++)
	{
		var next = ((imageX*imageY) - 3) / x;
		if(next > fileSize)
		{
			best = x;
		}
		else
		{
			break;
		}	
	}
	return best;
}

function scanXth(data)
{
	for (var xth = 2; xth <= 20; xth++)// in range(2, 21):
	{
		//console.log("--------------------------------------------------------------------")
		//prvar("Checking channel " + str(xth))
		var arr = new Array();
		for(var i = 4; arr.length < 300; i++) {
			if(xthPattern(i, xth)) {
				var	baseColor	=	avgColor(getPixel(data, (i-1)), getPixel(data, (i+1))),
					dataColor	=	retrieveColor(getPixel(data, i), baseColor, 7),
					inData		=	rgbaToVal(dataColor, 7);
				arr.push(inData);
			}
		}
		//Split off the non-filename component
		try{
			//////////////Filename Length Validity Check////////////
			if(arr[0] > 300 || arr[0] < 1)
			{
				throw "Filename Too Long or too short" + arr[0];
			}
			//////////////////////////////////////////////////////////////////////////////////////
			rawName = arr.slice(1, arr[0] + 1)
			////////////////Filename Prvarability Check////////////////
			for(var i = 0; i < rawName.length; i++)
			{
				if(rawName[i] < 32 || rawName[i] > 126)
				{
					throw "Unprintable character";
				}
			}
			//////////////////////////////////////////////////////////////////////////////////////
			return (xth)
		}catch(e)
		{
			//console.log(e)
			continue
		}
	}
	return (0)
}