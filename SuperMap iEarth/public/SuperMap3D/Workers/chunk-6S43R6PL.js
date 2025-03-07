import{a as e}from"./chunk-NUC3LT2W.js";function t(r){this.name="RuntimeError",this.message=r;var o;try{throw new Error}catch(s){o=s.stack}this.stack=o}e(Object.create)&&(t.prototype=Object.create(Error.prototype),t.prototype.constructor=t);t.prototype.toString=function(){var r=this.name+": "+this.message;return e(this.stack)&&(r+=`
`+this.stack.toString()),r};var a=t;export{a};
