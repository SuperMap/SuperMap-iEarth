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
var _0x1d1659=_0x2297;function _0x2297(_0x549fd1,_0x2c11ee){var _0x16a40d=_0x16a4();return _0x2297=function(_0x2297f4,_0x3d41bd){_0x2297f4=_0x2297f4-0xbf;var _0x6da3b8=_0x16a40d[_0x2297f4];return _0x6da3b8;},_0x2297(_0x549fd1,_0x2c11ee);}(function(_0x2fd2ee,_0x2f3e0a){var _0x1ad9ca=_0x2297,_0x16141f=_0x2fd2ee();while(!![]){try{var _0x1d3e9c=-parseInt(_0x1ad9ca(0xc7))/0x1*(-parseInt(_0x1ad9ca(0xc6))/0x2)+parseInt(_0x1ad9ca(0xc1))/0x3*(-parseInt(_0x1ad9ca(0xca))/0x4)+-parseInt(_0x1ad9ca(0xc4))/0x5+-parseInt(_0x1ad9ca(0xc8))/0x6+-parseInt(_0x1ad9ca(0xc2))/0x7+-parseInt(_0x1ad9ca(0xce))/0x8*(-parseInt(_0x1ad9ca(0xcf))/0x9)+parseInt(_0x1ad9ca(0xc5))/0xa;if(_0x1d3e9c===_0x2f3e0a)break;else _0x16141f['push'](_0x16141f['shift']());}catch(_0x48da1b){_0x16141f['push'](_0x16141f['shift']());}}}(_0x16a4,0xe094d));var MersenneTwister=function(_0x1b6ac7){var _0x51521d=_0x2297;_0x1b6ac7==undefined&&(_0x1b6ac7=new Date()[_0x51521d(0xc3)]()),this['N']=0x270,this['M']=0x18d,this[_0x51521d(0xcd)]=0x9908b0df,this[_0x51521d(0xd0)]=0x80000000,this[_0x51521d(0xcb)]=0x7fffffff,this['mt']=new Array(this['N']),this[_0x51521d(0xcc)]=this['N']+0x1,this[_0x51521d(0xc9)](_0x1b6ac7);};function _0x16a4(){var _0x435e5a=['getTime','1111170zHzTLK','3457450MEuPIh','362saZYtI','10026OBLyyH','3217404EMFzsV','init_genrand','1708oAoMaW','LOWER_MASK','mti','MATRIX_A','8OqYUWR','10771335KHUOOd','UPPER_MASK','prototype','genrand_int32','6666OPATyE','5110833CupyRL'];_0x16a4=function(){return _0x435e5a;};return _0x16a4();}MersenneTwister['prototype'][_0x1d1659(0xc9)]=function(_0x3ff54d){var _0x1f91dc=_0x1d1659;this['mt'][0x0]=_0x3ff54d>>>0x0;for(this[_0x1f91dc(0xcc)]=0x1;this[_0x1f91dc(0xcc)]<this['N'];this[_0x1f91dc(0xcc)]++){var _0x3ff54d=this['mt'][this[_0x1f91dc(0xcc)]-0x1]^this['mt'][this[_0x1f91dc(0xcc)]-0x1]>>>0x1e;this['mt'][this[_0x1f91dc(0xcc)]]=(((_0x3ff54d&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x3ff54d&0xffff)*0x6c078965+this[_0x1f91dc(0xcc)],this['mt'][this['mti']]>>>=0x0;}},MersenneTwister[_0x1d1659(0xbf)][_0x1d1659(0xc0)]=function(){var _0x31b06f=_0x1d1659,_0x259cb6,_0x4ebc67=new Array(0x0,this[_0x31b06f(0xcd)]);if(this['mti']>=this['N']){var _0x210e42;if(this[_0x31b06f(0xcc)]==this['N']+0x1)this['init_genrand'](0x1571);for(_0x210e42=0x0;_0x210e42<this['N']-this['M'];_0x210e42++){_0x259cb6=this['mt'][_0x210e42]&this[_0x31b06f(0xd0)]|this['mt'][_0x210e42+0x1]&this[_0x31b06f(0xcb)],this['mt'][_0x210e42]=this['mt'][_0x210e42+this['M']]^_0x259cb6>>>0x1^_0x4ebc67[_0x259cb6&0x1];}for(;_0x210e42<this['N']-0x1;_0x210e42++){_0x259cb6=this['mt'][_0x210e42]&this[_0x31b06f(0xd0)]|this['mt'][_0x210e42+0x1]&this[_0x31b06f(0xcb)],this['mt'][_0x210e42]=this['mt'][_0x210e42+(this['M']-this['N'])]^_0x259cb6>>>0x1^_0x4ebc67[_0x259cb6&0x1];}_0x259cb6=this['mt'][this['N']-0x1]&this[_0x31b06f(0xd0)]|this['mt'][0x0]&this['LOWER_MASK'],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x259cb6>>>0x1^_0x4ebc67[_0x259cb6&0x1],this[_0x31b06f(0xcc)]=0x0;}return _0x259cb6=this['mt'][this['mti']++],_0x259cb6^=_0x259cb6>>>0xb,_0x259cb6^=_0x259cb6<<0x7&0x9d2c5680,_0x259cb6^=_0x259cb6<<0xf&0xefc60000,_0x259cb6^=_0x259cb6>>>0x12,_0x259cb6>>>0x0;},MersenneTwister[_0x1d1659(0xbf)]['random']=function(){var _0x4aebe0=_0x1d1659;return this[_0x4aebe0(0xc0)]()*(0x1/0x100000000);};