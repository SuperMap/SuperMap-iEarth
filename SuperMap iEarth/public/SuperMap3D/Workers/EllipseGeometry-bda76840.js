define(["exports","./arrayFill-0358accf","./buildModuleUrl-d80eb436","./Cartesian2-21b2f76f","./Cartesian3-fecb63f1","./Cartographic-d606c511","./Check-52a7d806","./ComponentDatatype-98414d16","./when-92c6cf3c","./EllipseGeometryLibrary-7431deaa","./GeometryAttribute-60174428","./GeometryAttributes-7f66ea53","./GeometryInstance-f48dcae5","./GeometryOffsetAttribute-b4d599f5","./GeometryPipeline-003a7e33","./IndexDatatype-86677ec4","./Math-ecf82623","./FeatureDetection-7479e310","./VertexFormat-f496a3f1"],(function(e,t,o,r,n,i,a,s,u,m,l,c,p,d,y,f,h,A,x){"use strict";var g=new n.o,_=new n.o,v=new n.o,b=new n.o,w=new r.o,I=new A.p$1,T=new A.p$1,N=new l.n,M=new n.o,E=new n.o,P=new n.o,D=new i.a,F=new n.o,O=new r.o,S=new r.o;function C(e,i,a){var p=i.vertexFormat,y=i.center,f=i.semiMajorAxis,h=i.semiMinorAxis,x=i.ellipsoid,b=i.stRotation,C=a?e.length/3*2:e.length/3,L=i.shadowVolume,R=p.st?new Float32Array(2*C):void 0,j=p.normal?new Float32Array(3*C):void 0,z=p.tangent?new Float32Array(3*C):void 0,G=p.bitangent?new Float32Array(3*C):void 0,V=L?new Float32Array(3*C):void 0,k=0,Y=M,B=E,H=P,$=new o.n(x),U=$.project(x.cartesianToCartographic(y,D),F),W=x.scaleToGeodeticSurface(y,g);x.geodeticSurfaceNormal(W,W);var q=I,Q=T;if(0!==b){var J=l.n.fromAxisAngle(W,b,N);q=A.p$1.fromQuaternion(J,q),J=l.n.fromAxisAngle(W,-b,N),Q=A.p$1.fromQuaternion(J,Q)}else q=A.p$1.clone(A.p$1.IDENTITY,q),Q=A.p$1.clone(A.p$1.IDENTITY,Q);for(var Z=r.o.fromElements(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,O),K=r.o.fromElements(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,S),X=e.length,ee=a?X:0,te=ee/3*2,oe=0;oe<X;oe+=3){var re=oe+1,ne=oe+2,ie=n.o.fromArray(e,oe,g);if(p.st){var ae=A.p$1.multiplyByVector(q,ie,_),se=$.project(x.cartesianToCartographic(ae,D),v);n.o.subtract(se,U,se),w.x=(se.x+f)/(2*f),w.y=(se.y+h)/(2*h),Z.x=Math.min(w.x,Z.x),Z.y=Math.min(w.y,Z.y),K.x=Math.max(w.x,K.x),K.y=Math.max(w.y,K.y),a&&(R[k+te]=w.x,R[k+1+te]=w.y),R[k++]=w.x,R[k++]=w.y}(p.normal||p.tangent||p.bitangent||L)&&(Y=x.geodeticSurfaceNormal(ie,Y),L&&(V[oe+ee]=-Y.x,V[re+ee]=-Y.y,V[ne+ee]=-Y.z),(p.normal||p.tangent||p.bitangent)&&((p.tangent||p.bitangent)&&(B=n.o.normalize(n.o.cross(n.o.UNIT_Z,Y,B),B),A.p$1.multiplyByVector(Q,B,B)),p.normal&&(j[oe]=Y.x,j[re]=Y.y,j[ne]=Y.z,a&&(j[oe+ee]=-Y.x,j[re+ee]=-Y.y,j[ne+ee]=-Y.z)),p.tangent&&(z[oe]=B.x,z[re]=B.y,z[ne]=B.z,a&&(z[oe+ee]=-B.x,z[re+ee]=-B.y,z[ne+ee]=-B.z)),p.bitangent&&(H=n.o.normalize(n.o.cross(Y,B,H),H),G[oe]=H.x,G[re]=H.y,G[ne]=H.z,a&&(G[oe+ee]=H.x,G[re+ee]=H.y,G[ne+ee]=H.z))))}if(p.st){X=R.length;for(var ue=0;ue<X;ue+=2)R[ue]=(R[ue]-Z.x)/(K.x-Z.x),R[ue+1]=(R[ue+1]-Z.y)/(K.y-Z.y)}var me=new c.a;if(p.position){var le=m.C.raisePositionsToHeight(e,i,a);me.position=new l.o({componentDatatype:s.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:le})}if(p.st&&(me.st=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:R})),p.normal&&(me.normal=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:j})),p.tangent&&(me.tangent=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:z})),p.bitangent&&(me.bitangent=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:G})),L&&(me.extrudeDirection=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:V})),a&&u.e(i.offsetAttribute)){var ce=new Uint8Array(C);if(i.offsetAttribute===d.z.TOP)ce=t.d(ce,1,0,C/2);else{var pe=i.offsetAttribute===d.z.NONE?0:1;ce=t.d(ce,pe)}me.applyOffset=new l.o({componentDatatype:s.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:ce})}return me}function L(e){var t,o,r,n,i,a=new Array(e*(e+1)*12-6),s=0;for(t=0,r=1,n=0;n<3;n++)a[s++]=r++,a[s++]=t,a[s++]=r;for(n=2;n<e+1;++n){for(r=n*(n+1)-1,t=(n-1)*n-1,a[s++]=r++,a[s++]=t,a[s++]=r,o=2*n,i=0;i<o-1;++i)a[s++]=r,a[s++]=t++,a[s++]=t,a[s++]=r++,a[s++]=t,a[s++]=r;a[s++]=r++,a[s++]=t,a[s++]=r}for(o=2*e,++r,++t,n=0;n<o-1;++n)a[s++]=r,a[s++]=t++,a[s++]=t,a[s++]=r++,a[s++]=t,a[s++]=r;for(a[s++]=r,a[s++]=t++,a[s++]=t,a[s++]=r++,a[s++]=t++,a[s++]=t,++t,n=e-1;n>1;--n){for(a[s++]=t++,a[s++]=t,a[s++]=r,o=2*n,i=0;i<o-1;++i)a[s++]=r,a[s++]=t++,a[s++]=t,a[s++]=r++,a[s++]=t,a[s++]=r;a[s++]=t++,a[s++]=t++,a[s++]=r++}for(n=0;n<3;n++)a[s++]=t++,a[s++]=t,a[s++]=r;return a}var R=new n.o;var j=new o.i,z=new o.i;function G(e){var i=e.center,a=e.ellipsoid,h=e.semiMajorAxis,x=n.o.multiplyByScalar(a.geodeticSurfaceNormal(i,g),e.height,g);j.center=n.o.add(i,x,j.center),j.radius=h,x=n.o.multiplyByScalar(a.geodeticSurfaceNormal(i,x),e.extrudedHeight,x),z.center=n.o.add(i,x,z.center),z.radius=h;var T=m.C.computeEllipsePositions(e,!0,!0),R=T.positions,G=T.numPts,V=T.outerPositions,k=o.i.union(j,z),Y=C(R,e,!0),B=L(G),H=B.length;B.length=2*H;for(var $=R.length/3,U=0;U<H;U+=3)B[U+H]=B[U+2]+$,B[U+1+H]=B[U+1]+$,B[U+2+H]=B[U]+$;var W=f.IndexDatatype.createTypedArray(2*$/3,B),q=new l.I({attributes:Y,indices:W,primitiveType:A._0x5eacd0.TRIANGLES}),Q=function(e,i){var a=i.vertexFormat,m=i.center,p=i.semiMajorAxis,y=i.semiMinorAxis,f=i.ellipsoid,h=i.height,x=i.extrudedHeight,T=i.stRotation,C=e.length/3*2,L=new Float64Array(3*C),R=a.st?new Float32Array(2*C):void 0,j=a.normal?new Float32Array(3*C):void 0,z=a.tangent?new Float32Array(3*C):void 0,G=a.bitangent?new Float32Array(3*C):void 0,V=i.shadowVolume,k=V?new Float32Array(3*C):void 0,Y=0,B=M,H=E,$=P,U=new o.n(f),W=U.project(f.cartesianToCartographic(m,D),F),q=f.scaleToGeodeticSurface(m,g);f.geodeticSurfaceNormal(q,q);for(var Q=l.n.fromAxisAngle(q,T,N),J=A.p$1.fromQuaternion(Q,I),Z=r.o.fromElements(Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY,O),K=r.o.fromElements(Number.NEGATIVE_INFINITY,Number.NEGATIVE_INFINITY,S),X=e.length,ee=X/3*2,te=0;te<X;te+=3){var oe,re=te+1,ne=te+2,ie=n.o.fromArray(e,te,g);if(a.st){var ae=A.p$1.multiplyByVector(J,ie,_),se=U.project(f.cartesianToCartographic(ae,D),v);n.o.subtract(se,W,se),w.x=(se.x+p)/(2*p),w.y=(se.y+y)/(2*y),Z.x=Math.min(w.x,Z.x),Z.y=Math.min(w.y,Z.y),K.x=Math.max(w.x,K.x),K.y=Math.max(w.y,K.y),R[Y+ee]=w.x,R[Y+1+ee]=w.y,R[Y++]=w.x,R[Y++]=w.y}ie=f.scaleToGeodeticSurface(ie,ie),oe=n.o.clone(ie,_),B=f.geodeticSurfaceNormal(ie,B),V&&(k[te+X]=-B.x,k[re+X]=-B.y,k[ne+X]=-B.z);var ue=n.o.multiplyByScalar(B,h,b);if(ie=n.o.add(ie,ue,ie),ue=n.o.multiplyByScalar(B,x,ue),oe=n.o.add(oe,ue,oe),a.position&&(L[te+X]=oe.x,L[re+X]=oe.y,L[ne+X]=oe.z,L[te]=ie.x,L[re]=ie.y,L[ne]=ie.z),a.normal||a.tangent||a.bitangent){$=n.o.clone(B,$);var me=n.o.fromArray(e,(te+3)%X,b);n.o.subtract(me,ie,me);var le=n.o.subtract(oe,ie,v);B=n.o.normalize(n.o.cross(le,me,B),B),a.normal&&(j[te]=B.x,j[re]=B.y,j[ne]=B.z,j[te+X]=B.x,j[re+X]=B.y,j[ne+X]=B.z),a.tangent&&(H=n.o.normalize(n.o.cross($,B,H),H),z[te]=H.x,z[re]=H.y,z[ne]=H.z,z[te+X]=H.x,z[te+1+X]=H.y,z[te+2+X]=H.z),a.bitangent&&(G[te]=$.x,G[re]=$.y,G[ne]=$.z,G[te+X]=$.x,G[re+X]=$.y,G[ne+X]=$.z)}}if(a.st){X=R.length;for(var ce=0;ce<X;ce+=2)R[ce]=(R[ce]-Z.x)/(K.x-Z.x),R[ce+1]=(R[ce+1]-Z.y)/(K.y-Z.y)}var pe=new c.a;if(a.position&&(pe.position=new l.o({componentDatatype:s.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:L})),a.st&&(pe.st=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:R})),a.normal&&(pe.normal=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:j})),a.tangent&&(pe.tangent=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:z})),a.bitangent&&(pe.bitangent=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:G})),V&&(pe.extrudeDirection=new l.o({componentDatatype:s.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:k})),u.e(i.offsetAttribute)){var de=new Uint8Array(C);if(i.offsetAttribute===d.z.TOP)de=t.d(de,1,0,C/2);else{var ye=i.offsetAttribute===d.z.NONE?0:1;de=t.d(de,ye)}pe.applyOffset=new l.o({componentDatatype:s.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:de})}return pe}(V,e);B=function(e){for(var t=e.length/3,o=f.IndexDatatype.createTypedArray(t,6*t),r=0,n=0;n<t;n++){var i=n,a=n+t,s=(i+1)%t,u=s+t;o[r++]=i,o[r++]=a,o[r++]=s,o[r++]=s,o[r++]=a,o[r++]=u}return o}(V);var J=f.IndexDatatype.createTypedArray(2*V.length/3,B),Z=new l.I({attributes:Q,indices:J,primitiveType:A._0x5eacd0.TRIANGLES}),K=y.k.combineInstances([new p.d({geometry:q}),new p.d({geometry:Z})]);return{boundingSphere:k,attributes:K[0].attributes,indices:K[0].indices}}function V(e,t,o,i,a,s,u){for(var l=m.C.computeEllipsePositions({center:e,semiMajorAxis:t,semiMinorAxis:o,rotation:i,granularity:a},!1,!0).outerPositions,c=l.length/3,p=new Array(c),d=0;d<c;++d)p[d]=n.o.fromArray(l,3*d);var y=r.h.fromCartesianArray(p,s,u);return y.width>h.e.PI&&(y.north=y.north>0?h.e.PI_OVER_TWO-h.e.EPSILON7:y.north,y.south=y.south<0?h.e.EPSILON7-h.e.PI_OVER_TWO:y.south,y.east=h.e.PI,y.west=-h.e.PI),y}function k(e){var t=(e=u.u(e,u.u.EMPTY_OBJECT)).center,o=u.u(e.ellipsoid,r.t.WGS84),i=e.semiMajorAxis,s=e.semiMinorAxis,m=u.u(e.granularity,h.e.RADIANS_PER_DEGREE),l=u.u(e.vertexFormat,x.n.DEFAULT);if(a.o.defined("options.center",t),a.o.typeOf.number("options.semiMajorAxis",i),a.o.typeOf.number("options.semiMinorAxis",s),i<s)throw new a.t("semiMajorAxis must be greater than or equal to the semiMinorAxis.");if(m<=0)throw new a.t("granularity must be greater than zero.");var c=u.u(e.height,0),p=u.u(e.extrudedHeight,c);this._center=n.o.clone(t),this._semiMajorAxis=i,this._semiMinorAxis=s,this._ellipsoid=r.t.clone(o),this._rotation=u.u(e.rotation,0),this._stRotation=u.u(e.stRotation,0),this._height=Math.max(p,c),this._granularity=m,this._vertexFormat=x.n.clone(l),this._extrudedHeight=Math.min(p,c),this._shadowVolume=u.u(e.shadowVolume,!1),this._workerName="createEllipseGeometry",this._offsetAttribute=e.offsetAttribute,this._rectangle=void 0,this._textureCoordinateRotationPoints=void 0}k.packedLength=n.o.packedLength+r.t.packedLength+x.n.packedLength+9,k.pack=function(e,t,o){return a.o.defined("value",e),a.o.defined("array",t),o=u.u(o,0),n.o.pack(e._center,t,o),o+=n.o.packedLength,r.t.pack(e._ellipsoid,t,o),o+=r.t.packedLength,x.n.pack(e._vertexFormat,t,o),o+=x.n.packedLength,t[o++]=e._semiMajorAxis,t[o++]=e._semiMinorAxis,t[o++]=e._rotation,t[o++]=e._stRotation,t[o++]=e._height,t[o++]=e._granularity,t[o++]=e._extrudedHeight,t[o++]=e._shadowVolume?1:0,t[o]=u.u(e._offsetAttribute,-1),t};var Y=new n.o,B=new r.t,H=new x.n,$={center:Y,ellipsoid:B,vertexFormat:H,semiMajorAxis:void 0,semiMinorAxis:void 0,rotation:void 0,stRotation:void 0,height:void 0,granularity:void 0,extrudedHeight:void 0,shadowVolume:void 0,offsetAttribute:void 0};k.unpack=function(e,t,o){a.o.defined("array",e),t=u.u(t,0);var i=n.o.unpack(e,t,Y);t+=n.o.packedLength;var s=r.t.unpack(e,t,B);t+=r.t.packedLength;var m=x.n.unpack(e,t,H);t+=x.n.packedLength;var l=e[t++],c=e[t++],p=e[t++],d=e[t++],y=e[t++],f=e[t++],h=e[t++],A=1===e[t++],g=e[t];return u.e(o)?(o._center=n.o.clone(i,o._center),o._ellipsoid=r.t.clone(s,o._ellipsoid),o._vertexFormat=x.n.clone(m,o._vertexFormat),o._semiMajorAxis=l,o._semiMinorAxis=c,o._rotation=p,o._stRotation=d,o._height=y,o._granularity=f,o._extrudedHeight=h,o._shadowVolume=A,o._offsetAttribute=-1===g?void 0:g,o):($.height=y,$.extrudedHeight=h,$.granularity=f,$.stRotation=d,$.rotation=p,$.semiMajorAxis=l,$.semiMinorAxis=c,$.shadowVolume=A,$.offsetAttribute=-1===g?void 0:g,new k($))},k.computeRectangle=function(e,t){var o=(e=u.u(e,u.u.EMPTY_OBJECT)).center,n=u.u(e.ellipsoid,r.t.WGS84),i=e.semiMajorAxis,s=e.semiMinorAxis,m=u.u(e.granularity,h.e.RADIANS_PER_DEGREE),l=u.u(e.rotation,0);if(a.o.defined("options.center",o),a.o.typeOf.number("options.semiMajorAxis",i),a.o.typeOf.number("options.semiMinorAxis",s),i<s)throw new a.t("semiMajorAxis must be greater than or equal to the semiMinorAxis.");if(m<=0)throw new a.t("granularity must be greater than zero.");return V(o,i,s,l,m,n,t)},k.createGeometry=function(e){if(!(e._semiMajorAxis<=0||e._semiMinorAxis<=0)){var r=e._height,i=e._extrudedHeight,a=!h.e.equalsEpsilon(r,i,0,h.e.EPSILON2);e._center=e._ellipsoid.scaleToGeodeticSurface(e._center,e._center);var c,p={center:e._center,semiMajorAxis:e._semiMajorAxis,semiMinorAxis:e._semiMinorAxis,ellipsoid:e._ellipsoid,rotation:e._rotation,height:r,granularity:e._granularity,vertexFormat:e._vertexFormat,stRotation:e._stRotation};if(a)p.extrudedHeight=i,p.shadowVolume=e._shadowVolume,p.offsetAttribute=e._offsetAttribute,c=G(p);else if(c=function(e){var t=e.center;R=n.o.multiplyByScalar(e.ellipsoid.geodeticSurfaceNormal(t,R),e.height,R),R=n.o.add(t,R,R);var r=new o.i(R,e.semiMajorAxis),i=m.C.computeEllipsePositions(e,!0,!1),a=i.positions,s=i.numPts,u=C(a,e,!1),l=L(s);return{boundingSphere:r,attributes:u,indices:l=f.IndexDatatype.createTypedArray(a.length/3,l)}}(p),u.e(e._offsetAttribute)){var y=c.attributes.position.values.length,x=new Uint8Array(y/3),g=e._offsetAttribute===d.z.NONE?0:1;t.d(x,g),c.attributes.applyOffset=new l.o({componentDatatype:s.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:x})}return new l.I({attributes:c.attributes,indices:c.indices,primitiveType:A._0x5eacd0.TRIANGLES,boundingSphere:c.boundingSphere,offsetAttribute:e._offsetAttribute})}},k.createShadowVolume=function(e,t,o){var r=e._granularity,n=e._ellipsoid,i=t(r,n),a=o(r,n);return new k({center:e._center,semiMajorAxis:e._semiMajorAxis,semiMinorAxis:e._semiMinorAxis,ellipsoid:n,rotation:e._rotation,stRotation:e._stRotation,granularity:r,extrudedHeight:i,height:a,vertexFormat:x.n.POSITION_ONLY,shadowVolume:!0})},Object.defineProperties(k.prototype,{rectangle:{get:function(){return u.e(this._rectangle)||(this._rectangle=V(this._center,this._semiMajorAxis,this._semiMinorAxis,this._rotation,this._granularity,this._ellipsoid)),this._rectangle}},textureCoordinateRotationPoints:{get:function(){return u.e(this._textureCoordinateRotationPoints)||(this._textureCoordinateRotationPoints=function(e){var t=-e._stRotation;if(0===t)return[0,0,0,1,1,0];for(var o=m.C.computeEllipsePositions({center:e._center,semiMajorAxis:e._semiMajorAxis,semiMinorAxis:e._semiMinorAxis,rotation:e._rotation,granularity:e._granularity},!1,!0).outerPositions,r=o.length/3,i=new Array(r),a=0;a<r;++a)i[a]=n.o.fromArray(o,3*a);var s=e._ellipsoid,u=e.rectangle;return l.I._textureCoordinateRotationPoints(i,t,s,u)}(this)),this._textureCoordinateRotationPoints}}}),e.Y=k}));