define(["exports","./buildModuleUrl-1b968a9d","./ComponentDatatype-7d28dd1c","./when-39df26e1","./Check-ff445961","./Cartesian2-59a54ee7","./GeometryAttribute-9b3921a3","./GeometryAttributes-11421d3c","./GeometryPipeline-91e3b4f0","./IndexDatatype-be421fbf","./FeatureDetection-2d4141ff","./WebMercatorProjection-9bf14d38"],(function(e,t,r,n,o,i,a,s,p,c,u,f){"use strict";function m(e,t,r){e=n.u(e,0),t=n.u(t,0),r=n.u(r,0),this.value=new Float32Array([e,t,r])}function d(e,t){var n=e.attributes,o=n.position,i=o.values.length/o.componentsPerAttribute;n.batchId=new a.o({componentDatatype:r.ComponentDatatype.FLOAT,componentsPerAttribute:1,values:new Float32Array(i)});for(var s=n.batchId.values,p=0;p<i;++p)s[p]=t}function h(e){var i,a,s,c=e.instances,f=e.projection,m=e.elementIndexUintSupported,h=e.scene3DOnly,l=e.vertexCacheOptimize,g=e.compressVertices,y=e.modelMatrix,b=c.length;for(i=0;i<b;++i)if(n.e(c[i].geometry)){s=c[i].geometry.primitiveType;break}for(i=1;i<b;++i)if(n.e(c[i].geometry)&&c[i].geometry.primitiveType!==s)throw new o.t("All instance geometries must have the same primitiveType.");if(function(e,t,r){var o,i=!r,a=e.length;if(!i&&a>1){var s=e[0].modelMatrix;for(o=1;o<a;++o)if(!u.p.equals(s,e[o].modelMatrix)){i=!0;break}}if(i)for(o=0;o<a;++o)n.e(e[o].geometry)&&p.k.transformToWorldCoordinates(e[o]);else u.p.multiplyTransformation(t,e[0].modelMatrix,t)}(c,y,h),!h)for(i=0;i<b;++i)n.e(c[i].geometry)&&p.k.splitLongitude(c[i]);if(function(e){for(var t=e.length,r=0;r<t;++r){var o=e[r];n.e(o.geometry)?d(o.geometry,r):n.e(o.westHemisphereGeometry)&&n.e(o.eastHemisphereGeometry)&&(d(o.westHemisphereGeometry,r),d(o.eastHemisphereGeometry,r))}}(c),l)for(i=0;i<b;++i){var v=c[i];n.e(v.geometry)?(p.k.reorderForPostVertexCache(v.geometry),p.k.reorderForPreVertexCache(v.geometry)):n.e(v.westHemisphereGeometry)&&n.e(v.eastHemisphereGeometry)&&(p.k.reorderForPostVertexCache(v.westHemisphereGeometry),p.k.reorderForPreVertexCache(v.westHemisphereGeometry),p.k.reorderForPostVertexCache(v.eastHemisphereGeometry),p.k.reorderForPreVertexCache(v.eastHemisphereGeometry))}var k=p.k.combineInstances(c);for(b=k.length,i=0;i<b;++i){var x,C=(a=k[i]).attributes;if(h)for(x in C)C.hasOwnProperty(x)&&C[x].componentDatatype===r.ComponentDatatype.DOUBLE&&p.k.encodeAttribute(a,x,x+"3DHigh",x+"3DLow");else for(x in C)if(C.hasOwnProperty(x)&&C[x].componentDatatype===r.ComponentDatatype.DOUBLE){var w=x+"3D",S=x+"2D";p.k.projectTo2D(a,x,w,S,f),n.e(a.boundingSphere)&&"position"===x&&(a.boundingSphereCV=t.i.fromVertices(a.attributes.position2D.values)),p.k.encodeAttribute(a,w,w+"High",w+"Low"),p.k.encodeAttribute(a,S,S+"High",S+"Low")}g&&p.k.compressVertices(a)}if(!m){var A=[];for(b=k.length,i=0;i<b;++i)a=k[i],A=A.concat(p.k.fitToUnsignedShortIndices(a));k=A}return k}function l(e,t,r,o){var i,a,s,p=o.length-1;if(p>=0){var c=o[p];i=c.offset+c.count,a=r[s=c.index].indices.length}else i=0,a=r[s=0].indices.length;for(var u=e.length,f=0;f<u;++f){var m=e[f][t];if(n.e(m)){var d=m.indices.length;i+d>a&&(i=0,a=r[++s].indices.length),o.push({index:s,offset:i,count:d}),i+=d}}}Object.defineProperties(m.prototype,{componentDatatype:{get:function(){return r.ComponentDatatype.FLOAT}},componentsPerAttribute:{get:function(){return 3}},normalize:{get:function(){return!1}}}),m.fromCartesian3=function(e){return o.o.defined("offset",e),new m(e.x,e.y,e.z)},m.toValue=function(e,t){return o.o.defined("offset",e),n.e(t)||(t=new Float32Array([e.x,e.y,e.z])),t[0]=e.x,t[1]=e.y,t[2]=e.z,t};var g={};function y(e,t){var r=e.attributes;for(var o in r)if(r.hasOwnProperty(o)){var i=r[o];n.e(i)&&n.e(i.values)&&t.push(i.values.buffer)}n.e(e.indices)&&t.push(e.indices.buffer)}function b(e,t){var r=e.length,o=new Float64Array(1+19*r),i=0;o[i++]=r;for(var a=0;a<r;a++){var s=e[a];if(u.p.pack(s.modelMatrix,o,i),i+=u.p.packedLength,n.e(s.attributes)&&n.e(s.attributes.offset)){var p=s.attributes.offset.value;o[i]=p[0],o[i+1]=p[1],o[i+2]=p[2]}i+=3}return t.push(o.buffer),o}function v(e){for(var t=e,r=new Array(t[0]),o=0,i=1;i<t.length;){var a,s=u.p.unpack(t,i);i+=u.p.packedLength,n.e(t[i])&&(a={offset:new m(t[i],t[i+1],t[i+2])}),i+=3,r[o++]={modelMatrix:s,attributes:a}}return r}function k(e){var r=e.length,o=1+(t.i.packedLength+1)*r,i=new Float32Array(o),a=0;i[a++]=r;for(var s=0;s<r;++s){var p=e[s];n.e(p)?(i[a++]=1,t.i.pack(e[s],i,a)):i[a++]=0,a+=t.i.packedLength}return i}function x(e){for(var r=new Array(e[0]),n=0,o=1;o<e.length;)1===e[o++]&&(r[n]=t.i.unpack(e,o)),++n,o+=t.i.packedLength;return r}g.combineGeometry=function(e){var r,o,i,a,s=e.instances,c=s.length,u=!1;c>0&&((r=h(e)).length>0&&(o=p.k.createAttributeLocations(r[0]),e.createPickOffsets&&(i=function(e,t){var r=[];return l(e,"geometry",t,r),l(e,"westHemisphereGeometry",t,r),l(e,"eastHemisphereGeometry",t,r),r}(s,r))),n.e(s[0].attributes)&&n.e(s[0].attributes.offset)&&(a=new Array(c),u=!0));for(var f=new Array(c),m=new Array(c),d=0;d<c;++d){var g=s[d],y=g.geometry;n.e(y)&&(f[d]=y.boundingSphere,m[d]=y.boundingSphereCV,u&&(a[d]=g.geometry.offsetAttribute));var b=g.eastHemisphereGeometry,v=g.westHemisphereGeometry;n.e(b)&&n.e(v)&&(n.e(b.boundingSphere)&&n.e(v.boundingSphere)&&(f[d]=t.i.union(b.boundingSphere,v.boundingSphere)),n.e(b.boundingSphereCV)&&n.e(v.boundingSphereCV)&&(m[d]=t.i.union(b.boundingSphereCV,v.boundingSphereCV)))}return{geometries:r,modelMatrix:e.modelMatrix,attributeLocations:o,pickOffsets:i,offsetInstanceExtend:a,boundingSpheres:f,boundingSpheresCV:m}},g.packCreateGeometryResults=function(e,r){var o=new Float64Array(function(e){for(var r=1,o=e.length,i=0;i<o;i++){var a=e[i];if(++r,n.e(a)){var s=a.attributes;for(var p in r+=7+2*t.i.packedLength+(n.e(a.indices)?a.indices.length:0),s)s.hasOwnProperty(p)&&n.e(s[p])&&(r+=6+s[p].values.length)}}return r}(e)),i=[],a={},s=e.length,p=0;o[p++]=s;for(var c=0;c<s;c++){var u=e[c],f=n.e(u);if(o[p++]=f?1:0,f){o[p++]=u.primitiveType,o[p++]=u.geometryType,o[p++]=n.u(u.offsetAttribute,-1);var m=n.e(u.boundingSphere)?1:0;o[p++]=m,m&&t.i.pack(u.boundingSphere,o,p),p+=t.i.packedLength;var d=n.e(u.boundingSphereCV)?1:0;o[p++]=d,d&&t.i.pack(u.boundingSphereCV,o,p),p+=t.i.packedLength;var h=u.attributes,l=[];for(var g in h)h.hasOwnProperty(g)&&n.e(h[g])&&(l.push(g),n.e(a[g])||(a[g]=i.length,i.push(g)));o[p++]=l.length;for(var y=0;y<l.length;y++){var b=l[y],v=h[b];o[p++]=a[b],o[p++]=v.componentDatatype,o[p++]=v.componentsPerAttribute,o[p++]=v.normalize?1:0,o[p++]=v.isInstanceAttribute?1:0,o[p++]=v.values.length,o.set(v.values,p),p+=v.values.length}var k=n.e(u.indices)?u.indices.length:0;o[p++]=k,k>0&&(o.set(u.indices,p),p+=k)}}return r.push(o.buffer),{stringTable:i,packedData:o}},g.unpackCreateGeometryResults=function(e){for(var n,o=e.stringTable,i=e.packedData,p=new Array(i[0]),u=0,f=1;f<i.length;){if(1===i[f++]){var m,d,h=i[f++],l=i[f++],g=i[f++];-1===g&&(g=void 0),1===i[f++]&&(m=t.i.unpack(i,f)),f+=t.i.packedLength,1===i[f++]&&(d=t.i.unpack(i,f)),f+=t.i.packedLength;var y,b,v,k,x=new s.a,C=i[f++];for(n=0;n<C;n++){var w=o[i[f++]],S=i[f++];v=i[f++];var A=0!==i[f++],D=0!==i[f++];y=i[f++],b=r.ComponentDatatype.createTypedArray(S,y);for(var G=0;G<y;G++)b[G]=i[f++];x[w]=new a.o({componentDatatype:S,componentsPerAttribute:v,normalize:A,values:b}),D&&(x[w].isInstanceAttribute=!0)}if((y=i[f++])>0){var O=b.length/v;for(k=c.IndexDatatype.createTypedArray(O,y),n=0;n<y;n++)k[n]=i[f++]}p[u++]=new a.I({primitiveType:h,geometryType:l,boundingSphere:m,boundingSphereCV:d,indices:k,attributes:x,offsetAttribute:g})}else p[u++]=void 0}return p},g.packCombineGeometryParameters=function(e,r){for(var n=e.createGeometryResults,o=n.length,i=0;i<o;i++)r.push(n[i].packedData.buffer);return{createGeometryResults:e.createGeometryResults,packedInstances:b(e.instances,r),ellipsoid:e.ellipsoid,isGeographic:e.projection instanceof t.n,elementIndexUintSupported:e.elementIndexUintSupported,scene3DOnly:e.scene3DOnly,vertexCacheOptimize:e.vertexCacheOptimize,compressVertices:e.compressVertices,modelMatrix:e.modelMatrix,createPickOffsets:e.createPickOffsets}},g.unpackCombineGeometryParameters=function(e){for(var r=v(e.packedInstances),n=e.createGeometryResults,o=n.length,a=0,s=0;s<o;s++)for(var p=g.unpackCreateGeometryResults(n[s]),c=p.length,m=0;m<c;m++){var d=p[m];r[a].geometry=d,++a}var h=i.t.clone(e.ellipsoid);return{instances:r,ellipsoid:h,projection:e.isGeographic?new t.n(h):new f.t(h),elementIndexUintSupported:e.elementIndexUintSupported,scene3DOnly:e.scene3DOnly,vertexCacheOptimize:e.vertexCacheOptimize,compressVertices:e.compressVertices,modelMatrix:u.p.clone(e.modelMatrix),createPickOffsets:e.createPickOffsets}},g.packCombineGeometryResults=function(e,t){n.e(e.geometries)&&function(e,t){for(var r=e.length,n=0;n<r;++n)y(e[n],t)}(e.geometries,t);var r=k(e.boundingSpheres),o=k(e.boundingSpheresCV);return t.push(r.buffer,o.buffer),{geometries:e.geometries,attributeLocations:e.attributeLocations,modelMatrix:e.modelMatrix,pickOffsets:e.pickOffsets,offsetInstanceExtend:e.offsetInstanceExtend,boundingSpheres:r,boundingSpheresCV:o}},g.unpackCombineGeometryResults=function(e){return{geometries:e.geometries,attributeLocations:e.attributeLocations,modelMatrix:e.modelMatrix,pickOffsets:e.pickOffsets,offsetInstanceExtend:e.offsetInstanceExtend,boundingSpheres:x(e.boundingSpheres),boundingSpheresCV:x(e.boundingSpheresCV)}},e.k=g}));