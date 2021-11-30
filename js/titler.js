function titler() {
	var titleArray = [
		"The world's greatest image stegonography tool.",
		"Your secrets are not safe with us.",
		"Shame.",
		"Why are you here?",
		"Your packets have been diverted, consequences will never be the same.",
		"Nobody cared what the file was until you hid it."
	];
	document.title = "Steganosaurus: " + titleArray[parseInt(Math.random() * titleArray.length)];
}
