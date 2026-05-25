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
var _0x6c84c4=_0x2c7c;function _0x2c7c(_0x1c9ff8,_0x2673a5){var _0x631f00=_0x631f();return _0x2c7c=function(_0x2c7cd1,_0x541d53){_0x2c7cd1=_0x2c7cd1-0x1db;var _0x2bfb41=_0x631f00[_0x2c7cd1];return _0x2bfb41;},_0x2c7c(_0x1c9ff8,_0x2673a5);}function _0x631f(){var _0x2ffc92=['UPPER_MASK','genrand_int32','random','205twblIq','10jnZjHE','14722cGOasC','MATRIX_A','41rsYzCj','701660UsftuX','mti','LOWER_MASK','4741596ujbfjJ','96387XvfwVZ','35CDSUba','78018OcdQxP','init_genrand','prototype','2730970gPirYf','102056zPcQtq'];_0x631f=function(){return _0x2ffc92;};return _0x631f();}(function(_0x350bce,_0x5ea236){var _0x3fc1e5=_0x2c7c,_0x522975=_0x350bce();while(!![]){try{var _0x3efe34=-parseInt(_0x3fc1e5(0x1e0))/0x1*(-parseInt(_0x3fc1e5(0x1de))/0x2)+-parseInt(_0x3fc1e5(0x1e5))/0x3+-parseInt(_0x3fc1e5(0x1e1))/0x4+-parseInt(_0x3fc1e5(0x1dc))/0x5*(-parseInt(_0x3fc1e5(0x1e7))/0x6)+parseInt(_0x3fc1e5(0x1e6))/0x7*(-parseInt(_0x3fc1e5(0x1eb))/0x8)+parseInt(_0x3fc1e5(0x1e4))/0x9*(-parseInt(_0x3fc1e5(0x1dd))/0xa)+parseInt(_0x3fc1e5(0x1ea))/0xb;if(_0x3efe34===_0x5ea236)break;else _0x522975['push'](_0x522975['shift']());}catch(_0x775b45){_0x522975['push'](_0x522975['shift']());}}}(_0x631f,0x4595d));var MersenneTwister=function(_0x2d1e2d){var _0x32bd33=_0x2c7c;_0x2d1e2d==undefined&&(_0x2d1e2d=new Date()['getTime']()),this['N']=0x270,this['M']=0x18d,this['MATRIX_A']=0x9908b0df,this[_0x32bd33(0x1ec)]=0x80000000,this['LOWER_MASK']=0x7fffffff,this['mt']=new Array(this['N']),this[_0x32bd33(0x1e2)]=this['N']+0x1,this['init_genrand'](_0x2d1e2d);};MersenneTwister[_0x6c84c4(0x1e9)][_0x6c84c4(0x1e8)]=function(_0x564eac){var _0x75fe9f=_0x6c84c4;this['mt'][0x0]=_0x564eac>>>0x0;for(this[_0x75fe9f(0x1e2)]=0x1;this[_0x75fe9f(0x1e2)]<this['N'];this[_0x75fe9f(0x1e2)]++){var _0x564eac=this['mt'][this[_0x75fe9f(0x1e2)]-0x1]^this['mt'][this[_0x75fe9f(0x1e2)]-0x1]>>>0x1e;this['mt'][this[_0x75fe9f(0x1e2)]]=(((_0x564eac&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x564eac&0xffff)*0x6c078965+this['mti'],this['mt'][this[_0x75fe9f(0x1e2)]]>>>=0x0;}},MersenneTwister[_0x6c84c4(0x1e9)][_0x6c84c4(0x1ed)]=function(){var _0x855cf9=_0x6c84c4,_0x2f44d8,_0x52092a=new Array(0x0,this[_0x855cf9(0x1df)]);if(this['mti']>=this['N']){var _0x2d5325;if(this['mti']==this['N']+0x1)this['init_genrand'](0x1571);for(_0x2d5325=0x0;_0x2d5325<this['N']-this['M'];_0x2d5325++){_0x2f44d8=this['mt'][_0x2d5325]&this[_0x855cf9(0x1ec)]|this['mt'][_0x2d5325+0x1]&this['LOWER_MASK'],this['mt'][_0x2d5325]=this['mt'][_0x2d5325+this['M']]^_0x2f44d8>>>0x1^_0x52092a[_0x2f44d8&0x1];}for(;_0x2d5325<this['N']-0x1;_0x2d5325++){_0x2f44d8=this['mt'][_0x2d5325]&this[_0x855cf9(0x1ec)]|this['mt'][_0x2d5325+0x1]&this[_0x855cf9(0x1e3)],this['mt'][_0x2d5325]=this['mt'][_0x2d5325+(this['M']-this['N'])]^_0x2f44d8>>>0x1^_0x52092a[_0x2f44d8&0x1];}_0x2f44d8=this['mt'][this['N']-0x1]&this[_0x855cf9(0x1ec)]|this['mt'][0x0]&this[_0x855cf9(0x1e3)],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x2f44d8>>>0x1^_0x52092a[_0x2f44d8&0x1],this[_0x855cf9(0x1e2)]=0x0;}return _0x2f44d8=this['mt'][this[_0x855cf9(0x1e2)]++],_0x2f44d8^=_0x2f44d8>>>0xb,_0x2f44d8^=_0x2f44d8<<0x7&0x9d2c5680,_0x2f44d8^=_0x2f44d8<<0xf&0xefc60000,_0x2f44d8^=_0x2f44d8>>>0x12,_0x2f44d8>>>0x0;},MersenneTwister[_0x6c84c4(0x1e9)][_0x6c84c4(0x1db)]=function(){var _0x5408af=_0x6c84c4;return this[_0x5408af(0x1ed)]()*(0x1/0x100000000);};