define(["exports","./buildModuleUrl-9eef8841","./Cartesian3-3a8bdb0b","./Check-52a7d806","./when-92c6cf3c","./Cartesian2-b72655a5","./AttributeCompression-b5a80a71","./ComponentDatatype-98414d16","./Math-ecf82623","./FeatureDetection-cec0163f"],(function(e,t,o,i,r,n,a,s,c,m){"use strict";function u(e,t){i.o.typeOf.object("ellipsoid",e),this._ellipsoid=e,this._cameraPosition=new o.o,this._cameraPositionInScaledSpace=new o.o,this._distanceToLimbInScaledSpaceSquared=0,r.e(t)&&(this.cameraPosition=t)}Object.defineProperties(u.prototype,{ellipsoid:{get:function(){return this._ellipsoid}},cameraPosition:{get:function(){return this._cameraPosition},set:function(e){var t=this._ellipsoid.transformPositionToScaledSpace(e,this._cameraPositionInScaledSpace),i=o.o.magnitudeSquared(t)-1;o.o.clone(e,this._cameraPosition),this._cameraPositionInScaledSpace=t,this._distanceToLimbInScaledSpaceSquared=i}}});var p=new o.o;u.prototype.isPointVisible=function(e){return b(this._ellipsoid.transformPositionToScaledSpace(e,p),this._cameraPositionInScaledSpace,this._distanceToLimbInScaledSpaceSquared)},u.prototype.isScaledSpacePointVisible=function(e){return b(e,this._cameraPositionInScaledSpace,this._distanceToLimbInScaledSpaceSquared)};var d=new o.o;u.prototype.isScaledSpacePointVisiblePossiblyUnderEllipsoid=function(e,t){var o,i,n=this._ellipsoid;return r.e(t)&&t<0&&n.minimumRadius>-t?((i=d).x=this._cameraPosition.x/(n.radii.x+t),i.y=this._cameraPosition.y/(n.radii.y+t),i.z=this._cameraPosition.z/(n.radii.z+t),o=i.x*i.x+i.y*i.y+i.z*i.z-1):(i=this._cameraPositionInScaledSpace,o=this._distanceToLimbInScaledSpaceSquared),b(e,i,o)},u.prototype.computeHorizonCullingPoint=function(e,t,o){return S(this._ellipsoid,e,t,o)};var l=n.t.clone(n.t.UNIT_SPHERE);u.prototype.computeHorizonCullingPointPossiblyUnderEllipsoid=function(e,t,o,i){return S(y(this._ellipsoid,o,l),e,t,i)},u.prototype.computeHorizonCullingPointFromVertices=function(e,t,o,i,r){return v(this._ellipsoid,e,t,o,i,r)},u.prototype.computeHorizonCullingPointFromVerticesPossiblyUnderEllipsoid=function(e,t,o,i,r,n){return v(y(this._ellipsoid,r,l),e,t,o,i,n)};var h=[];u.prototype.computeHorizonCullingPointFromRectangle=function(e,r,a){i.o.typeOf.object("rectangle",e);var s=n.h.subsample(e,r,0,h),c=t.i.fromPoints(s);if(!(o.o.magnitude(c.center)<.1*r.minimumRadius))return this.computeHorizonCullingPoint(c.center,s,a)};var f=new o.o;function y(e,t,i){if(r.e(t)&&t<0&&e.minimumRadius>-t){var a=o.o.fromElements(e.radii.x+t,e.radii.y+t,e.radii.z+t,f);e=n.t.fromCartesian3(a,i)}return e}function S(e,t,n,a){i.o.typeOf.object("directionToPoint",t),i.o.defined("positions",n),r.e(a)||(a=new o.o);for(var s=N(e,t),c=0,m=0,u=n.length;m<u;++m){var p=P(e,n[m],s);if(p<0)return;c=Math.max(c,p)}return z(s,c,a)}var x=new o.o;function v(e,t,n,a,s,c){i.o.typeOf.object("directionToPoint",t),i.o.defined("vertices",n),i.o.typeOf.number("stride",a),r.e(c)||(c=new o.o),a=r.u(a,3),s=r.u(s,o.o.ZERO);for(var m=N(e,t),u=0,p=0,d=n.length;p<d;p+=a){x.x=n[p]+s.x,x.y=n[p+1]+s.y,x.z=n[p+2]+s.z;var l=P(e,x,m);if(l<0)return;u=Math.max(u,l)}return z(m,u,c)}function b(e,t,i){var r=t,n=i,a=o.o.subtract(e,r,p),s=-o.o.dot(a,r);return!(n<0?s>0:s>n&&s*s/o.o.magnitudeSquared(a)>n)}var T=new o.o,g=new o.o;function P(e,t,i){var r=e.transformPositionToScaledSpace(t,T),n=o.o.magnitudeSquared(r),a=Math.sqrt(n),s=o.o.divideByScalar(r,a,g);n=Math.max(1,n);var c=1/(a=Math.max(1,a));return 1/(o.o.dot(s,i)*c-o.o.magnitude(o.o.cross(s,i,s))*(Math.sqrt(n-1)*c))}function z(e,t,i){if(!(t<=0||t===1/0||t!=t))return o.o.multiplyByScalar(e,t,i)}var E=new o.o;function N(e,t){return o.o.equals(t,o.o.ZERO)?t:(e.transformPositionToScaledSpace(t,E),o.o.normalize(E,E))}var I=Object.freeze({NONE:0,BITS12:1}),C=new o.o,_=new o.o,B=new n.o,w=new m.p,H=new m.p,q=Math.pow(2,12);function M(e,t,i,n,a,s){var c,u,p,d=I.NONE;if(r.e(e)&&r.e(t)&&r.e(i)&&r.e(n)){var l=e.minimum,h=e.maximum,f=o.o.subtract(h,l,_),y=i-t;d=Math.max(o.o.maximumComponent(f),y)<q-1?I.BITS12:I.NONE,d=I.NONE,c=e.center,u=m.p.inverseTransformation(n,new m.p);var S=o.o.negate(l,C);m.p.multiply(m.p.fromTranslation(S,w),u,u);var x=C;x.x=1/f.x,x.y=1/f.y,x.z=1/f.z,m.p.multiply(m.p.fromScale(x,w),u,u),p=m.p.clone(n),m.p.setTranslation(p,o.o.ZERO,p),n=m.p.clone(n,new m.p);var v=m.p.fromTranslation(l,w),b=m.p.fromScale(f,H),T=m.p.multiply(v,b,w);m.p.multiply(n,T,n),m.p.multiply(p,T,p)}this.quantization=d,this.minimumHeight=t,this.maximumHeight=i,this.center=c,this.toScaledENU=u,this.fromScaledENU=n,this.matrix=p,this.hasVertexNormals=a,this.hasWebMercatorT=r.u(s,!1)}M.prototype.encode=function(e,t,i,r,s,u,p){var d=r.x,l=r.y;if(this.quantization===I.BITS12){(i=m.p.multiplyByPoint(this.toScaledENU,i,C)).x=c.e.clamp(i.x,0,1),i.y=c.e.clamp(i.y,0,1),i.z=c.e.clamp(i.z,0,1);var h=this.maximumHeight-this.minimumHeight,f=c.e.clamp((s-this.minimumHeight)/h,0,1);n.o.fromElements(i.x,i.y,B);var y=a.t.compressTextureCoordinates(B);n.o.fromElements(i.z,f,B);var S=a.t.compressTextureCoordinates(B);n.o.fromElements(d,l,B);var x=a.t.compressTextureCoordinates(B);if(e[t++]=y,e[t++]=S,e[t++]=x,this.hasWebMercatorT){n.o.fromElements(p,0,B);var v=a.t.compressTextureCoordinates(B);e[t++]=v}}else o.o.subtract(i,this.center,C),e[t++]=C.x,e[t++]=C.y,e[t++]=C.z,e[t++]=s,e[t++]=d,e[t++]=l,this.hasWebMercatorT&&(e[t++]=p);return this.hasVertexNormals&&(e[t++]=a.t.octPackFloat(u)),t},M.prototype.decodePosition=function(e,t,i){if(r.e(i)||(i=new o.o),t*=this.getStride(),this.quantization===I.BITS12){var n=a.t.decompressTextureCoordinates(e[t],B);i.x=n.x,i.y=n.y;var s=a.t.decompressTextureCoordinates(e[t+1],B);return i.z=s.x,m.p.multiplyByPoint(this.fromScaledENU,i,i)}return i.x=e[t],i.y=e[t+1],i.z=e[t+2],o.o.add(i,this.center,i)},M.prototype.decodeTextureCoordinates=function(e,t,o){return r.e(o)||(o=new n.o),t*=this.getStride(),this.quantization===I.BITS12?a.t.decompressTextureCoordinates(e[t+2],o):n.o.fromElements(e[t+4],e[t+5],o)},M.prototype.decodeHeight=function(e,t){return t*=this.getStride(),this.quantization===I.BITS12?a.t.decompressTextureCoordinates(e[t+1],B).y*(this.maximumHeight-this.minimumHeight)+this.minimumHeight:e[t+3]},M.prototype.decodeWebMercatorT=function(e,t){return t*=this.getStride(),this.quantization===I.BITS12?a.t.decompressTextureCoordinates(e[t+3],B).x:e[t+6]},M.prototype.getOctEncodedNormal=function(e,t,o){var i=e[t=(t+1)*this.getStride()-1]/256,r=Math.floor(i),a=256*(i-r);return n.o.fromElements(r,a,o)},M.prototype.getStride=function(){var e;if(this.quantization===I.BITS12)e=3;else e=6;return this.hasWebMercatorT&&++e,this.hasVertexNormals&&++e,e};var O={position3DAndHeight:0,textureCoordAndEncodedNormals:1},A={compressed0:0,compressed1:1};M.prototype.getAttributes=function(e){var t,o=s.ComponentDatatype.FLOAT,i=s.ComponentDatatype.getSizeInBytes(o);if(this.quantization===I.NONE){var r=2;this.hasWebMercatorT&&++r,this.hasVertexNormals&&++r;var n=[{index:O.position3DAndHeight,name:"position3DAndHeight",vertexBuffer:e,componentDatatype:o,componentsPerAttribute:4,offsetInBytes:0,strideInBytes:t=(4+r)*i},{index:O.textureCoordAndEncodedNormals,name:"textureCoordAndEncodedNormals",vertexBuffer:e,componentDatatype:o,componentsPerAttribute:r,offsetInBytes:4*i,strideInBytes:t}];return n}var a=3,c=0;return(this.hasWebMercatorT||this.hasVertexNormals)&&++a,this.hasWebMercatorT&&this.hasVertexNormals?(t=(a+ ++c)*i,[{index:n.compressed0,name:"compressed0",vertexBuffer:e,componentDatatype:o,componentsPerAttribute:a,offsetInBytes:0,strideInBytes:t},{index:n.compressed1,name:"compressed1",vertexBuffer:e,componentDatatype:o,componentsPerAttribute:c,offsetInBytes:a*i,strideInBytes:t}]):[{index:n.compressed0,name:"compressed0",vertexBuffer:e,componentDatatype:o,componentsPerAttribute:a}]},M.prototype.getAttributeLocations=function(){return this.quantization===I.NONE?O:A},M.clone=function(e,t){return r.e(t)||(t=new M),t.quantization=e.quantization,t.minimumHeight=e.minimumHeight,t.maximumHeight=e.maximumHeight,t.center=o.o.clone(e.center),t.toScaledENU=m.p.clone(e.toScaledENU),t.fromScaledENU=m.p.clone(e.fromScaledENU),t.matrix=m.p.clone(e.matrix),t.hasVertexNormals=e.hasVertexNormals,t.hasWebMercatorT=e.hasWebMercatorT,t},e.h=M,e.s=u}));