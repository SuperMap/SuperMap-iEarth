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
var _0x5d2b59=_0x4443;function _0x4443(_0x257487,_0x4115a6){var _0x13ed2f=_0x13ed();return _0x4443=function(_0x444300,_0x4832d0){_0x444300=_0x444300-0xee;var _0x427b76=_0x13ed2f[_0x444300];return _0x427b76;},_0x4443(_0x257487,_0x4115a6);}(function(_0x3d4941,_0x35dc05){var _0x23c47a=_0x4443,_0x172fcd=_0x3d4941();while(!![]){try{var _0x371391=-parseInt(_0x23c47a(0xef))/0x1+-parseInt(_0x23c47a(0xff))/0x2+-parseInt(_0x23c47a(0xf3))/0x3+-parseInt(_0x23c47a(0xf7))/0x4*(-parseInt(_0x23c47a(0xfd))/0x5)+parseInt(_0x23c47a(0xfa))/0x6+-parseInt(_0x23c47a(0xf5))/0x7+parseInt(_0x23c47a(0xf6))/0x8*(parseInt(_0x23c47a(0xf8))/0x9);if(_0x371391===_0x35dc05)break;else _0x172fcd['push'](_0x172fcd['shift']());}catch(_0x5acff4){_0x172fcd['push'](_0x172fcd['shift']());}}}(_0x13ed,0x4d628));var MersenneTwister=function(_0xf67efc){var _0x3f33e7=_0x4443;_0xf67efc==undefined&&(_0xf67efc=new Date()[_0x3f33e7(0xfc)]()),this['N']=0x270,this['M']=0x18d,this[_0x3f33e7(0xf2)]=0x9908b0df,this[_0x3f33e7(0xfb)]=0x80000000,this[_0x3f33e7(0xee)]=0x7fffffff,this['mt']=new Array(this['N']),this[_0x3f33e7(0xf4)]=this['N']+0x1,this[_0x3f33e7(0xf1)](_0xf67efc);};function _0x13ed(){var _0x255403=['genrand_int32','2191554ctjmGr','UPPER_MASK','getTime','1491460cIpDja','random','963940CABCvq','LOWER_MASK','385346KvzIJD','prototype','init_genrand','MATRIX_A','1313799pRvWiA','mti','3660069pxonGV','697192xTQMwU','4KcgxgS','153VFpZRe'];_0x13ed=function(){return _0x255403;};return _0x13ed();}MersenneTwister[_0x5d2b59(0xf0)][_0x5d2b59(0xf1)]=function(_0x216b28){var _0x3963ed=_0x5d2b59;this['mt'][0x0]=_0x216b28>>>0x0;for(this['mti']=0x1;this[_0x3963ed(0xf4)]<this['N'];this[_0x3963ed(0xf4)]++){var _0x216b28=this['mt'][this['mti']-0x1]^this['mt'][this[_0x3963ed(0xf4)]-0x1]>>>0x1e;this['mt'][this[_0x3963ed(0xf4)]]=(((_0x216b28&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x216b28&0xffff)*0x6c078965+this[_0x3963ed(0xf4)],this['mt'][this[_0x3963ed(0xf4)]]>>>=0x0;}},MersenneTwister[_0x5d2b59(0xf0)]['genrand_int32']=function(){var _0x3c2b57=_0x5d2b59,_0x5e73a3,_0x540c7b=new Array(0x0,this['MATRIX_A']);if(this[_0x3c2b57(0xf4)]>=this['N']){var _0x24b8f2;if(this[_0x3c2b57(0xf4)]==this['N']+0x1)this[_0x3c2b57(0xf1)](0x1571);for(_0x24b8f2=0x0;_0x24b8f2<this['N']-this['M'];_0x24b8f2++){_0x5e73a3=this['mt'][_0x24b8f2]&this[_0x3c2b57(0xfb)]|this['mt'][_0x24b8f2+0x1]&this[_0x3c2b57(0xee)],this['mt'][_0x24b8f2]=this['mt'][_0x24b8f2+this['M']]^_0x5e73a3>>>0x1^_0x540c7b[_0x5e73a3&0x1];}for(;_0x24b8f2<this['N']-0x1;_0x24b8f2++){_0x5e73a3=this['mt'][_0x24b8f2]&this[_0x3c2b57(0xfb)]|this['mt'][_0x24b8f2+0x1]&this[_0x3c2b57(0xee)],this['mt'][_0x24b8f2]=this['mt'][_0x24b8f2+(this['M']-this['N'])]^_0x5e73a3>>>0x1^_0x540c7b[_0x5e73a3&0x1];}_0x5e73a3=this['mt'][this['N']-0x1]&this['UPPER_MASK']|this['mt'][0x0]&this[_0x3c2b57(0xee)],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x5e73a3>>>0x1^_0x540c7b[_0x5e73a3&0x1],this[_0x3c2b57(0xf4)]=0x0;}return _0x5e73a3=this['mt'][this[_0x3c2b57(0xf4)]++],_0x5e73a3^=_0x5e73a3>>>0xb,_0x5e73a3^=_0x5e73a3<<0x7&0x9d2c5680,_0x5e73a3^=_0x5e73a3<<0xf&0xefc60000,_0x5e73a3^=_0x5e73a3>>>0x12,_0x5e73a3>>>0x0;},MersenneTwister['prototype'][_0x5d2b59(0xfe)]=function(){var _0x5a4b20=_0x5d2b59;return this[_0x5a4b20(0xf9)]()*(0x1/0x100000000);};