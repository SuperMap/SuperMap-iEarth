const setFont = () => {
	const windowInfo = {
		width: window.innerWidth,
		hight: window.innerHeight
	}
	console.log("Browser-Size:",windowInfo);
	let html = document.getElementsByTagName('html')[0];
	var w = html.clientWidth,
	  h = html.clientHeight;
	// html.style.fontSize = w > h ? (w / 1536) * 100 + 'px' : (w / 731) * 100 + 'px';
	html.style.fontSize = w > h ? (w / 1440) * 100 + 'px' : (w / 900) * 100 + 'px';
    console.log("Font-Size:",html.style.fontSize)
};



const debounce = (fn:any, delay:any) => {
	let timer:any;
	return function() {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn();
		}, delay);
	}
};

export const setFontImmediately = debounce(setFont, 500);



