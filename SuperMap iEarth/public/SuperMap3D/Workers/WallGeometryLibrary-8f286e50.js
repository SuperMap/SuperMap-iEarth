define(["exports","./arrayRemoveDuplicates-a6924649","./Cartographic-a2c313d7","./when-92c6cf3c","./Math-ecf82623","./PolylinePipeline-160fa1b0","./GeometryAttribute-65cf868d","./FeatureDetection-fd297af4","./Cartesian3-3a8bdb0b"],(function(e,t,r,i,o,a,n,s,h){"use strict";var l={};function g(e,t){return o.e.equalsEpsilon(e.latitude,t.latitude,o.e.EPSILON10)&&o.e.equalsEpsilon(e.longitude,t.longitude,o.e.EPSILON10)}var c=new r.a,p=new r.a;var u=new Array(2),m=new Array(2),v={positions:void 0,height:void 0,granularity:void 0,ellipsoid:void 0};function A(e,t){for(var r=new Array(e.length),i=0;i<e.length;i+=3){var o=new h.o(e[i],e[i+1],e[i+2]);s.p.multiplyByPoint(t,o,o),r[i]=o.x,r[i+1]=o.y,r[i+2]=o.z}return r}l.computePositions=function(e,l,f,y,w,d,P){var F=function(e,o,a,n){var s=(o=t.D(o,h.o.equalsEpsilon)).length;if(!(s<2)){var l=i.e(n),u=i.e(a),m=!0,v=new Array(s),A=new Array(s),f=new Array(s),y=o[0];v[0]=y;var w=e.cartesianToCartographic(y,c);u&&(w.height=a[0]),m=m&&0==w.height,A[0]=w.height,f[0]=l?n[0]:0;for(var d=1,P=1;P<s;++P){var F=o[P],b=e.cartesianToCartographic(F,p);u&&(b.height=a[P]),m=m&&0==b.height,g(w,b)?w.height<b.height&&(A[d-1]=b.height):(v[d]=F,A[d]=b.height,f[d]=l?n[P]:0,r.a.clone(b,w),++d)}if(!(m||d<2))return v.length=d,A.length=d,f.length=d,{positions:v,topHeights:A,bottomHeights:f}}}(e,l,f,y);if(i.e(F)){var b=n.m.eastNorthUpToFixedFrame(F.positions[0],e,new s.p),C=s.p.inverse(b,new s.p);l=F.positions,f=F.topHeights,y=F.bottomHeights;var D,E,x,H,q=l.length,L=q-2,N=o.e.chordLength(w,e.maximumRadius),O=v;if(O.minDistance=N,O.ellipsoid=e,d){var T,I=0;for(T=0;T<q-1;T++)I+=a.m.numberOfPoints(l[T],l[T+1],N)+1;D=new Float64Array(3*I),E=new Float64Array(3*I),i.e(P)&&(x=new Float64Array(3*I),H=new Float64Array(3*I));var R=u,S=m;O.positions=R,O.height=S;var z=0;for(T=0;T<q-1;T++){R[0]=l[T],R[1]=l[T+1],S[0]=f[T],S[1]=f[T+1];var B=a.m.generateArc(O);D.set(B,z),i.e(P)&&x.set(A(B,C),z),S[0]=y[T],S[1]=y[T+1],E.set(a.m.generateArc(O),z),i.e(P)&&H.set(A(a.m.generateArc(O),C),z),z+=B.length}}else O.positions=l,O.height=f,D=new Float64Array(a.m.generateArc(O)),i.e(P)&&(x=new Float64Array(A(a.m.generateArc(O)))),O.height=y,E=new Float64Array(a.m.generateArc(O)),i.e(P)&&(H=new Float64Array(A(a.m.generateArc(O))));var G={pos:{bottomPositions:E,topPositions:D,numCorners:L}};return i.e(P)&&(G.localPos={bottomPositions:H,topPositions:x,numCorners:L}),G}},e.D=l}));