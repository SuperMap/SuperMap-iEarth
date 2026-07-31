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
var _0x4253ce=_0x3e64;(function(_0x457619,_0x34406b){var _0x351db8=_0x3e64,_0x36d76e=_0x457619();while(!![]){try{var _0xfb5eb3=-parseInt(_0x351db8(0x14c))/0x1*(parseInt(_0x351db8(0x14a))/0x2)+parseInt(_0x351db8(0x14f))/0x3+parseInt(_0x351db8(0x140))/0x4+-parseInt(_0x351db8(0x147))/0x5+-parseInt(_0x351db8(0x141))/0x6*(-parseInt(_0x351db8(0x146))/0x7)+parseInt(_0x351db8(0x14b))/0x8*(parseInt(_0x351db8(0x148))/0x9)+parseInt(_0x351db8(0x143))/0xa;if(_0xfb5eb3===_0x34406b)break;else _0x36d76e['push'](_0x36d76e['shift']());}catch(_0x9c3efd){_0x36d76e['push'](_0x36d76e['shift']());}}}(_0x3929,0xe6cc1));var MersenneTwister=function(_0x337733){var _0x3c831b=_0x3e64;_0x337733==undefined&&(_0x337733=new Date()['getTime']()),this['N']=0x270,this['M']=0x18d,this[_0x3c831b(0x145)]=0x9908b0df,this[_0x3c831b(0x150)]=0x80000000,this[_0x3c831b(0x142)]=0x7fffffff,this['mt']=new Array(this['N']),this[_0x3c831b(0x149)]=this['N']+0x1,this['init_genrand'](_0x337733);};MersenneTwister[_0x4253ce(0x144)][_0x4253ce(0x13f)]=function(_0xfa1369){var _0x30464a=_0x4253ce;this['mt'][0x0]=_0xfa1369>>>0x0;for(this[_0x30464a(0x149)]=0x1;this[_0x30464a(0x149)]<this['N'];this['mti']++){var _0xfa1369=this['mt'][this['mti']-0x1]^this['mt'][this[_0x30464a(0x149)]-0x1]>>>0x1e;this['mt'][this[_0x30464a(0x149)]]=(((_0xfa1369&0xffff0000)>>>0x10)*0x6c078965<<0x10)+(_0xfa1369&0xffff)*0x6c078965+this[_0x30464a(0x149)],this['mt'][this[_0x30464a(0x149)]]>>>=0x0;}},MersenneTwister['prototype'][_0x4253ce(0x14d)]=function(){var _0x4f4da1=_0x4253ce,_0x237e1c,_0xa01431=new Array(0x0,this['MATRIX_A']);if(this['mti']>=this['N']){var _0x4ba924;if(this[_0x4f4da1(0x149)]==this['N']+0x1)this[_0x4f4da1(0x13f)](0x1571);for(_0x4ba924=0x0;_0x4ba924<this['N']-this['M'];_0x4ba924++){_0x237e1c=this['mt'][_0x4ba924]&this[_0x4f4da1(0x150)]|this['mt'][_0x4ba924+0x1]&this['LOWER_MASK'],this['mt'][_0x4ba924]=this['mt'][_0x4ba924+this['M']]^_0x237e1c>>>0x1^_0xa01431[_0x237e1c&0x1];}for(;_0x4ba924<this['N']-0x1;_0x4ba924++){_0x237e1c=this['mt'][_0x4ba924]&this['UPPER_MASK']|this['mt'][_0x4ba924+0x1]&this[_0x4f4da1(0x142)],this['mt'][_0x4ba924]=this['mt'][_0x4ba924+(this['M']-this['N'])]^_0x237e1c>>>0x1^_0xa01431[_0x237e1c&0x1];}_0x237e1c=this['mt'][this['N']-0x1]&this['UPPER_MASK']|this['mt'][0x0]&this['LOWER_MASK'],this['mt'][this['N']-0x1]=this['mt'][this['M']-0x1]^_0x237e1c>>>0x1^_0xa01431[_0x237e1c&0x1],this[_0x4f4da1(0x149)]=0x0;}return _0x237e1c=this['mt'][this[_0x4f4da1(0x149)]++],_0x237e1c^=_0x237e1c>>>0xb,_0x237e1c^=_0x237e1c<<0x7&0x9d2c5680,_0x237e1c^=_0x237e1c<<0xf&0xefc60000,_0x237e1c^=_0x237e1c>>>0x12,_0x237e1c>>>0x0;},MersenneTwister['prototype'][_0x4253ce(0x14e)]=function(){var _0x23b8d0=_0x4253ce;return this[_0x23b8d0(0x14d)]()*(0x1/0x100000000);};function _0x3e64(_0x218052,_0x3eba9b){var _0x39293c=_0x3929();return _0x3e64=function(_0x3e6409,_0x373e66){_0x3e6409=_0x3e6409-0x13f;var _0x2588dc=_0x39293c[_0x3e6409];return _0x2588dc;},_0x3e64(_0x218052,_0x3eba9b);}function _0x3929(){var _0x4cce33=['392yiTqBO','1mAjMoN','genrand_int32','random','453015trvPnK','UPPER_MASK','init_genrand','2074584yRjytb','60YgTWSS','LOWER_MASK','23374460tgrnEW','prototype','MATRIX_A','13615cHpoLi','4359530DRkeQY','9045PgzsfD','mti','2517082tcVkrg'];_0x3929=function(){return _0x4cce33;};return _0x3929();}