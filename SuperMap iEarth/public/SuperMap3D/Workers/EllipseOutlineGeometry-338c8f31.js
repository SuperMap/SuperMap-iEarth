define(["exports","./arrayFill-0358accf","./buildModuleUrl-d80eb436","./Cartesian3-fecb63f1","./ComponentDatatype-98414d16","./when-92c6cf3c","./Check-52a7d806","./EllipseGeometryLibrary-7431deaa","./Cartesian2-21b2f76f","./GeometryAttribute-60174428","./GeometryAttributes-7f66ea53","./GeometryOffsetAttribute-b4d599f5","./IndexDatatype-86677ec4","./Math-ecf82623","./FeatureDetection-7479e310"],(function(e,t,i,r,o,n,a,s,u,d,l,c,h,f,p){"use strict";var m=new r.o,_=new r.o;var A=new i.i,b=new i.i;function g(e){var t=(e=n.u(e,n.u.EMPTY_OBJECT)).center,i=n.u(e.ellipsoid,u.t.WGS84),o=e.semiMajorAxis,s=e.semiMinorAxis,d=n.u(e.granularity,f.e.RADIANS_PER_DEGREE);if(!n.e(t))throw new a.t("center is required.");if(!n.e(o))throw new a.t("semiMajorAxis is required.");if(!n.e(s))throw new a.t("semiMinorAxis is required.");if(o<s)throw new a.t("semiMajorAxis must be greater than or equal to the semiMinorAxis.");if(d<=0)throw new a.t("granularity must be greater than zero.");var l=n.u(e.height,0),c=n.u(e.extrudedHeight,l);this._center=r.o.clone(t),this._semiMajorAxis=o,this._semiMinorAxis=s,this._ellipsoid=u.t.clone(i),this._rotation=n.u(e.rotation,0),this._height=Math.max(c,l),this._granularity=d,this._extrudedHeight=Math.min(c,l),this._numberOfVerticalLines=Math.max(n.u(e.numberOfVerticalLines,16),0),this._offsetAttribute=e.offsetAttribute,this._outlineWidth=n.u(e.outlineWidth,1),this._workerName="createEllipseOutlineGeometry"}g.packedLength=r.o.packedLength+u.t.packedLength+9,g.pack=function(e,t,i){if(!n.e(e))throw new a.t("value is required");if(!n.e(t))throw new a.t("array is required");return i=n.u(i,0),r.o.pack(e._center,t,i),i+=r.o.packedLength,u.t.pack(e._ellipsoid,t,i),i+=u.t.packedLength,t[i++]=e._semiMajorAxis,t[i++]=e._semiMinorAxis,t[i++]=e._rotation,t[i++]=e._height,t[i++]=e._granularity,t[i++]=e._extrudedHeight,t[i++]=e._numberOfVerticalLines,t[i++]=n.u(e._offsetAttribute,-1),t[i]=e._outlineWidth,t};var y=new r.o,v=new u.t,x={center:y,ellipsoid:v,semiMajorAxis:void 0,semiMinorAxis:void 0,rotation:void 0,height:void 0,granularity:void 0,extrudedHeight:void 0,numberOfVerticalLines:void 0,offsetAttribute:void 0,outlineWidth:void 0};g.unpack=function(e,t,i){if(!n.e(e))throw new a.t("array is required");t=n.u(t,0);var o=r.o.unpack(e,t,y);t+=r.o.packedLength;var s=u.t.unpack(e,t,v);t+=u.t.packedLength;var d=e[t++],l=e[t++],c=e[t++],h=e[t++],f=e[t++],p=e[t++],m=e[t++],_=e[t++],A=e[t];return n.e(i)?(i._center=r.o.clone(o,i._center),i._ellipsoid=u.t.clone(s,i._ellipsoid),i._semiMajorAxis=d,i._semiMinorAxis=l,i._rotation=c,i._height=h,i._granularity=f,i._extrudedHeight=p,i._numberOfVerticalLines=m,i._offsetAttribute=-1===_?void 0:_,i._outlineWidth=A,i):(x.height=h,x.extrudedHeight=p,x.granularity=f,x.rotation=c,x.semiMajorAxis=d,x.semiMinorAxis=l,x.numberOfVerticalLines=m,x.offsetAttribute=-1===_?void 0:_,x.outlineWidth=A,new g(x))},g.createGeometry=function(e){if(!(e._semiMajorAxis<=0||e._semiMinorAxis<=0)){var a=e._height,u=e._extrudedHeight,g=!f.e.equalsEpsilon(a,u,0,f.e.EPSILON2);e._center=e._ellipsoid.scaleToGeodeticSurface(e._center,e._center);var y,v={center:e._center,semiMajorAxis:e._semiMajorAxis,semiMinorAxis:e._semiMinorAxis,ellipsoid:e._ellipsoid,rotation:e._rotation,height:a,granularity:e._granularity,outlineWidth:e._outlineWidth,numberOfVerticalLines:e._numberOfVerticalLines};if(g)v.extrudedHeight=u,v.offsetAttribute=e._offsetAttribute,y=function(e){var a=e.center,u=e.ellipsoid,p=e.semiMajorAxis,_=r.o.multiplyByScalar(u.geodeticSurfaceNormal(a,m),e.height,m);A.center=r.o.add(a,_,A.center),A.radius=p,_=r.o.multiplyByScalar(u.geodeticSurfaceNormal(a,_),e.extrudedHeight,_),b.center=r.o.add(a,_,b.center),b.radius=p;var g=s.C.computeEllipsePositions(e,!1,!0).outerPositions,y=new l.a({position:new d.o({componentDatatype:o.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:s.C.raisePositionsToHeight(g,e,!0)})});g=y.position.values;var v=i.i.union(A,b),x=g.length/3;if(n.e(e.offsetAttribute)){var w=new Uint8Array(x);if(e.offsetAttribute===c.z.TOP)w=t.d(w,1,0,x/2);else{var M=e.offsetAttribute===c.z.NONE?0:1;w=t.d(w,M)}y.applyOffset=new d.o({componentDatatype:o.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:w})}var L=n.u(e.numberOfVerticalLines,16);L=f.e.clamp(L,0,x/2);var E=h.IndexDatatype.createTypedArray(x,2*x+2*L);x/=2;var D,O,S=0;for(D=0;D<x;++D)E[S++]=D,E[S++]=(D+1)%x,E[S++]=D+x,E[S++]=(D+1)%x+x;if(L>0){var N=Math.min(L,x);O=Math.round(x/N);var k=Math.min(O*L,x);for(D=0;D<k;D+=O)E[S++]=D,E[S++]=D+x}return{boundingSphere:v,attributes:y,indices:E}}(v);else if(y=function(e){var t=e.center;_=r.o.multiplyByScalar(e.ellipsoid.geodeticSurfaceNormal(t,_),e.height,_),_=r.o.add(t,_,_);var a=new i.i(_,e.semiMajorAxis),u=s.C.computeEllipsePositions(e,!1,!0).outerPositions,c=n.u(e.outlineWidth,1);c>1&&u.push(u[0],u[1],u[2]);var f=new l.a({position:new d.o({componentDatatype:o.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:s.C.raisePositionsToHeight(u,e,!1)})});c>1&&(f.sideness=new d.o({componentDatatype:o.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:new Float32Array([0,0,0,1,1,1,1,0])}),f.sideness.isInstanceAttribute=!0);for(var p=u.length/3,m=h.IndexDatatype.createTypedArray(p,2*p),A=0,b=0;b<p;++b)m[A++]=b,m[A++]=(b+1)%p;return{boundingSphere:a,attributes:f,indices:m}}(v),n.e(e._offsetAttribute)){var x=y.attributes.position.values.length,w=new Uint8Array(x/3),M=e._offsetAttribute===c.z.NONE?0:1;t.d(w,M),y.attributes.applyOffset=new d.o({componentDatatype:o.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:w})}return new d.I({attributes:y.attributes,indices:y.indices,primitiveType:e._outlineWidth>1?p._0x5eacd0.TRIANGLES:p._0x5eacd0.LINES,boundingSphere:y.boundingSphere,offsetAttribute:e._offsetAttribute})}},e.M=g}));