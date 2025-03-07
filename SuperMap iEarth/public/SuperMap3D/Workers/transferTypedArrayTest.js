typeof self>"u"&&(self={});self.onmessage=function(a){"use strict";var e=a.data.array,s=self.webkitPostMessage||self.postMessage;try{s({array:e},[e.buffer])}catch{s({})}};
