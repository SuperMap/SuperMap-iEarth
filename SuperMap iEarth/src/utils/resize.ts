const setFont = () => {
	// const windowInfo = {
	// 	width: window.innerWidth,
	// 	hight: window.innerHeight
	// }
	// console.log("Browser-Size:",windowInfo);
	let html = document.getElementsByTagName('html')[0];
	let w = html.clientWidth
	let h = html.clientHeight;
	console.log(`width:${w};height:${h}`);
	// html.style.fontSize = w > h ? (w / 1536) * 100 + 'px' : (w / 731) * 100 + 'px';
	// html.style.fontSize = w > h ? (w / 1903) * 100 + 'px' : (w / 967) * 100 + 'px';

	// 兼容PC端和移动端：大于1300默认为PC，固定根字体大小为100px,小于则设为移动端，根据其具体尺寸设置根字体
	if(Number(w) > 1300 || Number(h) > 1300){ 
		html.style.fontSize = "100px";
	}else{
		html.style.fontSize = w > h ? (w / 1536) * 100 + 'px' : (w / 731) * 100 + 'px';
	}
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



