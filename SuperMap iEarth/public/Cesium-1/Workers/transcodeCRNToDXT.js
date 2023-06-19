define(["./CompressedTextureBuffer-290a1ff4","./when-b60132fc","./PixelFormat-9345f1c7","./RuntimeError-4a5c8994","./createTaskProcessorWorker","./WebGLConstants-4ae0db90"],(function(e,r,t,n,f,a){"use strict";
/**
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
     */var s,i,o=1,u=2,d={};d[0]=t.PixelFormat.RGB_DXT1,d[o]=t.PixelFormat.RGBA_DXT3,d[u]=t.PixelFormat.RGBA_DXT5;var c,l=0;function m(f,a){var o=f.data,u=o.byteLength,m=new Uint8Array(o),_=c._malloc(u);!function(e,r,t,n){var f,a=t/4,s=n%4,i=new Uint32Array(e.buffer,0,(n-s)/4),o=new Uint32Array(r.buffer);for(f=0;f<i.length;f++)o[a+f]=i[f];for(f=n-s;f<n;f++)r[t+f]=e[f]}(m,c.HEAPU8,_,u);var p=c._crn_get_dxt_format(_,u),b=d[p];if(!r.defined(b))throw new n.RuntimeError("Unsupported compressed format.");var w,x=c._crn_get_levels(_,u),y=c._crn_get_width(_,u),g=c._crn_get_height(_,u),h=0;for(w=0;w<x;++w)h+=t.PixelFormat.compressedTextureSizeInBytes(b,y>>w,g>>w);if(l<h&&(r.defined(s)&&c._free(s),s=c._malloc(h),i=new Uint8Array(c.HEAPU8.buffer,s,h),l=h),c._crn_decompress(_,u,s,h,0,x),c._free(_),r.defaultValue(f.bMipMap,!1)){var v=i.slice(0,h);return a.push(v.buffer),new e.CompressedTextureBuffer(b,y,g,v)}var A=t.PixelFormat.compressedTextureSizeInBytes(b,y,g),P=i.subarray(0,A),B=new Uint8Array(A);return B.set(P,0),a.push(B.buffer),new e.CompressedTextureBuffer(b,y,g,B)}function _(e){c=e,self.onmessage=f(m),self.postMessage(!0)}return function(e){var t=e.data.webAssemblyConfig;if(r.defined(t))return require([t.modulePath],(function(e){r.defined(t.wasmBinaryFile)?(r.defined(e)||(e=self.Module),_(e)):_(e)}))}}));
