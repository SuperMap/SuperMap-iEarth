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
var _0xc4e4e4=_0x50e0;function _0x166c(){var _0x547f3a=['664664hFuQPF','546610WSuFxt','genrand_int32','mti','1393BNGIkX','10936PpDKIC','init_genrand','random','prototype','94otJJTh','770AUkzMA','126kvxGNj','getTime','77310irVKaz','12rzuhUu','UPPER_MASK','393036pmriAU','LOWER_MASK','57006dakPmY','1062319IOoSVl'];_0x166c=function(){return _0x547f3a;};return _0x166c();}function _0x50e0(_0x39f86b,_0x56ec5b){var _0x166c57=_0x166c();return _0x50e0=function(_0x50e0dc,_0x2e6b0a){_0x50e0dc=_0x50e0dc-0xcc;var _0x1e181d=_0x166c57[_0x50e0dc];return _0x1e181d;},_0x50e0(_0x39f86b,_0x56ec5b);}(function(_0x315646,_0xc387ca){var _0x113d40=_0x50e0,_0x9d0067=_0x315646();while(!![]){try{var _0x244a35=-parseInt(_0x113d40(0xdc))/0x1+parseInt(_0x113d40(0xd2))/0x2*(-parseInt(_0x113d40(0xdb))/0x3)+-parseInt(_0x113d40(0xdd))/0x4+parseInt(_0x113d40(0xde))/0x5*(parseInt(_0x113d40(0xd7))/0x6)+parseInt(_0x113d40(0xcd))/0x7*(parseInt(_0x113d40(0xce))/0x8)+-parseInt(_0x113d40(0xd4))/0x9*(parseInt(_0x113d40(0xd6))/0xa)+parseInt(_0x113d40(0xd3))/0xb*(parseInt(_0x113d40(0xd9))/0xc);if(_0x244a35===_0xc387ca)break;else _0x9d0067['push'](_0x9d0067['shift']());}catch(_0x55455b){_0x9d0067['push'](_0x9d0067['shift']());}}}(_0x166c,0x87266));var MersenneTwister=function(_0x229567){var _0x441eaf=_0x50e0;_0x229567==undefined&&(_0x229567=new Date()[_0x441eaf(0xd5)]()),this['N']=0x270,this['M']=0x18d,this['MATRIX_A']=0x9908b0df,this['UPPER_MASK']=0x80000000,this[_0x441eaf(0xda)]=0x7fffffff,this['mt']=new Array(this['N']),this[_0x441eaf(0xcc)]=this['N']+0x1,this[_0x441eaf(0xcf)](_0x229567);};MersenneTwister[_0xc4e4e4(0xd1)][_0xc4e4e4(0xcf)]=function(_0x53d575){var _0x477783=_0xc4e4e4;this['mt'][0x0]=_0x53d575>>>0x0;for(this[_0x477783(0xcc)]=0x1;this['mti']<this['N'];this[_0x477783(0xcc)]++){var _0x53d575=this['mt'][this['mti']-0x1]^this['mt'][this[_0x477783(0xcc)]-0x1]>>>0x1e;this['mt'][this[_0x477783(0xcc)]]=(((_0x53d575&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x53d575&0xffff)*0x6c078965+this[_0x477783(0xcc)],this['mt'][this[_0x477783(0xcc)]]>>>=0x0;}},MersenneTwister[_0xc4e4e4(0xd1)][_0xc4e4e4(0xdf)]=function(){var _0x59df4a=_0xc4e4e4,_0x11b717,_0xe2df5b=new Array(0x0,this['MATRIX_A']);if(this[_0x59df4a(0xcc)]>=this['N']){var _0x5676b6;if(this[_0x59df4a(0xcc)]==this['N']+0x1)this[_0x59df4a(0xcf)](0x1571);for(_0x5676b6=0x0;_0x5676b6<this['N']-this['M'];_0x5676b6++){_0x11b717=this['mt'][_0x5676b6]&this[_0x59df4a(0xd8)]|this['mt'][_0x5676b6+0x1]&this[_0x59df4a(0xda)],this['mt'][_0x5676b6]=this['mt'][_0x5676b6+this['M']]^_0x11b717>>>0x1^_0xe2df5b[_0x11b717&0x1];}for(;_0x5676b6<this['N']-0x1;_0x5676b6++){_0x11b717=this['mt'][_0x5676b6]&this[_0x59df4a(0xd8)]|this['mt'][_0x5676b6+0x1]&this[_0x59df4a(0xda)],this['mt'][_0x5676b6]=this['mt'][_0x5676b6+(this['M']-this['N'])]^_0x11b717>>>0x1^_0xe2df5b[_0x11b717&0x1];}_0x11b717=this['mt'][this['N']-0x1]&this[_0x59df4a(0xd8)]|this['mt'][0x0]&this['LOWER_MASK'],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x11b717>>>0x1^_0xe2df5b[_0x11b717&0x1],this['mti']=0x0;}return _0x11b717=this['mt'][this['mti']++],_0x11b717^=_0x11b717>>>0xb,_0x11b717^=_0x11b717<<0x7&0x9d2c5680,_0x11b717^=_0x11b717<<0xf&0xefc60000,_0x11b717^=_0x11b717>>>0x12,_0x11b717>>>0x0;},MersenneTwister[_0xc4e4e4(0xd1)][_0xc4e4e4(0xd0)]=function(){return this['genrand_int32']()*(0x1/0x100000000);};