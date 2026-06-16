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
var _0x53eb7c=_0x5cad;(function(_0x33b550,_0x54c4b0){var _0x4b5246=_0x5cad,_0x25ecb5=_0x33b550();while(!![]){try{var _0x1409c5=parseInt(_0x4b5246(0x138))/0x1*(-parseInt(_0x4b5246(0x13a))/0x2)+parseInt(_0x4b5246(0x135))/0x3+-parseInt(_0x4b5246(0x140))/0x4+parseInt(_0x4b5246(0x147))/0x5*(parseInt(_0x4b5246(0x146))/0x6)+-parseInt(_0x4b5246(0x13d))/0x7*(-parseInt(_0x4b5246(0x13c))/0x8)+-parseInt(_0x4b5246(0x143))/0x9+parseInt(_0x4b5246(0x141))/0xa*(-parseInt(_0x4b5246(0x13b))/0xb);if(_0x1409c5===_0x54c4b0)break;else _0x25ecb5['push'](_0x25ecb5['shift']());}catch(_0x8ab515){_0x25ecb5['push'](_0x25ecb5['shift']());}}}(_0x3b14,0x9a70d));function _0x3b14(){var _0x2ea0c1=['LOWER_MASK','4728456jjrRRE','getTime','prototype','126MlfdnM','197840AAmpCN','MATRIX_A','1700676VEPURi','random','init_genrand','1ILFHNh','mti','434018CIlGNn','725934qPISYj','7392152rKBlgH','7qLKpOB','genrand_int32','UPPER_MASK','2995500gqEFTs','30BiwUzC'];_0x3b14=function(){return _0x2ea0c1;};return _0x3b14();}var MersenneTwister=function(_0x1ae0c0){var _0x41b87a=_0x5cad;_0x1ae0c0==undefined&&(_0x1ae0c0=new Date()[_0x41b87a(0x144)]()),this['N']=0x270,this['M']=0x18d,this[_0x41b87a(0x148)]=0x9908b0df,this[_0x41b87a(0x13f)]=0x80000000,this['LOWER_MASK']=0x7fffffff,this['mt']=new Array(this['N']),this['mti']=this['N']+0x1,this[_0x41b87a(0x137)](_0x1ae0c0);};function _0x5cad(_0x2837f7,_0x25d043){var _0x3b1492=_0x3b14();return _0x5cad=function(_0x5cad9a,_0x1db497){_0x5cad9a=_0x5cad9a-0x135;var _0x4a9777=_0x3b1492[_0x5cad9a];return _0x4a9777;},_0x5cad(_0x2837f7,_0x25d043);}MersenneTwister[_0x53eb7c(0x145)][_0x53eb7c(0x137)]=function(_0xc53204){var _0x49605e=_0x53eb7c;this['mt'][0x0]=_0xc53204>>>0x0;for(this['mti']=0x1;this[_0x49605e(0x139)]<this['N'];this[_0x49605e(0x139)]++){var _0xc53204=this['mt'][this[_0x49605e(0x139)]-0x1]^this['mt'][this[_0x49605e(0x139)]-0x1]>>>0x1e;this['mt'][this[_0x49605e(0x139)]]=(((_0xc53204&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0xc53204&0xffff)*0x6c078965+this[_0x49605e(0x139)],this['mt'][this['mti']]>>>=0x0;}},MersenneTwister[_0x53eb7c(0x145)][_0x53eb7c(0x13e)]=function(){var _0x51ec95=_0x53eb7c,_0x46509b,_0x38d2a2=new Array(0x0,this['MATRIX_A']);if(this[_0x51ec95(0x139)]>=this['N']){var _0x43ea88;if(this[_0x51ec95(0x139)]==this['N']+0x1)this['init_genrand'](0x1571);for(_0x43ea88=0x0;_0x43ea88<this['N']-this['M'];_0x43ea88++){_0x46509b=this['mt'][_0x43ea88]&this[_0x51ec95(0x13f)]|this['mt'][_0x43ea88+0x1]&this[_0x51ec95(0x142)],this['mt'][_0x43ea88]=this['mt'][_0x43ea88+this['M']]^_0x46509b>>>0x1^_0x38d2a2[_0x46509b&0x1];}for(;_0x43ea88<this['N']-0x1;_0x43ea88++){_0x46509b=this['mt'][_0x43ea88]&this[_0x51ec95(0x13f)]|this['mt'][_0x43ea88+0x1]&this[_0x51ec95(0x142)],this['mt'][_0x43ea88]=this['mt'][_0x43ea88+(this['M']-this['N'])]^_0x46509b>>>0x1^_0x38d2a2[_0x46509b&0x1];}_0x46509b=this['mt'][this['N']-0x1]&this[_0x51ec95(0x13f)]|this['mt'][0x0]&this['LOWER_MASK'],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x46509b>>>0x1^_0x38d2a2[_0x46509b&0x1],this[_0x51ec95(0x139)]=0x0;}return _0x46509b=this['mt'][this[_0x51ec95(0x139)]++],_0x46509b^=_0x46509b>>>0xb,_0x46509b^=_0x46509b<<0x7&0x9d2c5680,_0x46509b^=_0x46509b<<0xf&0xefc60000,_0x46509b^=_0x46509b>>>0x12,_0x46509b>>>0x0;},MersenneTwister[_0x53eb7c(0x145)][_0x53eb7c(0x136)]=function(){var _0xeac61d=_0x53eb7c;return this[_0xeac61d(0x13e)]()*(0x1/0x100000000);};