/**
@license

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var _0xb054d4=_0x4759;(function(_0x4ce9f3,_0x44b1cd){var _0x52e802=_0x4759,_0x5c237c=_0x4ce9f3();while(!![]){try{var _0x1e3a10=parseInt(_0x52e802(0x1c9))/0x1*(parseInt(_0x52e802(0x1c3))/0x2)+-parseInt(_0x52e802(0x1c0))/0x3+parseInt(_0x52e802(0x1bf))/0x4*(parseInt(_0x52e802(0x1ca))/0x5)+-parseInt(_0x52e802(0x1cd))/0x6+-parseInt(_0x52e802(0x1c8))/0x7*(parseInt(_0x52e802(0x1cf))/0x8)+-parseInt(_0x52e802(0x1bd))/0x9+-parseInt(_0x52e802(0x1c6))/0xa*(-parseInt(_0x52e802(0x1cc))/0xb);if(_0x1e3a10===_0x44b1cd)break;else _0x5c237c['push'](_0x5c237c['shift']());}catch(_0x260294){_0x5c237c['push'](_0x5c237c['shift']());}}}(_0x3062,0x34dba));function _0x3062(){var _0x4968de=['10koTRFb','UPPER_MASK','13069chzceE','2003FYbhyB','6530hStGBe','random','4248893sMSCgG','90858xAJHkB','mti','184DFuOUU','genrand_int32','2760660UNSCWy','LOWER_MASK','840lFQogo','387804XhdFIg','init_genrand','MATRIX_A','50QrOeyb','getTime','prototype'];_0x3062=function(){return _0x4968de;};return _0x3062();}function _0x4759(_0x27b0bd,_0xf4171d){var _0x30627e=_0x3062();return _0x4759=function(_0x4759c7,_0x415c1b){_0x4759c7=_0x4759c7-0x1bc;var _0x9611e4=_0x30627e[_0x4759c7];return _0x9611e4;},_0x4759(_0x27b0bd,_0xf4171d);}var MersenneTwister=function(_0x30bb66){var _0x19a659=_0x4759;_0x30bb66==undefined&&(_0x30bb66=new Date()[_0x19a659(0x1c4)]()),this['N']=0x270,this['M']=0x18d,this[_0x19a659(0x1c2)]=0x9908b0df,this[_0x19a659(0x1c7)]=0x80000000,this[_0x19a659(0x1be)]=0x7fffffff,this['mt']=new Array(this['N']),this['mti']=this['N']+0x1,this[_0x19a659(0x1c1)](_0x30bb66);};MersenneTwister[_0xb054d4(0x1c5)][_0xb054d4(0x1c1)]=function(_0x48fa28){var _0x10546f=_0xb054d4;this['mt'][0x0]=_0x48fa28>>>0x0;for(this['mti']=0x1;this[_0x10546f(0x1ce)]<this['N'];this[_0x10546f(0x1ce)]++){var _0x48fa28=this['mt'][this['mti']-0x1]^this['mt'][this['mti']-0x1]>>>0x1e;this['mt'][this['mti']]=(((_0x48fa28&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x48fa28&0xffff)*0x6c078965+this['mti'],this['mt'][this[_0x10546f(0x1ce)]]>>>=0x0;}},MersenneTwister[_0xb054d4(0x1c5)][_0xb054d4(0x1bc)]=function(){var _0x1670e0=_0xb054d4,_0x5c273b,_0x5661ac=new Array(0x0,this[_0x1670e0(0x1c2)]);if(this['mti']>=this['N']){var _0x40167d;if(this['mti']==this['N']+0x1)this[_0x1670e0(0x1c1)](0x1571);for(_0x40167d=0x0;_0x40167d<this['N']-this['M'];_0x40167d++){_0x5c273b=this['mt'][_0x40167d]&this['UPPER_MASK']|this['mt'][_0x40167d+0x1]&this['LOWER_MASK'],this['mt'][_0x40167d]=this['mt'][_0x40167d+this['M']]^_0x5c273b>>>0x1^_0x5661ac[_0x5c273b&0x1];}for(;_0x40167d<this['N']-0x1;_0x40167d++){_0x5c273b=this['mt'][_0x40167d]&this[_0x1670e0(0x1c7)]|this['mt'][_0x40167d+0x1]&this[_0x1670e0(0x1be)],this['mt'][_0x40167d]=this['mt'][_0x40167d+(this['M']-this['N'])]^_0x5c273b>>>0x1^_0x5661ac[_0x5c273b&0x1];}_0x5c273b=this['mt'][this['N']-0x1]&this[_0x1670e0(0x1c7)]|this['mt'][0x0]&this['LOWER_MASK'],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x5c273b>>>0x1^_0x5661ac[_0x5c273b&0x1],this[_0x1670e0(0x1ce)]=0x0;}return _0x5c273b=this['mt'][this['mti']++],_0x5c273b^=_0x5c273b>>>0xb,_0x5c273b^=_0x5c273b<<0x7&0x9d2c5680,_0x5c273b^=_0x5c273b<<0xf&0xefc60000,_0x5c273b^=_0x5c273b>>>0x12,_0x5c273b>>>0x0;},MersenneTwister[_0xb054d4(0x1c5)][_0xb054d4(0x1cb)]=function(){return this['genrand_int32']()*(0x1/0x100000000);};