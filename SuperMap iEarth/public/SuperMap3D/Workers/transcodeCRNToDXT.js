define(["./CompressedTextureBuffer-58c71280","./defaultValue-2110bb17","./PixelFormat-e54716df","./RuntimeError-6daf0e01","./createTaskProcessorWorker","./WebGLConstants-92042d9e"],(function(e,r,t,n,a,s){"use strict";
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
     */var f,o,i=1,u=2,l={};l[0]=t.PixelFormat.RGB_DXT1,l[i]=t.PixelFormat.RGBA_DXT3,l[u]=t.PixelFormat.RGBA_DXT5;var c,_=0;function m(a,s){var i=a.data,u=i.byteLength,m=new Uint8Array(i),d=c._malloc(u);!function(e,r,t,n){var a,s=t/4,f=n%4,o=new Uint32Array(e.buffer,0,(n-f)/4),i=new Uint32Array(r.buffer);for(a=0;a<o.length;a++)i[s+a]=o[a];for(a=n-f;a<n;a++)r[t+a]=e[a]}(m,c.HEAPU8,d,u);var b=c._crn_get_dxt_format(d,u),p=l[b];if(!r.e(p))throw new n.t("Unsupported compressed format.");var w,y=c._crn_get_levels(d,u),g=c._crn_get_width(d,u),v=c._crn_get_height(d,u),x=0;for(w=0;w<y;++w)x+=t.PixelFormat.compressedTextureSizeInBytes(p,g>>w,v>>w);if(_<x&&(r.e(f)&&c._free(f),f=c._malloc(x),o=new Uint8Array(c.HEAPU8.buffer,f,x),_=x),c._crn_decompress(d,u,f,x,0,y),c._free(d),r.u(a.bMipMap,!1)){var A=o.slice(0,x);return s.push(A.buffer),new e.e(p,g,v,A)}var P=t.PixelFormat.compressedTextureSizeInBytes(p,g,v),h=o.subarray(0,P),U=new Uint8Array(P);return U.set(h,0),s.push(U.buffer),new e.e(p,g,v,U)}function d(e){c=e,self.onmessage=a(m),self.postMessage(!0)}return function(e){var t=e.data.webAssemblyConfig;if(r.e(t))return require([t.modulePath],(function(e){r.e(t.wasmBinaryFile)?(r.e(e)||(e=self.Module),d(e)):d(e)}))}}));
