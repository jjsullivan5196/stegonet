function titler() {
	var titleArray = [
		"The world's greatest image stegonography tool.",
		"Your secrets are not safe with us.",
		"Shame.",
		"Your number one source for evading the NSA.",
		"Big brother is watching.",
		"Images of your Gov. Weiner don't work.",
		"Use any image of the President for a surprise.",
		"Why are you here?",
		"We don't negotiate with terrorists.",
		"Your packets have been diverted, consequences will never be the same."
	];
	document.title = "Steganosaurus: " + titleArray[parseInt(Math.random() * titleArray.length)];
}