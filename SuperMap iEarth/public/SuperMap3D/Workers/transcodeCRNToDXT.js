define(["./CompressedTextureBuffer-2887af78","./when-7d8885d2","./PixelFormat-2a9a60eb","./RuntimeError-f53bcb51","./createTaskProcessorWorker","./WebGLConstants-6b41cc89"],(function(e,r,n,t,f,a){"use strict";
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
     */var i,o,s=1,u=2,d={};d[0]=n.PixelFormat.RGB_DXT1,d[s]=n.PixelFormat.RGBA_DXT3,d[u]=n.PixelFormat.RGBA_DXT5;var c,l=0;function m(f,a){var s=f.data,u=s.byteLength,m=new Uint8Array(s),_=c._malloc(u);!function(e,r,n,t){var f,a=n/4,i=t%4,o=new Uint32Array(e.buffer,0,(t-i)/4),s=new Uint32Array(r.buffer);for(f=0;f<o.length;f++)s[a+f]=o[f];for(f=t-i;f<t;f++)r[n+f]=e[f]}(m,c.HEAPU8,_,u);var b=c._crn_get_dxt_format(_,u),p=d[b];if(!r.defined(p))throw new t.RuntimeError("Unsupported compressed format.");var w,x=c._crn_get_levels(_,u),y=c._crn_get_width(_,u),g=c._crn_get_height(_,u),h=0;for(w=0;w<x;++w)h+=n.PixelFormat.compressedTextureSizeInBytes(p,y>>w,g>>w);if(l<h&&(r.defined(i)&&c._free(i),i=c._malloc(h),o=new Uint8Array(c.HEAPU8.buffer,i,h),l=h),c._crn_decompress(_,u,i,h,0,x),c._free(_),r.defaultValue(f.bMipMap,!1)){var v=o.slice(0,h);return a.push(v.buffer),new e.CompressedTextureBuffer(p,y,g,v)}var A=n.PixelFormat.compressedTextureSizeInBytes(p,y,g),P=o.subarray(0,A),B=new Uint8Array(A);return B.set(P,0),a.push(B.buffer),new e.CompressedTextureBuffer(p,y,g,B)}function _(e){(c=e).onRuntimeInitialized=function(){},self.onmessage=f(m),self.postMessage(!0)}return function(e){var n=e.data.webAssemblyConfig;if(r.defined(n))return require([n.modulePath],(function(e){r.defined(n.wasmBinaryFile)?(r.defined(e)||(e=self.Module),_(e)):_(e)}))}}));
