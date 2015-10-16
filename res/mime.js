var MIME = {
	exTable : {
		'jpeg'	:	'image/jpeg',
		'jpg'	:	'image/jpeg',
		'png'	:	'image/png',
		'webm'	:	'video/webm',
		'txt'	:	'text/plain'
	},
	get : function(fname) {
		if(fname.indexOf('.') >= 0) {
			var ext = fname.substring((fname.lastIndexOf('.')) + 1);
			return (!(ext in this.exTable) ? (this.exTable['txt']) : (this.exTable[ext]));
		}
		else return this.exTable['txt'];
	}
};