define(["exports","./Cartesian2-54f49cd5","./Cartographic-9ee1f1bd","./Check-737bd4ec","./ComponentDatatype-94b9147c","./when-7d8885d2","./EllipsoidRhumbLine-fd512dba","./GeometryAttribute-bf27d0ff","./Math-4ffce144","./FeatureDetection-07e177c7","./WebGLConstants-6b41cc89"],(function(e,t,n,r,a,i,u,x,o,s,p){"use strict";function h(e,t,n){n=n||2;var r,a,i,u,x,o,s,p=t&&t.length,h=p?t[0]*n:e.length,v=f(e,0,h,n,!0),c=[];if(!v||v.next===v.prev)return c;if(p&&(v=function(e,t,n,r){var a,i,u,x=[];for(a=0,i=t.length;a<i;a++)(u=f(e,t[a]*r,a<i-1?t[a+1]*r:e.length,r,!1))===u.next&&(u.steiner=!0),x.push(E(u));for(x.sort(C),a=0;a<x.length;a++)g(x[a],n),n=l(n,n.next);return n}(e,t,v,n)),e.length>80*n){r=i=e[0],a=u=e[1];for(var d=n;d<h;d+=n)(x=e[d])<r&&(r=x),(o=e[d+1])<a&&(a=o),x>i&&(i=x),o>u&&(u=o);s=0!==(s=Math.max(i-r,u-a))?1/s:0}return y(v,c,n,r,a,s),c}function f(e,t,n,r,a){var i,u;if(a===N(e,t,n,r)>0)for(i=t;i<n;i+=r)u=O(i,e[i],e[i+1],u);else for(i=n-r;i>=t;i-=r)u=O(i,e[i],e[i+1],u);return u&&A(u,u.next)&&(W(u),u=u.next),u}function l(e,t){if(!e)return e;t||(t=e);var n,r=e;do{if(n=!1,r.steiner||!A(r,r.next)&&0!==S(r.prev,r,r.next))r=r.next;else{if(W(r),(r=t=r.prev)===r.next)break;n=!0}}while(n||r!==t);return t}function y(e,t,n,r,a,i,u){if(e){!u&&i&&function(e,t,n,r){var a=e;do{null===a.z&&(a.z=b(a.x,a.y,t,n,r)),a.prevZ=a.prev,a.nextZ=a.next,a=a.next}while(a!==e);a.prevZ.nextZ=null,a.prevZ=null,function(e){var t,n,r,a,i,u,x,o,s=1;do{for(n=e,e=null,i=null,u=0;n;){for(u++,r=n,x=0,t=0;t<s&&(x++,r=r.nextZ);t++);for(o=s;x>0||o>0&&r;)0!==x&&(0===o||!r||n.z<=r.z)?(a=n,n=n.nextZ,x--):(a=r,r=r.nextZ,o--),i?i.nextZ=a:e=a,a.prevZ=i,i=a;n=r}i.nextZ=null,s*=2}while(u>1)}(a)}(e,r,a,i);for(var x,o,s=e;e.prev!==e.next;)if(x=e.prev,o=e.next,i?c(e,r,a,i):v(e))t.push(x.i/n),t.push(e.i/n),t.push(o.i/n),W(e),e=o.next,s=o.next;else if((e=o)===s){u?1===u?y(e=d(l(e),t,n),t,n,r,a,i,2):2===u&&m(e,t,n,r,a,i):y(l(e),t,n,r,a,i,1);break}}}function v(e){var t=e.prev,n=e,r=e.next;if(S(t,n,r)>=0)return!1;for(var a=e.next.next;a!==e.prev;){if(M(t.x,t.y,n.x,n.y,r.x,r.y,a.x,a.y)&&S(a.prev,a,a.next)>=0)return!1;a=a.next}return!0}function c(e,t,n,r){var a=e.prev,i=e,u=e.next;if(S(a,i,u)>=0)return!1;for(var x=a.x<i.x?a.x<u.x?a.x:u.x:i.x<u.x?i.x:u.x,o=a.y<i.y?a.y<u.y?a.y:u.y:i.y<u.y?i.y:u.y,s=a.x>i.x?a.x>u.x?a.x:u.x:i.x>u.x?i.x:u.x,p=a.y>i.y?a.y>u.y?a.y:u.y:i.y>u.y?i.y:u.y,h=b(x,o,t,n,r),f=b(s,p,t,n,r),l=e.prevZ,y=e.nextZ;l&&l.z>=h&&y&&y.z<=f;){if(l!==e.prev&&l!==e.next&&M(a.x,a.y,i.x,i.y,u.x,u.y,l.x,l.y)&&S(l.prev,l,l.next)>=0)return!1;if(l=l.prevZ,y!==e.prev&&y!==e.next&&M(a.x,a.y,i.x,i.y,u.x,u.y,y.x,y.y)&&S(y.prev,y,y.next)>=0)return!1;y=y.nextZ}for(;l&&l.z>=h;){if(l!==e.prev&&l!==e.next&&M(a.x,a.y,i.x,i.y,u.x,u.y,l.x,l.y)&&S(l.prev,l,l.next)>=0)return!1;l=l.prevZ}for(;y&&y.z<=f;){if(y!==e.prev&&y!==e.next&&M(a.x,a.y,i.x,i.y,u.x,u.y,y.x,y.y)&&S(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function d(e,t,n){var r=e;do{var a=r.prev,i=r.next.next;!A(a,i)&&z(a,r,r.next,i)&&D(a,i)&&D(i,a)&&(t.push(a.i/n),t.push(r.i/n),t.push(i.i/n),W(r),W(r.next),r=e=i),r=r.next}while(r!==e);return l(r)}function m(e,t,n,r,a,i){var u=e;do{for(var x=u.next.next;x!==u.prev;){if(u.i!==x.i&&Z(u,x)){var o=G(u,x);return u=l(u,u.next),o=l(o,o.next),y(u,t,n,r,a,i),void y(o,t,n,r,a,i)}x=x.next}u=u.next}while(u!==e)}function C(e,t){return e.x-t.x}function g(e,t){if(t=function(e,t){var n,r=t,a=e.x,i=e.y,u=-1/0;do{if(i<=r.y&&i>=r.next.y&&r.next.y!==r.y){var x=r.x+(i-r.y)*(r.next.x-r.x)/(r.next.y-r.y);if(x<=a&&x>u){if(u=x,x===a){if(i===r.y)return r;if(i===r.next.y)return r.next}n=r.x<r.next.x?r:r.next}}r=r.next}while(r!==t);if(!n)return null;if(a===u)return n;var o,s=n,p=n.x,h=n.y,f=1/0;r=n;do{a>=r.x&&r.x>=p&&a!==r.x&&M(i<h?a:u,i,p,h,i<h?u:a,i,r.x,r.y)&&(o=Math.abs(i-r.y)/(a-r.x),D(r,e)&&(o<f||o===f&&(r.x>n.x||r.x===n.x&&w(n,r)))&&(n=r,f=o)),r=r.next}while(r!==s);return n}(e,t),t){var n=G(t,e);l(n,n.next)}}function w(e,t){return S(e.prev,e,t.prev)<0&&S(t.next,e,e.next)<0}function b(e,t,n,r,a){return(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=32767*(e-n)*a)|e<<8))|e<<4))|e<<2))|e<<1))|(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=32767*(t-r)*a)|t<<8))|t<<4))|t<<2))|t<<1))<<1}function E(e){var t=e,n=e;do{(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next}while(t!==e);return n}function M(e,t,n,r,a,i,u,x){return(a-u)*(t-x)-(e-u)*(i-x)>=0&&(e-u)*(r-x)-(n-u)*(t-x)>=0&&(n-u)*(i-x)-(a-u)*(r-x)>=0}function Z(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!function(e,t){var n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&z(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}(e,t)&&(D(e,t)&&D(t,e)&&function(e,t){var n=e,r=!1,a=(e.x+t.x)/2,i=(e.y+t.y)/2;do{n.y>i!=n.next.y>i&&n.next.y!==n.y&&a<(n.next.x-n.x)*(i-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next}while(n!==e);return r}(e,t)&&(S(e.prev,e,t.prev)||S(e,t.prev,t))||A(e,t)&&S(e.prev,e,e.next)>0&&S(t.prev,t,t.next)>0)}function S(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function A(e,t){return e.x===t.x&&e.y===t.y}function z(e,t,n,r){var a=R(S(e,t,n)),i=R(S(e,t,r)),u=R(S(n,r,e)),x=R(S(n,r,t));return a!==i&&u!==x||(!(0!==a||!L(e,n,t))||(!(0!==i||!L(e,r,t))||(!(0!==u||!L(n,e,r))||!(0!==x||!L(n,t,r)))))}function L(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function R(e){return e>0?1:e<0?-1:0}function D(e,t){return S(e.prev,e,e.next)<0?S(e,t,e.next)>=0&&S(e,e.prev,t)>=0:S(e,t,e.prev)<0||S(e,e.next,t)<0}function G(e,t){var n=new T(e.i,e.x,e.y),r=new T(t.i,t.x,t.y),a=e.next,i=t.prev;return e.next=t,t.prev=e,n.next=a,a.prev=n,r.next=n,n.prev=r,i.next=r,r.prev=i,r}function O(e,t,n,r){var a=new T(e,t,n);return r?(a.next=r.next,a.prev=r,r.next.prev=a,r.next=a):(a.prev=a,a.next=a),a}function W(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function T(e,t,n){this.i=e,this.x=t,this.y=n,this.prev=null,this.next=null,this.z=null,this.prevZ=null,this.nextZ=null,this.steiner=!1}function N(e,t,n,r){for(var a=0,i=t,u=n-r;i<n;i+=r)a+=(e[u]-e[i])*(e[i+1]+e[u+1]),u=i;return a}h.deviation=function(e,t,n,r){var a=t&&t.length,i=a?t[0]*n:e.length,u=Math.abs(N(e,0,i,n));if(a)for(var x=0,o=t.length;x<o;x++){var s=t[x]*n,p=x<o-1?t[x+1]*n:e.length;u-=Math.abs(N(e,s,p,n))}var h=0;for(x=0;x<r.length;x+=3){var f=r[x]*n,l=r[x+1]*n,y=r[x+2]*n;h+=Math.abs((e[f]-e[y])*(e[l+1]-e[f+1])-(e[f]-e[l])*(e[y+1]-e[f+1]))}return 0===u&&0===h?0:Math.abs((h-u)/u)},h.flatten=function(e){for(var t=e[0][0].length,n={vertices:[],holes:[],dimensions:t},r=0,a=0;a<e.length;a++){for(var i=0;i<e[a].length;i++)for(var u=0;u<t;u++)n.vertices.push(e[a][i][u]);a>0&&(r+=e[a-1].length,n.holes.push(r))}return n};var P={CLOCKWISE:p.WebGLConstants.CW,COUNTER_CLOCKWISE:p.WebGLConstants.CCW,NONE:p.WebGLConstants.NONE,validate:function(e){return e===P.CLOCKWISE||e===P.COUNTER_CLOCKWISE}},I=Object.freeze(P),B=new n.Cartesian3,U=new n.Cartesian3,_={computeArea2D:function(e){for(var t=e.length,n=0,r=t-1,a=0;a<t;r=a++){var i=e[r],u=e[a];n+=i.x*u.y-u.x*i.y}return.5*n},computeWindingOrder2D:function(e){return _.computeArea2D(e)>0?I.COUNTER_CLOCKWISE:I.CLOCKWISE},triangulate:function(e,n){return h(t.Cartesian2.packArray(e),n,2)}},K=new n.Cartesian3,V=new n.Cartesian3,k=new n.Cartesian3,F=new n.Cartesian3,q=new n.Cartesian3,j=new n.Cartesian3,H=new n.Cartesian3;_.computeSubdivision=function(e,t,r,u,p){p=i.defaultValue(p,!1),u=i.defaultValue(u,o.CesiumMath.RADIANS_PER_DEGREE);var h,f=r.slice(0),l=t.length,y=new Array(3*l),v=0;for(h=0;h<l;h++){var c=t[h];y[v++]=c.x,y[v++]=c.y,y[v++]=c.z}for(var d=[],m={},C=e.maximumRadius,g=o.CesiumMath.chordLength(u,C),w=g*g;f.length>0;){var b,E,M=f.pop(),Z=f.pop(),S=f.pop(),A=n.Cartesian3.fromArray(y,3*S,K),z=n.Cartesian3.fromArray(y,3*Z,V),L=n.Cartesian3.fromArray(y,3*M,k),R=p?A:n.Cartesian3.multiplyByScalar(n.Cartesian3.normalize(A,F),C,F),D=p?z:n.Cartesian3.multiplyByScalar(n.Cartesian3.normalize(z,q),C,q),G=p?L:n.Cartesian3.multiplyByScalar(n.Cartesian3.normalize(L,j),C,j),O=n.Cartesian3.magnitudeSquared(n.Cartesian3.subtract(R,D,H)),W=n.Cartesian3.magnitudeSquared(n.Cartesian3.subtract(D,G,H)),T=n.Cartesian3.magnitudeSquared(n.Cartesian3.subtract(G,R,H)),N=Math.max(O,W,T);N>w?O===N?(h=m[b=Math.min(S,Z)+" "+Math.max(S,Z)],i.defined(h)||(E=n.Cartesian3.add(A,z,H),n.Cartesian3.multiplyByScalar(E,.5,E),y.push(E.x,E.y,E.z),h=y.length/3-1,m[b]=h),f.push(S,h,M),f.push(h,Z,M)):W===N?(h=m[b=Math.min(Z,M)+" "+Math.max(Z,M)],i.defined(h)||(E=n.Cartesian3.add(z,L,H),n.Cartesian3.multiplyByScalar(E,.5,E),y.push(E.x,E.y,E.z),h=y.length/3-1,m[b]=h),f.push(Z,h,S),f.push(h,M,S)):T===N&&(h=m[b=Math.min(M,S)+" "+Math.max(M,S)],i.defined(h)||(E=n.Cartesian3.add(L,A,H),n.Cartesian3.multiplyByScalar(E,.5,E),y.push(E.x,E.y,E.z),h=y.length/3-1,m[b]=h),f.push(M,h,Z),f.push(h,S,Z)):(d.push(S),d.push(Z),d.push(M))}return new x.Geometry({attributes:{position:new x.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:y})},indices:d,primitiveType:s.PrimitiveType.TRIANGLES})};var J=new n.Cartographic,Q=new n.Cartographic,X=new n.Cartographic,Y=new n.Cartographic;_.computeRhumbLineSubdivision=function(e,t,r,p){p=i.defaultValue(p,o.CesiumMath.RADIANS_PER_DEGREE);var h,f=r.slice(0),l=t.length,y=new Array(3*l),v=0;for(h=0;h<l;h++){var c=t[h];y[v++]=c.x,y[v++]=c.y,y[v++]=c.z}for(var d=[],m={},C=e.maximumRadius,g=o.CesiumMath.chordLength(p,C),w=new u.EllipsoidRhumbLine(void 0,void 0,e),b=new u.EllipsoidRhumbLine(void 0,void 0,e),E=new u.EllipsoidRhumbLine(void 0,void 0,e);f.length>0;){var M=f.pop(),Z=f.pop(),S=f.pop(),A=n.Cartesian3.fromArray(y,3*S,K),z=n.Cartesian3.fromArray(y,3*Z,V),L=n.Cartesian3.fromArray(y,3*M,k),R=e.cartesianToCartographic(A,J),D=e.cartesianToCartographic(z,Q),G=e.cartesianToCartographic(L,X);w.setEndPoints(R,D);var O=w.surfaceDistance;b.setEndPoints(D,G);var W=b.surfaceDistance;E.setEndPoints(G,R);var T,N,P,I,B=E.surfaceDistance,U=Math.max(O,W,B);U>g?O===U?(h=m[T=Math.min(S,Z)+" "+Math.max(S,Z)],i.defined(h)||(N=w.interpolateUsingFraction(.5,Y),P=.5*(R.height+D.height),I=n.Cartesian3.fromRadians(N.longitude,N.latitude,P,e,H),y.push(I.x,I.y,I.z),h=y.length/3-1,m[T]=h),f.push(S,h,M),f.push(h,Z,M)):W===U?(h=m[T=Math.min(Z,M)+" "+Math.max(Z,M)],i.defined(h)||(N=b.interpolateUsingFraction(.5,Y),P=.5*(D.height+G.height),I=n.Cartesian3.fromRadians(N.longitude,N.latitude,P,e,H),y.push(I.x,I.y,I.z),h=y.length/3-1,m[T]=h),f.push(Z,h,S),f.push(h,M,S)):B===U&&(h=m[T=Math.min(M,S)+" "+Math.max(M,S)],i.defined(h)||(N=E.interpolateUsingFraction(.5,Y),P=.5*(G.height+R.height),I=n.Cartesian3.fromRadians(N.longitude,N.latitude,P,e,H),y.push(I.x,I.y,I.z),h=y.length/3-1,m[T]=h),f.push(M,h,Z),f.push(h,S,Z)):(d.push(S),d.push(Z),d.push(M))}return new x.Geometry({attributes:{position:new x.GeometryAttribute({componentDatatype:a.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:y})},indices:d,primitiveType:s.PrimitiveType.TRIANGLES})},_.scaleToGeodeticHeight=function(e,r,a,u){a=i.defaultValue(a,t.Ellipsoid.WGS84);var x=B,o=U;if(r=i.defaultValue(r,0),u=i.defaultValue(u,!0),i.defined(e))for(var s=e.length,p=0;p<s;p+=3)n.Cartesian3.fromArray(e,p,o),u&&(o=a.scaleToGeodeticSurface(o,o)),0!==r&&(x=a.geodeticSurfaceNormal(o,x),n.Cartesian3.multiplyByScalar(x,r,x),n.Cartesian3.add(o,x,o)),e[p]=o.x,e[p+1]=o.y,e[p+2]=o.z;return e},e.PolygonPipeline=_,e.WindingOrder=I}));