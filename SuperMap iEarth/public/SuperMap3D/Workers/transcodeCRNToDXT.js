import{a as R}from"./chunk-36VVQUSW.js";import{a as C}from"./chunk-6ZA5VAZ6.js";import{b as m}from"./chunk-GT3T7K57.js";import{a as D}from"./chunk-AMRCVYIA.js";import{a as F}from"./chunk-6S43R6PL.js";import"./chunk-EHDXVZQM.js";import{a as g}from"./chunk-UBHQMGET.js";import{a as s}from"./chunk-NUC3LT2W.js";import"./chunk-SFC4FDPW.js";/**
 * @license
 *
 * Copyright (c) 2014, Brandon Jones. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this
 *  list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *  this list of conditions and the following disclaimer in the documentation
 *  and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */var A={cCRNFmtInvalid:-1,cCRNFmtDXT1:0,cCRNFmtDXT3:1,cCRNFmtDXT5:2},p={};p[A.cCRNFmtDXT1]=m.RGB_DXT1;p[A.cCRNFmtDXT3]=m.RGBA_DXT3;p[A.cCRNFmtDXT5]=m.RGBA_DXT5;var v,y,N=0,t;function x(a,o,n,r){var e,i=n/4,_=r%4,f=new Uint32Array(a.buffer,0,(r-_)/4),d=new Uint32Array(o.buffer);for(e=0;e<f.length;e++)d[i+e]=f[e];for(e=r-_;e<r;e++)o[n+e]=a[e]}function B(a,o){var n=a.data,r=n.byteLength,e=new Uint8Array(n),i=t._malloc(r);x(e,t.HEAPU8,i,r);var _=t._crn_get_dxt_format(i,r),f=p[_];if(!s(f))throw new F("Unsupported compressed format.");var d=t._crn_get_levels(i,r),w=t._crn_get_width(i,r),l=t._crn_get_height(i,r),c=0,u;for(u=0;u<d;++u)c+=m.compressedTextureSizeInBytes(f,w>>u,l>>u);N<c&&(s(v)&&t._free(v),v=t._malloc(c),y=new Uint8Array(t.HEAPU8.buffer,v,c),N=c),t._crn_decompress(i,r,v,c,0,d),t._free(i);var X=g(a.bMipMap,!1);if(X){var b=y.slice(0,c);return o.push(b.buffer),new C(f,w,l,b)}else{var h=m.compressedTextureSizeInBytes(f,w,l),U=y.subarray(0,h),T=new Uint8Array(h);return T.set(U,0),o.push(T.buffer),new C(f,w,l,T)}}async function M(a,o){let n=a.webAssemblyConfig;return s(n)&&s(n.wasmBinary)?(await R.init(n.wasmBinary),t=R,!0):!1}async function z(a,o){let n=a.webAssemblyConfig;return s(n)?M(a,o):B(a,o)}var O=D(z);export{O as default};
