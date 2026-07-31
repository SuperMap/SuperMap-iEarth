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
function _0x43df(){var _0xcf021a=['MATRIX_A','102FkqOuI','275224WUQArR','1766662almmon','3449467fErpCe','prototype','977037WJtaiW','genrand_int32','LOWER_MASK','mti','random','UPPER_MASK','12614776BODBnJ','35395WjhmBT','430465hElzWy','init_genrand'];_0x43df=function(){return _0xcf021a;};return _0x43df();}function _0x3977(_0x4e4362,_0x13fa2c){var _0x43dfca=_0x43df();return _0x3977=function(_0x3977af,_0x19c550){_0x3977af=_0x3977af-0x1db;var _0x309d9c=_0x43dfca[_0x3977af];return _0x309d9c;},_0x3977(_0x4e4362,_0x13fa2c);}var _0x3640d9=_0x3977;(function(_0x1faf55,_0x5938a3){var _0x4373a9=_0x3977,_0x4b1434=_0x1faf55();while(!![]){try{var _0x7f6e4c=-parseInt(_0x4373a9(0x1e1))/0x1+-parseInt(_0x4373a9(0x1e6))/0x2+-parseInt(_0x4373a9(0x1e9))/0x3+-parseInt(_0x4373a9(0x1e5))/0x4+-parseInt(_0x4373a9(0x1e0))/0x5*(-parseInt(_0x4373a9(0x1e4))/0x6)+parseInt(_0x4373a9(0x1e7))/0x7+parseInt(_0x4373a9(0x1df))/0x8;if(_0x7f6e4c===_0x5938a3)break;else _0x4b1434['push'](_0x4b1434['shift']());}catch(_0x483eae){_0x4b1434['push'](_0x4b1434['shift']());}}}(_0x43df,0x7599a));var MersenneTwister=function(_0x31daf7){var _0x53bf2a=_0x3977;_0x31daf7==undefined&&(_0x31daf7=new Date()['getTime']()),this['N']=0x270,this['M']=0x18d,this[_0x53bf2a(0x1e3)]=0x9908b0df,this[_0x53bf2a(0x1de)]=0x80000000,this[_0x53bf2a(0x1db)]=0x7fffffff,this['mt']=new Array(this['N']),this['mti']=this['N']+0x1,this[_0x53bf2a(0x1e2)](_0x31daf7);};MersenneTwister[_0x3640d9(0x1e8)][_0x3640d9(0x1e2)]=function(_0x467667){var _0x392c72=_0x3640d9;this['mt'][0x0]=_0x467667>>>0x0;for(this['mti']=0x1;this[_0x392c72(0x1dc)]<this['N'];this[_0x392c72(0x1dc)]++){var _0x467667=this['mt'][this[_0x392c72(0x1dc)]-0x1]^this['mt'][this[_0x392c72(0x1dc)]-0x1]>>>0x1e;this['mt'][this[_0x392c72(0x1dc)]]=(((_0x467667&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0x467667&0xffff)*0x6c078965+this[_0x392c72(0x1dc)],this['mt'][this[_0x392c72(0x1dc)]]>>>=0x0;}},MersenneTwister[_0x3640d9(0x1e8)][_0x3640d9(0x1ea)]=function(){var _0xafe85c=_0x3640d9,_0x3ec8e0,_0x336aa7=new Array(0x0,this[_0xafe85c(0x1e3)]);if(this[_0xafe85c(0x1dc)]>=this['N']){var _0x458f36;if(this['mti']==this['N']+0x1)this[_0xafe85c(0x1e2)](0x1571);for(_0x458f36=0x0;_0x458f36<this['N']-this['M'];_0x458f36++){_0x3ec8e0=this['mt'][_0x458f36]&this['UPPER_MASK']|this['mt'][_0x458f36+0x1]&this[_0xafe85c(0x1db)],this['mt'][_0x458f36]=this['mt'][_0x458f36+this['M']]^_0x3ec8e0>>>0x1^_0x336aa7[_0x3ec8e0&0x1];}for(;_0x458f36<this['N']-0x1;_0x458f36++){_0x3ec8e0=this['mt'][_0x458f36]&this['UPPER_MASK']|this['mt'][_0x458f36+0x1]&this[_0xafe85c(0x1db)],this['mt'][_0x458f36]=this['mt'][_0x458f36+(this['M']-this['N'])]^_0x3ec8e0>>>0x1^_0x336aa7[_0x3ec8e0&0x1];}_0x3ec8e0=this['mt'][this['N']-0x1]&this['UPPER_MASK']|this['mt'][0x0]&this[_0xafe85c(0x1db)],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x3ec8e0>>>0x1^_0x336aa7[_0x3ec8e0&0x1],this['mti']=0x0;}return _0x3ec8e0=this['mt'][this[_0xafe85c(0x1dc)]++],_0x3ec8e0^=_0x3ec8e0>>>0xb,_0x3ec8e0^=_0x3ec8e0<<0x7&0x9d2c5680,_0x3ec8e0^=_0x3ec8e0<<0xf&0xefc60000,_0x3ec8e0^=_0x3ec8e0>>>0x12,_0x3ec8e0>>>0x0;},MersenneTwister['prototype'][_0x3640d9(0x1dd)]=function(){var _0x482217=_0x3640d9;return this[_0x482217(0x1ea)]()*(0x1/0x100000000);};