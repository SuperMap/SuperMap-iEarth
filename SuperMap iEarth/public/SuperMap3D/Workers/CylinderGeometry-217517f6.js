define(["exports","./arrayFill-0358accf","./buildModuleUrl-d80eb436","./Cartesian2-21b2f76f","./Cartesian3-fecb63f1","./ComponentDatatype-98414d16","./CylinderGeometryLibrary-60eef4da","./when-92c6cf3c","./Check-52a7d806","./GeometryAttribute-60174428","./GeometryAttributes-7f66ea53","./GeometryOffsetAttribute-b4d599f5","./IndexDatatype-86677ec4","./Math-ecf82623","./FeatureDetection-7479e310","./VertexFormat-f496a3f1"],(function(t,e,o,n,a,r,i,s,u,f,p,m,d,c,b,l){"use strict";var y=new n.o,v=new a.o,h=new a.o,w=new a.o,A=new a.o;function g(t){var e=(t=s.u(t,s.u.EMPTY_OBJECT)).length,o=t.topRadius,n=t.bottomRadius,a=s.u(t.vertexFormat,l.n.DEFAULT),r=s.u(t.slices,128);if(!s.e(e))throw new u.t("options.length must be defined.");if(!s.e(o))throw new u.t("options.topRadius must be defined.");if(!s.e(n))throw new u.t("options.bottomRadius must be defined.");if(r<3)throw new u.t("options.slices must be greater than or equal to 3.");if(s.e(t.offsetAttribute)&&t.offsetAttribute===m.z.TOP)throw new u.t("GeometryOffsetAttribute.TOP is not a supported options.offsetAttribute for this geometry.");this._length=e,this._topRadius=o,this._bottomRadius=n,this._vertexFormat=l.n.clone(a),this._slices=r,this._offsetAttribute=t.offsetAttribute,this._workerName="createCylinderGeometry"}g.packedLength=l.n.packedLength+5,g.pack=function(t,e,o){if(!s.e(t))throw new u.t("value is required");if(!s.e(e))throw new u.t("array is required");return o=s.u(o,0),l.n.pack(t._vertexFormat,e,o),o+=l.n.packedLength,e[o++]=t._length,e[o++]=t._topRadius,e[o++]=t._bottomRadius,e[o++]=t._slices,e[o]=s.u(t._offsetAttribute,-1),e};var _,x=new l.n,F={vertexFormat:x,length:void 0,topRadius:void 0,bottomRadius:void 0,slices:void 0,offsetAttribute:void 0};g.unpack=function(t,e,o){if(!s.e(t))throw new u.t("array is required");e=s.u(e,0);var n=l.n.unpack(t,e,x);e+=l.n.packedLength;var a=t[e++],r=t[e++],i=t[e++],f=t[e++],p=t[e];return s.e(o)?(o._vertexFormat=l.n.clone(n,o._vertexFormat),o._length=a,o._topRadius=r,o._bottomRadius=i,o._slices=f,o._offsetAttribute=-1===p?void 0:p,o):(F.length=a,F.topRadius=r,F.bottomRadius=i,F.slices=f,F.offsetAttribute=-1===p?void 0:p,new g(F))},g.createGeometry=function(t){var u=t._length,l=t._topRadius,g=t._bottomRadius,_=t._vertexFormat,x=t._slices;if(!(u<=0||l<0||g<0||0===l&&0===g)){var F,R=x+x,D=x+R,O=R+R,T=i.I.computePositions(u,l,g,x,!0),C=_.st?new Float32Array(2*O):void 0,L=_.normal?new Float32Array(3*O):void 0,P=_.tangent?new Float32Array(3*O):void 0,z=_.bitangent?new Float32Array(3*O):void 0,k=_.normal||_.tangent||_.bitangent;if(k){var G=_.tangent||_.bitangent,I=0,M=0,E=0,N=Math.atan2(g-l,u),U=v;U.z=Math.sin(N);var q=Math.cos(N),S=w,B=h;for(F=0;F<x;F++){var Y=F/x*c.e.TWO_PI,Z=q*Math.cos(Y),J=q*Math.sin(Y);k&&(U.x=Z,U.y=J,G&&(S=a.o.normalize(a.o.cross(a.o.UNIT_Z,U,S),S)),_.normal&&(L[I++]=U.x,L[I++]=U.y,L[I++]=U.z,L[I++]=U.x,L[I++]=U.y,L[I++]=U.z),_.tangent&&(P[M++]=S.x,P[M++]=S.y,P[M++]=S.z,P[M++]=S.x,P[M++]=S.y,P[M++]=S.z),_.bitangent&&(B=a.o.normalize(a.o.cross(U,S,B),B),z[E++]=B.x,z[E++]=B.y,z[E++]=B.z,z[E++]=B.x,z[E++]=B.y,z[E++]=B.z))}for(F=0;F<x;F++)_.normal&&(L[I++]=0,L[I++]=0,L[I++]=-1),_.tangent&&(P[M++]=1,P[M++]=0,P[M++]=0),_.bitangent&&(z[E++]=0,z[E++]=-1,z[E++]=0);for(F=0;F<x;F++)_.normal&&(L[I++]=0,L[I++]=0,L[I++]=1),_.tangent&&(P[M++]=1,P[M++]=0,P[M++]=0),_.bitangent&&(z[E++]=0,z[E++]=1,z[E++]=0)}var V=12*x-12,W=d.IndexDatatype.createTypedArray(O,V),j=0,H=0;for(F=0;F<x-1;F++)W[j++]=H,W[j++]=H+2,W[j++]=H+3,W[j++]=H,W[j++]=H+3,W[j++]=H+1,H+=2;for(W[j++]=R-2,W[j++]=0,W[j++]=1,W[j++]=R-2,W[j++]=1,W[j++]=R-1,F=1;F<x-1;F++)W[j++]=R+F+1,W[j++]=R+F,W[j++]=R;for(F=1;F<x-1;F++)W[j++]=D,W[j++]=D+F,W[j++]=D+F+1;var K=0;if(_.st){var Q=Math.max(l,g);for(F=0;F<O;F++){var X=a.o.fromArray(T,3*F,A);C[K++]=(X.x+Q)/(2*Q),C[K++]=(X.y+Q)/(2*Q)}}var $=new p.a;_.position&&($.position=new f.o({componentDatatype:r.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:T})),_.normal&&($.normal=new f.o({componentDatatype:r.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:L})),_.tangent&&($.tangent=new f.o({componentDatatype:r.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:P})),_.bitangent&&($.bitangent=new f.o({componentDatatype:r.ComponentDatatype.FLOAT,componentsPerAttribute:3,values:z})),_.st&&($.st=new f.o({componentDatatype:r.ComponentDatatype.FLOAT,componentsPerAttribute:2,values:C})),y.x=.5*u,y.y=Math.max(g,l);var tt=new o.i(a.o.ZERO,n.o.magnitude(y));if(s.e(t._offsetAttribute)){u=T.length;var et=new Uint8Array(u/3),ot=t._offsetAttribute===m.z.NONE?0:1;e.d(et,ot),$.applyOffset=new f.o({componentDatatype:r.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:1,values:et})}return new f.I({attributes:$,indices:W,primitiveType:b._0x5eacd0.TRIANGLES,boundingSphere:tt,offsetAttribute:t._offsetAttribute})}},g.getUnitCylinder=function(){return s.e(_)||(_=g.createGeometry(new g({topRadius:1,bottomRadius:1,length:1,vertexFormat:l.n.POSITION_ONLY}))),_},t.l=g}));