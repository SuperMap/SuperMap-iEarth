define(["exports","./Cartographic-81e9e8b2","./when-39df26e1","./Check-ff445961","./Cartesian2-59a54ee7","./Math-5e067eb3"],(function(e,t,i,o,a,r){"use strict";function n(e){this._ellipsoid=i.u(e,a.t.WGS84),this._semimajorAxis=this._ellipsoid.maximumRadius,this._oneOverSemimajorAxis=1/this._semimajorAxis}Object.defineProperties(n.prototype,{ellipsoid:{get:function(){return this._ellipsoid}}}),n.mercatorAngleToGeodeticLatitude=function(e){return r.e.PI_OVER_TWO-2*Math.atan(Math.exp(-e))},n.geodeticLatitudeToMercatorAngle=function(e){e>n.MaximumLatitude?e=n.MaximumLatitude:e<-n.MaximumLatitude&&(e=-n.MaximumLatitude);var t=Math.sin(e);return.5*Math.log((1+t)/(1-t))},n.MaximumLatitude=n.mercatorAngleToGeodeticLatitude(Math.PI),n.prototype.project=function(e,o){var a=this._semimajorAxis,r=e.longitude*a,u=n.geodeticLatitudeToMercatorAngle(e.latitude)*a,s=e.height;return i.e(o)?(o.x=r,o.y=u,o.z=s,o):new t.o(r,u,s)},n.prototype.unproject=function(e,a){if(!i.e(e))throw new o.t("cartesian is required");var r=this._oneOverSemimajorAxis,u=e.x*r,s=n.mercatorAngleToGeodeticLatitude(e.y*r),d=e.z;return i.e(a)?(a.longitude=u,a.latitude=s,a.height=d,a):new t.a(u,s,d)},e.t=n}));