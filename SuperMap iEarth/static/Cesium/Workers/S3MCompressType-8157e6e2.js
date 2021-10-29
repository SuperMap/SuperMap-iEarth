/**
 * Cesium - https://github.com/CesiumGS/cesium
 *
 * Copyright 2011-2020 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/master/LICENSE.md for full licensing details.
 */
define(['exports', './when-8d13db60', './Check-70bec281', './Cartographic-f2a06374', './Cartesian2-16a61632', './BoundingSphere-d018a565', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './PrimitiveType-97893bc7', './IndexDatatype-9435b55f', './BoundingRectangle-5c75c80b'], function (exports, when, Check, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, PrimitiveType, IndexDatatype, BoundingRectangle) { 'use strict';

    /**
         * @private
         */
        function getStringFromTypedArray(uint8Array, byteOffset, byteLength, codeType) {
            //>>includeStart('debug', pragmas.debug);
            if (!when.defined(uint8Array)) {
                throw new Check.DeveloperError('uint8Array is required.');
            }
            if (byteOffset < 0) {
                throw new Check.DeveloperError('byteOffset cannot be negative.');
            }
            if (byteLength < 0) {
                throw new Check.DeveloperError('byteLength cannot be negative.');
            }
            if ((byteOffset + byteLength) > uint8Array.byteLength) {
                throw new Check.DeveloperError('sub-region exceeds array bounds.');
            }
            //>>includeEnd('debug');

            byteOffset = when.defaultValue(byteOffset, 0);
            byteLength = when.defaultValue(byteLength, uint8Array.byteLength - byteOffset);
            codeType = when.defaultValue(codeType, 'utf-8');

            uint8Array = uint8Array.subarray(byteOffset, byteOffset + byteLength);

            return getStringFromTypedArray.decode(uint8Array, codeType);
        }

        // Exposed functions for testing
        getStringFromTypedArray.decodeWithTextDecoder = function(view, codeType) {
            var decoder = new TextDecoder(codeType);
            return decoder.decode(view);
        };

        getStringFromTypedArray.decodeWithFromCharCode = function(view) {
            var result = '';
            var codePoints = utf8Handler(view);
            var length = codePoints.length;
            for (var i = 0; i < length; ++i) {
                var cp = codePoints[i];
                if (cp <= 0xFFFF) {
                    result += String.fromCharCode(cp);
                } else {
                    cp -= 0x10000;
                    result += String.fromCharCode((cp >> 10) + 0xD800,
                        (cp & 0x3FF) + 0xDC00);
                }

            }
            return result;
        };

        function inRange(a, min, max) {
            return min <= a && a <= max;
        }

        // This code is inspired by public domain code found here: https://github.com/inexorabletash/text-encoding
        function utf8Handler(utfBytes) {
            var codePoint = 0;
            var bytesSeen = 0;
            var bytesNeeded = 0;
            var lowerBoundary = 0x80;
            var upperBoundary = 0xBF;

            var codePoints = [];
            var length = utfBytes.length;
            for (var i = 0; i < length; ++i) {
                var currentByte = utfBytes[i];

                // If bytesNeeded = 0, then we are starting a new character
                if (bytesNeeded === 0) {
                    // 1 Byte Ascii character
                    if (inRange(currentByte, 0x00, 0x7F)) {
                        // Return a code point whose value is byte.
                        codePoints.push(currentByte);
                        continue;
                    }

                    // 2 Byte character
                    if (inRange(currentByte, 0xC2, 0xDF)) {
                        bytesNeeded = 1;
                        codePoint = currentByte & 0x1F;
                        continue;
                    }

                    // 3 Byte character
                    if (inRange(currentByte, 0xE0, 0xEF)) {
                        // If byte is 0xE0, set utf-8 lower boundary to 0xA0.
                        if (currentByte === 0xE0) {
                            lowerBoundary = 0xA0;
                        }
                        // If byte is 0xED, set utf-8 upper boundary to 0x9F.
                        if (currentByte === 0xED) {
                            upperBoundary = 0x9F;
                        }

                        bytesNeeded = 2;
                        codePoint = currentByte & 0xF;
                        continue;
                    }

                    // 4 Byte character
                    if (inRange(currentByte, 0xF0, 0xF4)) {
                        // If byte is 0xF0, set utf-8 lower boundary to 0x90.
                        if (currentByte === 0xF0) {
                            lowerBoundary = 0x90;
                        }
                        // If byte is 0xF4, set utf-8 upper boundary to 0x8F.
                        if (currentByte === 0xF4) {
                            upperBoundary = 0x8F;
                        }

                        bytesNeeded = 3;
                        codePoint = currentByte & 0x7;
                        continue;
                    }

                    throw new RuntimeError.RuntimeError('String decoding failed.');
                }

                // Out of range, so ignore the first part(s) of the character and continue with this byte on its own
                if (!inRange(currentByte, lowerBoundary, upperBoundary)) {
                    codePoint = bytesNeeded = bytesSeen = 0;
                    lowerBoundary = 0x80;
                    upperBoundary = 0xBF;
                    --i;
                    continue;
                }

                // Set appropriate boundaries, since we've now checked byte 2 of a potential longer character
                lowerBoundary = 0x80;
                upperBoundary = 0xBF;

                // Add byte to code point
                codePoint = (codePoint << 6) | (currentByte & 0x3F);

                // We have the correct number of bytes, so push and reset for next character
                ++bytesSeen;
                if (bytesSeen === bytesNeeded) {
                    codePoints.push(codePoint);
                    codePoint = bytesNeeded = bytesSeen = 0;
                }
            }

            return codePoints;
        }

        if (typeof TextDecoder !== 'undefined') {
            getStringFromTypedArray.decode = getStringFromTypedArray.decodeWithTextDecoder;
        } else {
            getStringFromTypedArray.decode = getStringFromTypedArray.decodeWithFromCharCode;
        }

    /**
     * S3M像素格式
     * @export S3MPixelFormat
     */
    var S3MPixelFormat = {
        /**
         * 8位像素，代表亮度
         */
        LUMINANCE_8 : 1,
        /**
         * 16位像素，代表亮度
         */
        LUMINANCE_16 : 2,
        /**
         * 8位像素，代表透明度
         */
        ALPHA : 3,
        /**
         * 8位像素，4位透明度4位亮度
         */
        ALPHA_4_LUMINANCE_4 : 4,
        /**
         * 16位像素，8位亮度8位透明度
         */
        LUMINANCE_ALPHA : 5,
        /**
         * 16位像素，R G B各为5 6 5
         */
        RGB_565 : 6,
        /**
         * 16位像素，B G R各为5 6 5
         */
        BGR565 : 7,
        /**
         * 24位像素，R G B各为8 8 8
         */
        RGB : 10,
        /**
         * 24位像素， B G R各为8 8 8
         */
        BGR : 11,
        /**
         * 32位像素，A R G B 各为8 8 8 8
         */
        ARGB : 12,
        /**
         * 32位像素，A B G R 各为8 8 8 8
         */
        ABGR : 13,
        /**
         * 32位像素，B G R A 各为8 8 8 8
         */
        BGRA : 14,
        /**
         * 32位像素，R G B A 各为8 8 8 8
         */
        WEBP : 25,
        RGBA : 28,
        DXT1 : 17,
        DXT2 : 18,
        DXT3 : 19,
        DXT4 : 20,
        DXT5 : 21,
        CRN_DXT5 : 26,
        STANDARD_CRN : 27
    };

    var S3MPixelFormat$1 = Object.freeze(S3MPixelFormat);

    //! Use DXT1 compression.
    var kDxt1 = ( 1 << 0 );

    //! Use DXT3 compression.
    var kDxt3 = ( 1 << 1 );

    //! Use DXT5 compression.
    var kDxt5 = ( 1 << 2 );

    var krgb565 = ( 1 << 5 );

    function Unpack565(packed0, packed1, colour, offset) {
        var value = packed0 | (packed1 << 8);

        var red = (value >> 11) & 0x1f;
        var green = (value >> 5) & 0x3f;
        var blue = value & 0x1f;

        colour[offset + 0] = ( red << 3 ) | ( red >> 2 );
        colour[offset + 1] = ( green << 2 ) | ( green >> 4 );
        colour[offset + 2] = ( blue << 3 ) | ( blue >> 2 );
        colour[offset + 3] = 255;

        return value;
    }

    function DecompressColour(rgba, block, nOffset, isDxt1) {
        var codes = new Uint8Array(16);

        var a = Unpack565(block[nOffset + 0], block[nOffset + 1], codes, 0);
        var b = Unpack565(block[nOffset + 2], block[nOffset + 3], codes, 4);

        for (var i = 0; i < 3; i++) {
            var c = codes[i];
            var d = codes[4 + i];

            if (isDxt1 && a <= b) {
                codes[8 + i] = ( c + d ) / 2;
                codes[12 + i] = 0;
            }
            else {
                codes[8 + i] = ( 2 * c + d ) / 3;
                codes[12 + i] = ( c + 2 * d ) / 3;
            }
        }

        codes[8 + 3] = 255;
        codes[12 + 3] = ( isDxt1 && a <= b ) ? 0 : 255;

        var indices = new Uint8Array(16);
        for (var i = 0; i < 4; ++i) {
            var packed = block[nOffset + 4 + i];

            indices[4 * i + 0] = packed & 0x3;
            indices[4 * i + 1] = ( packed >> 2 ) & 0x3;
            indices[4 * i + 2] = ( packed >> 4 ) & 0x3;
            indices[4 * i + 3] = ( packed >> 6 ) & 0x3;
        }

        for (var i = 0; i < 16; ++i) {
            var offset = 4 * indices[i];
            for (var j = 0; j < 4; ++j)
                rgba[4 * i + j] = codes[offset + j];
        }

    }

    function DecompressAlphaDxt3(rgba, block, nOffset) {
        // unpack the alpha values pairwise
        for (var i = 0; i < 8; ++i) {
            // quantise down to 4 bits
            var quant = bytes[nOffset + i];

            // unpack the values
            var lo = quant & 0x0f;
            var hi = quant & 0xf0;

            // convert back up to bytes
            rgba[8 * i + 3] = lo | ( lo << 4 );
            rgba[8 * i + 7] = hi | ( hi >> 4 );
        }
    }

    function DecompressAlphaDxt5(rgba, block, nOffset) {
        var alpha0 = block[nOffset + 0];
        var alpha1 = block[nOffset + 1];

        var codes = new Uint8Array(8);

        codes[0] = alpha0;
        codes[1] = alpha1;
        if (alpha0 <= alpha1) {
            // use 5-alpha codebook
            for (var i = 1; i < 5; ++i)
                codes[1 + i] = ( ( 5 - i ) * alpha0 + i * alpha1 ) / 5;
            codes[6] = 0;
            codes[7] = 255;
        }
        else {
            // use 7-alpha codebook
            for (var i = 1; i < 7; ++i)
                codes[1 + i] = ( ( 7 - i ) * alpha0 + i * alpha1 ) / 7;
        }

        var indices = new Uint8Array(16);
        var nOffset = nOffset + 2;
        var nBegin = 0;
        for (var i = 0; i < 2; ++i) {
            // grab 3 bytes
            var value = 0;
            for (var j = 0; j < 3; ++j) {
                var byte = block[nOffset++];
                value |= ( byte << 8 * j );
            }

            // unpack 8 3-bit values from it
            for (var j = 0; j < 8; ++j) {
                var index = ( value >> 3 * j ) & 0x7;
                indices[nBegin++] = index;
            }
        }

        for (var i = 0; i < 16; ++i)
            rgba[4 * i + 3] = codes[indices[i]];
    }

    function Decompress(rgba, block, nOffset, flags) {
        var nOffset2 = 0;
        if (( flags & ( kDxt3 | kDxt5 ) ) != 0)
            nOffset2 = 8;

        DecompressColour(rgba, block, nOffset + nOffset2, ( flags & kDxt1 ) != 0);

        if (( flags & kDxt3 ) != 0) {
            DecompressAlphaDxt3(rgba, block, nOffset);
        }
        else if (( flags & kDxt5 ) != 0) {
            DecompressAlphaDxt5(rgba, block, nOffset);
        }
    }

    function DecompressImage565(rgb565, width, height, blocks) {
        var c = new Uint16Array(4);
        var dst = rgb565;
        var m = 0;
        var dstI = 0;
        var i = 0;
        var r0 = 0, g0 = 0, b0 = 0, r1 = 0, g1 = 0, b1 = 0;

        var blockWidth = width / 4;
        var blockHeight = height / 4;
        for (var blockY = 0; blockY < blockHeight; blockY++) {
            for (var blockX = 0; blockX < blockWidth; blockX++) {
                i = 4 * ((blockHeight - blockY) * blockWidth + blockX);
                c[0] = blocks[i];
                c[1] = blocks[i + 1];
                r0 = c[0] & 0x1f;
                g0 = c[0] & 0x7e0;
                b0 = c[0] & 0xf800;
                r1 = c[1] & 0x1f;
                g1 = c[1] & 0x7e0;
                b1 = c[1] & 0xf800;
                // Interpolate between c0 and c1 to get c2 and c3.    ~
                // Note that we approximate 1/3 as 3/8 and 2/3 as 5/8 for
                // speed.  This also appears to be what the hardware DXT
                // decoder in many GPUs does :)
                c[2] = ((5 * r0 + 3 * r1) >> 3)
                    | (((5 * g0 + 3 * g1) >> 3) & 0x7e0)
                    | (((5 * b0 + 3 * b1) >> 3) & 0xf800);
                c[3] = ((5 * r1 + 3 * r0) >> 3)
                    | (((5 * g1 + 3 * g0) >> 3) & 0x7e0)
                    | (((5 * b1 + 3 * b0) >> 3) & 0xf800);
                m = blocks[i + 2];
                dstI = (blockY * 4) * width + blockX * 4;
                dst[dstI] = c[m & 0x3];
                dst[dstI + 1] = c[(m >> 2) & 0x3];
                dst[dstI + 2] = c[(m >> 4) & 0x3];
                dst[dstI + 3] = c[(m >> 6) & 0x3];
                dstI += width;
                dst[dstI] = c[(m >> 8) & 0x3];
                dst[dstI + 1] = c[(m >> 10) & 0x3];
                dst[dstI + 2] = c[(m >> 12) & 0x3];
                dst[dstI + 3] = c[(m >> 14)];
                m = blocks[i + 3];
                dstI += width;
                dst[dstI] = c[m & 0x3];
                dst[dstI + 1] = c[(m >> 2) & 0x3];
                dst[dstI + 2] = c[(m >> 4) & 0x3];
                dst[dstI + 3] = c[(m >> 6) & 0x3];
                dstI += width;
                dst[dstI] = c[(m >> 8) & 0x3];
                dst[dstI + 1] = c[(m >> 10) & 0x3];
                dst[dstI + 2] = c[(m >> 12) & 0x3];
                dst[dstI + 3] = c[(m >> 14)];
            }
        }
        return dst;
    }

    /*! @brief Decompresses an image in memory.

     @param rgba		Storage for the decompressed pixels.
     @param width	The width of the source image.
     @param height	The height of the source image.
     @param blocks	The compressed DXT blocks.
     @param flags	Compression flags.

     The decompressed pixels will be written as a contiguous array of width*height
     16 rgba values, with each component as 1 byte each. In memory this is:

     { r1, g1, b1, a1, .... , rn, gn, bn, an } for n = width*height

     The flags parameter should specify either kDxt1, kDxt3 or kDxt5 compression,
     however, DXT1 will be used by default if none is specified. All other flags
     are ignored.

     Internally this function calls squish::Decompress for each block.
     */
    function DecompressImage(rgba, width, height, blocks, flags) {
        var bytesPerBlock = ( ( flags & kDxt1 ) != 0 ) ? 8 : 16;

        var nOffset = 0;
        for (var y = 0; y < height; y += 4) {
            for (var x = 0; x < width; x += 4) {
                var targetRgba = new Uint8Array(4 * 16);
                Decompress(targetRgba, blocks, nOffset, flags);

                var nOffsetTarget = 0;
                for (var py = 0; py < 4; ++py) {
                    for (var px = 0; px < 4; ++px) {
                        var sx = x + px;
                        var sy = y + py;
                        if (sx < width && sy < height) {
                            // flip Y
                            var nBegin = 4 * ( width * (height - sy) + sx );

                            for (var i = 0; i < 4; ++i) {
                                rgba[nBegin++] = targetRgba[nOffsetTarget++];
                            }
                        }
                        else {
                            nOffsetTarget += 4;
                        }
                    }
                }

                // advance
                nOffset += bytesPerBlock;
            }
        }
    }

    function DXTTextureDecode(options){
    }

    DXTTextureDecode.decode = function(out, width, height, block, format){
        if (out == null || block == null || height == 0 || width == 0) {
            return;
        }
        var flags = 0;
        //有alpha通道,转为RGBA，否则转为rgb565
        if (format > S3MPixelFormat$1.BGR || format === S3MPixelFormat$1.LUMINANCE_ALPHA) {
            flags = kDxt5;
        }
        else {
            flags = kDxt1 | krgb565;
        }
        if ((flags & kDxt1) && (flags & krgb565)) {
            DecompressImage565(out, width, height, block);
        }
        else {
            DecompressImage(out, width, height, block, flags);
        }
    };

    var VertexCompressOptions = {
        SVC_Vertex : 1,	// 顶点带压缩
        SVC_Normal : 2,	// 法线带压缩
        SVC_VertexColor : 4, // 顶点颜色带压缩
        SVC_SecondColor	: 8, // 顶点颜色带压缩
        SVC_TexutreCoord : 16, // 纹理坐标带压缩
        SVC_TexutreCoordIsW	: 32 // 纹理坐标存储的是W位信息
    };

    var VertexCompressOption = Object.freeze(VertexCompressOptions);

    var DATAFILETYPE = {
        OSGBFile : 0,
        OSGBCacheFile : 1,
        ClampGroundPolygon : 2,
        ClampObjectPolygon : 3,
        ClampGroundLine : 4,
        ClampObjectLine : 5,
        IconPoint : 6,
        Text : 7,
        PointCloudFile : 8,
        // 动态拉伸面
        ExtendRegion3D : 9,
        ExtendClampPolygonCache : 10,

        PolylineEffect : 11,
        RegionEffect : 12,
        ClampGroundAndObjectLineCache : 13,
        ClampGroundRealtimeRasterCache : 14
    };

    var DATAFILETYPE$1 = Object.freeze(DATAFILETYPE);

    function S3MVertexPackage() {
    }

    function calcBoundingSphereForInstance(vertexPackage){
        var bSphere = new BoundingSphere.BoundingSphere();
        var bsValues = vertexPackage.instanceBounds;
        if(!when.defined(bsValues)) {
            return bSphere;
        }
        var pntLU = new Cartographic.Cartesian3(bsValues[0],bsValues[1],bsValues[2]);
        var pntRD = new Cartographic.Cartesian3(bsValues[3],bsValues[4],bsValues[5]);
        var center = Cartographic.Cartesian3.lerp(pntLU,pntRD,0.5,new Cartographic.Cartesian3());
        var radius = Cartographic.Cartesian3.distance(center,pntLU);
        bSphere.center = center;
        bSphere.radius = radius;
        return bSphere;
    }

    function calcBoundingSphereForNormal(vertexPackage){
        var bSphere = new BoundingSphere.BoundingSphere();
        var v1 = new Cartographic.Cartesian3();
        var positionAttr = vertexPackage.vertexAttributes[0];
        var dim = positionAttr.componentsPerAttribute;
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var normConstant = 1.0;
        var minVertex;
        var vertexTypedArray;
        if(isCompress){
            normConstant = vertexPackage.vertCompressConstant;
            minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
            vertexTypedArray = new Uint16Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 2);
        }
        else{
            vertexTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
        }

        var vertexArray = [];
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            Cartographic.Cartesian3.fromArray(vertexTypedArray, dim * t, v1);
            if(isCompress){
                v1 = Cartographic.Cartesian3.multiplyByScalar(v1, normConstant, v1);
                v1 = Cartographic.Cartesian3.add(v1, minVertex, v1);
            }
            vertexArray.push(Cartographic.Cartesian3.clone(v1));
        }
        BoundingSphere.BoundingSphere.fromPoints(vertexArray, bSphere);
        vertexArray.length = 0;
        return bSphere;
    }

    function calcBoundingSphereForShadowVolume(vertexPackage){
        var bSphere = new BoundingSphere.BoundingSphere();
        var v1 = new Cartographic.Cartesian3();
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var positionAttr = vertexPackage.vertexAttributes[0];
        var dim = positionAttr.componentsPerAttribute;
        var vertexTypedArray;
        var normConstant = 1.0;
        var minVertex;
        if(isCompress){
            normConstant = vertexPackage.vertCompressConstant;
            minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
            vertexTypedArray = new Uint16Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 2);
        }
        else{
            vertexTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
        }

        var vertexArray = [];
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            Cartographic.Cartesian3.fromArray(vertexTypedArray, dim * t, v1);
            if(isCompress){
                v1 = Cartographic.Cartesian3.multiplyByScalar(v1, normConstant, v1);
                v1 = Cartographic.Cartesian3.add(v1, minVertex, v1);
            }
            vertexArray.push(Cartographic.Cartesian3.clone(v1));
        }
        BoundingSphere.BoundingSphere.fromPoints(vertexArray, bSphere);
        vertexArray.length = 0;
        return bSphere;
    }

    function calcBoundingRectangleForShadowVolume(vertexPackage){
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var boundingRectangle = new BoundingRectangle.BoundingRectangle();
        var positionAttr = vertexPackage.vertexAttributes[0];
        var dim = positionAttr.componentsPerAttribute;
        var vertexTypedArray;
        var normConstant = 1.0;
        var minVertex;
        if(isCompress){
            normConstant = vertexPackage.vertCompressConstant;
            minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
            vertexTypedArray = new Uint16Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 2);
        }
        else{
            vertexTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
        }
        var vertexArray = [];
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            var x = vertexTypedArray[dim * t];
            var y = vertexTypedArray[dim * t + 1];
            if(isCompress){
                x = normConstant * x + minVertex.x;
                y = normConstant * y + minVertex.y;
            }
            vertexArray.push(new Cartesian2.Cartesian2(x, y));
        }
        BoundingRectangle.BoundingRectangle.fromPoints(vertexArray, boundingRectangle);
        vertexArray.length = 0;
        return boundingRectangle;
    }

    function calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage){
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var bSphere = new BoundingSphere.BoundingSphere();
        var v1 = new Cartographic.Cartesian3();
        var v2 = new Cartographic.Cartesian3();
        var positionAttr = vertexPackage.vertexAttributes[0];
        var posDim = positionAttr.componentsPerAttribute;
        var posAttrIndex = vertexPackage.attrLocation['aPosition'];
        var pos = vertexPackage.vertexAttributes[posAttrIndex];

        var posLowIndex = vertexPackage.attrLocation['aTexCoord5'];
        var posLowAttr = vertexPackage.vertexAttributes[posLowIndex];
        var posLowDim = posLowAttr.componentsPerAttribute;

        var posHighTypedArray, posLowTypedArray;
        if(isCompress){
            posDim = 3;
            posLowDim = 3;
            posHighTypedArray = getPosArrayForCompress(vertexPackage, pos);
            posLowTypedArray = getPosArrayForCompressTexCoord(vertexPackage, posLowAttr, 5);
        }
        else{
            posHighTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
            posLowTypedArray = new Float32Array(posLowAttr.typedArray.buffer, posLowAttr.typedArray.byteOffset, posLowAttr.typedArray.byteLength / 4);
        }

        var vertexArray = [];
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            Cartographic.Cartesian3.fromArray(posHighTypedArray, posDim * t, v1);
            Cartographic.Cartesian3.fromArray(posLowTypedArray, posLowDim * t, v2);
            Cartographic.Cartesian3.add(v1, v2, v1);
            vertexArray.push(Cartographic.Cartesian3.clone(v1));
        }
        BoundingSphere.BoundingSphere.fromPoints(vertexArray, bSphere);
        vertexArray.length = 0;
        return bSphere;
    }

    S3MVertexPackage.calcBoundingSphereInWorker = function(fileType, vertexPackage){
        var bSphere;
        if(vertexPackage.instanceIndex > -1){
            bSphere = calcBoundingSphereForInstance(vertexPackage);
        }
        else if(when.defined(vertexPackage.clampRegionEdge)){
            bSphere = calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage);
        }
        else if(fileType >= DATAFILETYPE$1.ClampGroundPolygon && fileType <= DATAFILETYPE$1.ClampObjectLine){
            bSphere = calcBoundingSphereForShadowVolume(vertexPackage);
        }
        else if(fileType == DATAFILETYPE$1.ClampGroundAndObjectLineCache){
            bSphere = calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage);
        }
        else{
            bSphere = calcBoundingSphereForNormal(vertexPackage);
        }
        return bSphere;
    };

    S3MVertexPackage.calcBoundingSphere = function(layer, vertexPackage, modelMatrix){
        var fileType = layer._fileType;
        var bSphere;
        if(vertexPackage.instanceIndex > -1){
            bSphere = calcBoundingSphereForInstance(vertexPackage);
        }
        else if(when.defined(vertexPackage.clampRegionEdge)){
            bSphere = calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage);
        }
        else if(fileType >= DATAFILETYPE$1.ClampGroundPolygon && fileType <= DATAFILETYPE$1.ClampObjectLine){
            bSphere = calcBoundingSphereForShadowVolume(vertexPackage);
        }
        else if(fileType == DATAFILETYPE$1.ClampGroundAndObjectLineCache){
            bSphere = calcBoundingSphereForClampGroundAndObjectLineCache(vertexPackage);
        }
        else{
            bSphere = calcBoundingSphereForNormal(vertexPackage);
        }
        BoundingSphere.BoundingSphere.transform(bSphere, modelMatrix, bSphere);
        return bSphere;
    };

    S3MVertexPackage.calcBoundingRectangle = function(layer, vertexPackage){
        var fileType = layer._fileType;
        var boundingRectangle;
        if(fileType === DATAFILETYPE$1.ClampGroundPolygon){
            boundingRectangle = calcBoundingRectangleForShadowVolume(vertexPackage);
        }
        return boundingRectangle;
    };

    function convertToCesiumPrimitiveType(s3mType){
        var primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;
        switch(s3mType){
            case 1 : primitiveType = PrimitiveType.PrimitiveType.POINTS;break;
            case 2 : primitiveType = PrimitiveType.PrimitiveType.LINES;break;
            case 3 : primitiveType = PrimitiveType.PrimitiveType.LINE_STRIP;break;
            case 4 : primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;break;
        }
        return primitiveType;
    }

    function createEdgeIndex(nPointCount, nSubCount, subPointCounts, nVertexCount){
        var indexPackage = {};
        indexPackage.indicesCount = 6 * (nPointCount - nSubCount);
        indexPackage.indexType = nVertexCount > 65535 ? 1 : 0;
        indexPackage.primitiveType = PrimitiveType.PrimitiveType.TRIANGLES;
        var indicesArray;
        if( indexPackage.indexType === 0){
            indicesArray = new Uint16Array(indexPackage.indicesCount);
        }
        else{
            indicesArray = new Uint32Array(indexPackage.indicesCount);
        }

        var nCount = 0;
        for (var nSub = 0; nSub < nSubCount; nSub++){
            for (var nData = 0; nData < subPointCounts[nSub] - 1; nData++){
                indicesArray[6 * (nCount - nSub  + nData)]     = 4 * (nCount - nSub + nData);
                indicesArray[6 * (nCount - nSub  + nData) + 1] = 4 * (nCount - nSub + nData) + 2;
                indicesArray[6 * (nCount - nSub  + nData) + 2] = 4 * (nCount - nSub + nData) + 1;
                indicesArray[6 * (nCount - nSub  + nData) + 3] = 4 * (nCount - nSub + nData) + 1;
                indicesArray[6 * (nCount - nSub  + nData) + 4] = 4 * (nCount - nSub + nData) + 2;
                indicesArray[6 * (nCount - nSub  + nData) + 5] = 4 * (nCount - nSub + nData) + 3;
            }
            // 点计数增加
            nCount += subPointCounts[nSub];
        }
        indexPackage.indicesTypedArray = indicesArray;
        return indexPackage;
    }

    function getPosArrayForCompress(vertexPackage, posAttr){
        var nVertexDim = posAttr.componentsPerAttribute;
        var normConstant = vertexPackage.vertCompressConstant;
        var minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
        var compressVertexArray = new Uint16Array(posAttr.typedArray.buffer, posAttr.typedArray.byteOffset, posAttr.typedArray.byteLength / 2);
        var uncompressVertexArray = new Float32Array(vertexPackage.verticesCount * 3);
        var x, y, z;
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            x = compressVertexArray[nVertexDim * t] * normConstant + minVertex.x;
            y = compressVertexArray[nVertexDim * t + 1] * normConstant + minVertex.y;
            z = compressVertexArray[nVertexDim * t + 2] * normConstant + minVertex.z;
            uncompressVertexArray[3 * t] = x;
            uncompressVertexArray[3 * t + 1] = y;
            uncompressVertexArray[3 * t + 2] = z;
        }
        return uncompressVertexArray;
    }

    function getPosArrayForCompressTexCoord(vertexPackage, texAttr, texIdx){
        var nVertexDim = texAttr.componentsPerAttribute;
        var texCoordCompressConstant = vertexPackage.texCoordCompressConstant[texIdx];
        var minVertex = new Cartesian4.Cartesian4(vertexPackage.minTexCoordValue[texIdx].x, vertexPackage.minTexCoordValue[texIdx].y, vertexPackage.minTexCoordValue[texIdx].z, vertexPackage.minTexCoordValue[texIdx].w);
        var compressVertexArray = new Uint16Array(texAttr.typedArray.buffer, texAttr.typedArray.byteOffset, texAttr.typedArray.byteLength / 2);
        var uncompressVertexArray = new Float32Array(vertexPackage.verticesCount * 3);
        var x, y, z;
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            x = compressVertexArray[nVertexDim * t] * texCoordCompressConstant + minVertex.x;
            y = compressVertexArray[nVertexDim * t + 1] * texCoordCompressConstant + minVertex.y;
            z = compressVertexArray[nVertexDim * t + 2] * texCoordCompressConstant + minVertex.z;
            uncompressVertexArray[3 * t] = x;
            uncompressVertexArray[3 * t + 1] = y;
            uncompressVertexArray[3 * t + 2] = z;
        }
        return uncompressVertexArray;
    }

    function getEdgeIndexPackage(arrIndexPackage){
        var oldEdgeIndexPackages = [];
        var length = arrIndexPackage.length;
        for(var i = 0; i < length; i++){
            var primitveTpe = convertToCesiumPrimitiveType(arrIndexPackage[i].primitiveType);
            if(primitveTpe === PrimitiveType.PrimitiveType.LINES || primitveTpe === PrimitiveType.PrimitiveType.LINE_STRIP){
                oldEdgeIndexPackages.push(arrIndexPackage[i]);
            }
        }
        return oldEdgeIndexPackages;
    }

    function getEdgeCount(edgeIndexPackages){
        var nSubCount = 0;
        var length = edgeIndexPackages.length;
        for (var k = 0; k < length; k++){
            var indexPackage = edgeIndexPackages[k];
            var primitveTpe = convertToCesiumPrimitiveType(indexPackage.primitiveType);
            if(primitveTpe == PrimitiveType.PrimitiveType.LINES){
                nSubCount += indexPackage.indicesCount / 2;
            }
            else if(primitveTpe == PrimitiveType.PrimitiveType.LINE_STRIP){
                nSubCount++;
            }
        }
        return nSubCount;
    }

    function getEdgePointCount(edgeIndexPackages){
        var nPointCount = 0;
        var length = edgeIndexPackages.length;
        for (var k = 0; k < length; k++){
            var indexPackage = edgeIndexPackages[k];
            nPointCount += indexPackage.indicesCount;
        }
        return nPointCount;
    }

    function getEdgePointArray(posArray, nVertexDim, edgeIndexPackages){
        var arrEdgePoint = [];
        var i;
        var length = edgeIndexPackages.length;
        for(var k = 0; k < length; k++){
            var indexPackage = edgeIndexPackages[k];
            var indicesArray;
            if(indexPackage.indexType === 0){
                indicesArray = new Uint16Array(indexPackage.indicesTypedArray.buffer, indexPackage.indicesTypedArray.byteOffset,
                    indexPackage.indicesTypedArray.byteLength / 2);
            }
            else{
                indicesArray = new Uint32Array(indexPackage.indicesTypedArray.buffer, indexPackage.indicesTypedArray.byteOffset,
                    indexPackage.indicesTypedArray.byteLength / 4);
            }
            var primitiveType = convertToCesiumPrimitiveType(indexPackage.primitiveType);
            if(primitiveType == PrimitiveType.PrimitiveType.LINES){
                for(i = 0; i < indexPackage.indicesCount; i += 2) {
                    var segment = [];
                    var vecPoint3DStart = new Cartographic.Cartesian3();
                    vecPoint3DStart.x = posArray[indicesArray[i] * nVertexDim];
                    vecPoint3DStart.y = posArray[indicesArray[i] * nVertexDim + 1];
                    vecPoint3DStart.z = posArray[indicesArray[i] * nVertexDim + 2];
                    segment.push(vecPoint3DStart);
                    var vecPoint3DEnd = new Cartographic.Cartesian3();
                    vecPoint3DEnd.x = posArray[indicesArray[i + 1] * nVertexDim];
                    vecPoint3DEnd.y = posArray[indicesArray[i + 1] * nVertexDim + 1];
                    vecPoint3DEnd.z = posArray[indicesArray[i + 1] * nVertexDim + 2];
                    segment.push(vecPoint3DEnd);
                    arrEdgePoint.push(segment);
                }
            }
            else if(primitiveType == PrimitiveType.PrimitiveType.LINE_STRIP) {
                var segment = [];
                for(i = 0; i < indexPackage.indicesCount; i++) {
                    var vecPoint3D = new Cartographic.Cartesian3();
                    vecPoint3D.x = posArray[indicesArray[ i ] * nVertexDim];
                    vecPoint3D.y = posArray[indicesArray[ i ] * nVertexDim + 1];
                    vecPoint3D.z = posArray[indicesArray[ i ] * nVertexDim + 2];
                    segment.push(vecPoint3D);
                }
                arrEdgePoint.push(segment);
            }
        }
        return arrEdgePoint;
    }

    S3MVertexPackage.createEdge = function(vertexPackage, arrIndexPackage){
        if(arrIndexPackage.length < 1){
            return;
        }
        var oldEdgeIndexPackages = getEdgeIndexPackage(arrIndexPackage);
        if(oldEdgeIndexPackages.length == 0){
            return;
        }

        var nSubCount = getEdgeCount(oldEdgeIndexPackages);

        var posAttrIndex = vertexPackage.attrLocation['aPosition'];
        var pos = vertexPackage.vertexAttributes[posAttrIndex];
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var nVertexDim = pos.componentsPerAttribute;
        var posArray;
        if(isCompress){
            nVertexDim = 3;
            posArray = getPosArrayForCompress(vertexPackage, pos);
        }
        else{
            posArray = new Float32Array(pos.typedArray.buffer, pos.typedArray.byteOffset, pos.typedArray.byteLength / 4);
        }

        var nPointCount = getEdgePointCount(oldEdgeIndexPackages);
        var arrPoints = getEdgePointArray(posArray, nVertexDim, oldEdgeIndexPackages);

        var vertexCount = 4 * nPointCount - 4 * nSubCount;
        var edgePosArray = new Float32Array(vertexCount * 3);
        var edgeNormalArray = new Float32Array(vertexCount * 3);
        var edgeTex0Array = new Float32Array(vertexCount * 3);
        var edgeTex1Array = new Int8Array(vertexCount * 2);

        var nCount = 0;
        for (var nSub = 0; nSub < nSubCount; nSub++){
            var nSubSize = arrPoints[nSub].length;
            for (var nData = 0; nData < nSubSize; nData++){
                var nTempPointOffset = 4 * nCount - 4 * nSub;
                var nTemp = nTempPointOffset * 3 + 12 * nData;
                var vecPoint3D = arrPoints[nSub][nData];
                if(nData != 0){
                    edgePosArray[nTemp - 6] = vecPoint3D.x;
                    edgePosArray[nTemp - 5] = vecPoint3D.y;
                    edgePosArray[nTemp - 4] = vecPoint3D.z;

                    edgePosArray[nTemp - 3] = vecPoint3D.x;
                    edgePosArray[nTemp - 2] = vecPoint3D.y;
                    edgePosArray[nTemp - 1] = vecPoint3D.z;
                }
                if(nData != nSubSize - 1){
                    edgePosArray[nTemp] =	  vecPoint3D.x;
                    edgePosArray[nTemp + 1] = vecPoint3D.y;
                    edgePosArray[nTemp + 2] = vecPoint3D.z;

                    edgePosArray[nTemp + 3] = vecPoint3D.x;
                    edgePosArray[nTemp + 4] = vecPoint3D.y;
                    edgePosArray[nTemp + 5] = vecPoint3D.z;
                }

                var vVertexNext = vecPoint3D;
                if(nData + 1 < nSubSize){
                    vVertexNext = arrPoints[nSub][nData + 1];
                }
                if(nData != 0){
                    edgeTex0Array[nTemp - 6] = vVertexNext.x;
                    edgeTex0Array[nTemp - 5] = vVertexNext.y;
                    edgeTex0Array[nTemp - 4] = vVertexNext.z;

                    edgeTex0Array[nTemp - 3] = vVertexNext.x;
                    edgeTex0Array[nTemp - 2] = vVertexNext.y;
                    edgeTex0Array[nTemp - 1] = vVertexNext.z;
                }
                if(nData != nSubSize - 1){
                    edgeTex0Array[nTemp] =	   vVertexNext.x;
                    edgeTex0Array[nTemp + 1] = vVertexNext.y;
                    edgeTex0Array[nTemp + 2] = vVertexNext.z;

                    edgeTex0Array[nTemp + 3] = vVertexNext.x;
                    edgeTex0Array[nTemp + 4] = vVertexNext.y;
                    edgeTex0Array[nTemp + 5] = vVertexNext.z;
                }

                var vVertexPrev = vecPoint3D;
                if(nData >= 1){
                    vVertexPrev = arrPoints[nSub][nData-1];
                }
                if(nData != 0){
                    edgeNormalArray[nTemp - 6] = vVertexPrev.x;
                    edgeNormalArray[nTemp - 5] = vVertexPrev.y;
                    edgeNormalArray[nTemp - 4] = vVertexPrev.z;

                    edgeNormalArray[nTemp - 3] = vVertexPrev.x;
                    edgeNormalArray[nTemp - 2] = vVertexPrev.y;
                    edgeNormalArray[nTemp - 1] = vVertexPrev.z;
                }
                if(nData != nSubSize - 1){
                    edgeNormalArray[nTemp] =	 vVertexPrev.x;
                    edgeNormalArray[nTemp + 1] = vVertexPrev.y;
                    edgeNormalArray[nTemp + 2] = vVertexPrev.z;

                    edgeNormalArray[nTemp + 3] = vVertexPrev.x;
                    edgeNormalArray[nTemp + 4] = vVertexPrev.y;
                    edgeNormalArray[nTemp + 5] = vVertexPrev.z;
                }

                nTemp = nTempPointOffset * 2 + 8 * nData;
                if(nData != 0){
                    //expandAndWidth
                    edgeTex1Array[nTemp - 4] = -1;
                    edgeTex1Array[nTemp - 3] = -1;
                    edgeTex1Array[nTemp - 2] = 1;
                    edgeTex1Array[nTemp - 1] = -1;
                }
                if(nData != nSubSize - 1){
                    //expandAndWidth
                    edgeTex1Array[nTemp] = -1;
                    edgeTex1Array[nTemp + 1] = 1;
                    edgeTex1Array[nTemp + 2] = 1;
                    edgeTex1Array[nTemp + 3] = 1;
                }
            }
            nCount += arrPoints[nSub].length;
        }

        var edgeVertexPackage = {};
        edgeVertexPackage.vertexAttributes = [];
        edgeVertexPackage.attrLocation = {};
        var edgeAttributes = edgeVertexPackage.vertexAttributes;
        var edgeAttrLocation = edgeVertexPackage.attrLocation;
        edgeVertexPackage.instanceCount = 0;
        edgeVertexPackage.instanceMode = 0;

        edgeAttrLocation['aPosition'] = 0;
        edgeAttributes.push({
            index: edgeAttrLocation['aPosition'],
            typedArray: edgePosArray,
            componentsPerAttribute: 3,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
            normalize: false
        });

        edgeAttrLocation['aNormal'] = 1;
        edgeAttributes.push({
            index: edgeAttrLocation['aNormal'],
            typedArray: edgeNormalArray,
            componentsPerAttribute: 3,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
            normalize: false
        });

        edgeAttrLocation['aTexCoord0'] = 2;
        edgeAttributes.push({
            index: edgeAttrLocation['aTexCoord0'],
            typedArray: edgeTex0Array,
            componentsPerAttribute: 3,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: 3 * Float32Array.BYTES_PER_ELEMENT,
            normalize: false
        });

        edgeAttrLocation['aTexCoord1'] = 3;
        edgeAttributes.push({
            index: edgeAttrLocation['aTexCoord1'],
            typedArray: edgeTex1Array,
            componentsPerAttribute: 2,
            componentDatatype: ComponentDatatype.ComponentDatatype.BYTE,
            offsetInBytes: 0,
            strideInBytes: 2 * Int8Array.BYTES_PER_ELEMENT,
            normalize: false
        });

        var arrPolyCount = [];
        for(var i = 0; i < arrPoints.length; i++) {
            arrPolyCount.push(arrPoints[i].length);
        }
        var edgeIndexPackage = createEdgeIndex(nPointCount, nSubCount, arrPolyCount, vertexCount);
        return {
            vertexPackage: edgeVertexPackage,
            indexPackage: edgeIndexPackage
        }
    };

    function returnTrue() {
            return true;
        }

        /**
         * Destroys an object.  Each of the object's functions, including functions in its prototype,
         * is replaced with a function that throws a {@link DeveloperError}, except for the object's
         * <code>isDestroyed</code> function, which is set to a function that returns <code>true</code>.
         * The object's properties are removed with <code>delete</code>.
         * <br /><br />
         * This function is used by objects that hold native resources, e.g., WebGL resources, which
         * need to be explicitly released.  Client code calls an object's <code>destroy</code> function,
         * which then releases the native resource and calls <code>destroyObject</code> to put itself
         * in a destroyed state.
         *
         * @exports destroyObject
         *
         * @param {Object} object The object to destroy.
         * @param {String} [message] The message to include in the exception that is thrown if
         *                           a destroyed object's function is called.
         *
         *
         * @example
         * // How a texture would destroy itself.
         * this.destroy = function () {
         *     _gl.deleteTexture(_texture);
         *     return Cesium.destroyObject(this);
         * };
         *
         * @see DeveloperError
         */
        function destroyObject(object, message) {
            message = when.defaultValue(message, 'This object was destroyed, i.e., destroy() was called.');

            function throwOnDestroyed() {
                //>>includeStart('debug', pragmas.debug);
                throw new Check.DeveloperError(message);
                //>>includeEnd('debug');
            }

            for ( var key in object) {
                if (typeof object[key] === 'function') {
                    object[key] = throwOnDestroyed;
                }
            }

            object.isDestroyed = returnTrue;

            return undefined;
        }

    /**
     * @private
     */
    var BufferUsage = {
        STREAM_DRAW : WebGLConstants.WebGLConstants.STREAM_DRAW,
        STATIC_DRAW : WebGLConstants.WebGLConstants.STATIC_DRAW,
        DYNAMIC_DRAW : WebGLConstants.WebGLConstants.DYNAMIC_DRAW,

        validate : function(bufferUsage) {
            return ((bufferUsage === BufferUsage.STREAM_DRAW) ||
            (bufferUsage === BufferUsage.STATIC_DRAW) ||
            (bufferUsage === BufferUsage.DYNAMIC_DRAW));
        }
    };

    /**
     * @private
     */
    function Buffer(options) {
        options = when.defaultValue(options, when.defaultValue.EMPTY_OBJECT);

        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('options.context', options.context);

        if (!when.defined(options.typedArray) && !when.defined(options.sizeInBytes)) {
            throw new Check.DeveloperError('Either options.sizeInBytes or options.typedArray is required.');
        }

        if (when.defined(options.typedArray) && when.defined(options.sizeInBytes)) {
            throw new Check.DeveloperError('Cannot pass in both options.sizeInBytes and options.typedArray.');
        }

        if (when.defined(options.typedArray)) {
            Check.Check.typeOf.object('options.typedArray', options.typedArray);
            Check.Check.typeOf.number('options.typedArray.byteLength', options.typedArray.byteLength);
        }

        if (!BufferUsage.validate(options.usage)) {
            throw new Check.DeveloperError('usage is invalid.');
        }
        //>>includeEnd('debug');

        var gl = options.context._gl;
        var bufferTarget = options.bufferTarget;
        var typedArray = options.typedArray;
        var sizeInBytes = options.sizeInBytes;
        var usage = options.usage;
        var hasArray = when.defined(typedArray);

        if (hasArray) {
            sizeInBytes = typedArray.byteLength;
        }

        //>>includeStart('debug', pragmas.debug);
        Check.Check.typeOf.number.greaterThan('sizeInBytes', sizeInBytes, 0);
        //>>includeEnd('debug');

        var buffer = gl.createBuffer();
        gl.bindBuffer(bufferTarget, buffer);
        gl.bufferData(bufferTarget, hasArray ? typedArray : sizeInBytes, usage);
        gl.bindBuffer(bufferTarget, null);

        this._gl = gl;
        this._webgl2 = options.context._webgl2;
        this._bufferTarget = bufferTarget;
        this._sizeInBytes = sizeInBytes;
        this._usage = usage;
        this._buffer = buffer;
        this.vertexArrayDestroyable = true;
        this.context = options.context;
        options.context.memorySize += sizeInBytes;
    }

    /**
     * Creates a vertex buffer, which contains untyped vertex data in GPU-controlled memory.
     * <br /><br />
     * A vertex array defines the actual makeup of a vertex, e.g., positions, normals, texture coordinates,
     * etc., by interpreting the raw data in one or more vertex buffers.
     *
     * @param {Object} options An object containing the following properties:
     * @param {Context} options.context The context in which to create the buffer
     * @param {ArrayBufferView} [options.typedArray] A typed array containing the data to copy to the buffer.
     * @param {Number} [options.sizeInBytes] A <code>Number</code> defining the size of the buffer in bytes. Required if options.typedArray is not given.
     * @param {BufferUsage} options.usage Specifies the expected usage pattern of the buffer. On some GL implementations, this can significantly affect performance. See {@link BufferUsage}.
     * @returns {VertexBuffer} The vertex buffer, ready to be attached to a vertex array.
     *
     * @exception {DeveloperError} Must specify either <options.typedArray> or <options.sizeInBytes>, but not both.
     * @exception {DeveloperError} The buffer size must be greater than zero.
     * @exception {DeveloperError} Invalid <code>usage</code>.
     *
     *
     * @example
     * // Example 1. Create a dynamic vertex buffer 16 bytes in size.
     * var buffer = Buffer.createVertexBuffer({
     *     context : context,
     *     sizeInBytes : 16,
     *     usage : BufferUsage.DYNAMIC_DRAW
     * });
     *
     * @example
     * // Example 2. Create a dynamic vertex buffer from three floating-point values.
     * // The data copied to the vertex buffer is considered raw bytes until it is
     * // interpreted as vertices using a vertex array.
     * var positionBuffer = buffer.createVertexBuffer({
     *     context : context,
     *     typedArray : new Float32Array([0, 0, 0]),
     *     usage : BufferUsage.STATIC_DRAW
     * });
     *
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGenBuffer.xml|glGenBuffer}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glBindBuffer.xml|glBindBuffer} with <code>ARRAY_BUFFER</code>
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glBufferData.xml|glBufferData} with <code>ARRAY_BUFFER</code>
     */
    Buffer.createVertexBuffer = function(options) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('options.context', options.context);
        //>>includeEnd('debug');

        return new Buffer({
            context: options.context,
            bufferTarget: WebGLConstants.WebGLConstants.ARRAY_BUFFER,
            typedArray: options.typedArray,
            sizeInBytes: options.sizeInBytes,
            usage: options.usage
        });
    };

    /**
     * Creates an index buffer, which contains typed indices in GPU-controlled memory.
     * <br /><br />
     * An index buffer can be attached to a vertex array to select vertices for rendering.
     * <code>Context.draw</code> can render using the entire index buffer or a subset
     * of the index buffer defined by an offset and count.
     *
     * @param {Object} options An object containing the following properties:
     * @param {Context} options.context The context in which to create the buffer
     * @param {ArrayBufferView} [options.typedArray] A typed array containing the data to copy to the buffer.
     * @param {Number} [options.sizeInBytes] A <code>Number</code> defining the size of the buffer in bytes. Required if options.typedArray is not given.
     * @param {BufferUsage} options.usage Specifies the expected usage pattern of the buffer. On some GL implementations, this can significantly affect performance. See {@link BufferUsage}.
     * @param {IndexDatatype} options.indexDatatype The datatype of indices in the buffer.
     * @returns {IndexBuffer} The index buffer, ready to be attached to a vertex array.
     *
     * @exception {DeveloperError} Must specify either <options.typedArray> or <options.sizeInBytes>, but not both.
     * @exception {DeveloperError} IndexDatatype.UNSIGNED_INT requires OES_element_index_uint, which is not supported on this system. Check context.elementIndexUint.
     * @exception {DeveloperError} The size in bytes must be greater than zero.
     * @exception {DeveloperError} Invalid <code>usage</code>.
     * @exception {DeveloperError} Invalid <code>indexDatatype</code>.
     *
     *
     * @example
     * // Example 1. Create a stream index buffer of unsigned shorts that is
     * // 16 bytes in size.
     * var buffer = Buffer.createIndexBuffer({
     *     context : context,
     *     sizeInBytes : 16,
     *     usage : BufferUsage.STREAM_DRAW,
     *     indexDatatype : IndexDatatype.UNSIGNED_SHORT
     * });
     *
     * @example
     * // Example 2. Create a static index buffer containing three unsigned shorts.
     * var buffer = Buffer.createIndexBuffer({
     *     context : context,
     *     typedArray : new Uint16Array([0, 1, 2]),
     *     usage : BufferUsage.STATIC_DRAW,
     *     indexDatatype : IndexDatatype.UNSIGNED_SHORT
     * });
     *
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glGenBuffer.xml|glGenBuffer}
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glBindBuffer.xml|glBindBuffer} with <code>ELEMENT_ARRAY_BUFFER</code>
     * @see {@link https://www.khronos.org/opengles/sdk/docs/man/xhtml/glBufferData.xml|glBufferData} with <code>ELEMENT_ARRAY_BUFFER</code>
     */
    Buffer.createIndexBuffer = function(options) {
        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('options.context', options.context);

        if (!IndexDatatype.IndexDatatype.validate(options.indexDatatype)) {
            throw new Check.DeveloperError('Invalid indexDatatype.');
        }

        if (options.indexDatatype === IndexDatatype.IndexDatatype.UNSIGNED_INT && !options.context.elementIndexUint) {
            throw new Check.DeveloperError('IndexDatatype.UNSIGNED_INT requires OES_element_index_uint, which is not supported on this system.  Check context.elementIndexUint.');
        }
        //>>includeEnd('debug');

        var context = options.context;
        var indexDatatype = options.indexDatatype;

        var bytesPerIndex = IndexDatatype.IndexDatatype.getSizeInBytes(indexDatatype);
        var buffer = new Buffer({
            context : context,
            bufferTarget : WebGLConstants.WebGLConstants.ELEMENT_ARRAY_BUFFER,
            typedArray : options.typedArray,
            sizeInBytes : options.sizeInBytes,
            usage : options.usage
        });

        var numberOfIndices = buffer.sizeInBytes / bytesPerIndex;

        Object.defineProperties(buffer, {
            indexDatatype: {
                get : function() {
                    return indexDatatype;
                }
            },
            bytesPerIndex : {
                get : function() {
                    return bytesPerIndex;
                }
            },
            numberOfIndices : {
                get : function() {
                    return numberOfIndices;
                }
            }
        });

        return buffer;
    };

    Object.defineProperties(Buffer.prototype, {
        sizeInBytes : {
            get : function() {
                return this._sizeInBytes;
            }
        },

        usage: {
            get : function() {
                return this._usage;
            }
        }
    });

    Buffer.prototype._getBuffer = function() {
        return this._buffer;
    };

    Buffer.prototype.copyFromArrayView = function(arrayView, offsetInBytes) {
        offsetInBytes = when.defaultValue(offsetInBytes, 0);

        //>>includeStart('debug', pragmas.debug);
        Check.Check.defined('arrayView', arrayView);
        Check.Check.typeOf.number.lessThanOrEquals('offsetInBytes + arrayView.byteLength', offsetInBytes + arrayView.byteLength, this._sizeInBytes);
        //>>includeEnd('debug');

        var gl = this._gl;
        var target = this._bufferTarget;
        gl.bindBuffer(target, this._buffer);
        gl.bufferSubData(target, offsetInBytes, arrayView);
        gl.bindBuffer(target, null);
    };

    Buffer.prototype.copyFromBuffer = function(readBuffer, readOffset, writeOffset, sizeInBytes) {
        //>>includeStart('debug', pragmas.debug);
        if (!this._webgl2) {
            throw new Check.DeveloperError('A WebGL 2 context is required.');
        }
        if (!when.defined(readBuffer)) {
            throw new Check.DeveloperError('readBuffer must be defined.');
        }
        if (!when.defined(sizeInBytes) || sizeInBytes <= 0) {
            throw new Check.DeveloperError('sizeInBytes must be defined and be greater than zero.');
        }
        if (!when.defined(readOffset) || readOffset < 0 || readOffset + sizeInBytes > readBuffer._sizeInBytes) {
            throw new Check.DeveloperError('readOffset must be greater than or equal to zero and readOffset + sizeInBytes must be less than of equal to readBuffer.sizeInBytes.');
        }
        if (!when.defined(writeOffset) || writeOffset < 0 || writeOffset + sizeInBytes > this._sizeInBytes) {
            throw new Check.DeveloperError('writeOffset must be greater than or equal to zero and writeOffset + sizeInBytes must be less than of equal to this.sizeInBytes.');
        }
        if (this._buffer === readBuffer._buffer && ((writeOffset >= readOffset && writeOffset < readOffset + sizeInBytes) || (readOffset > writeOffset && readOffset < writeOffset + sizeInBytes))) {
            throw new Check.DeveloperError('When readBuffer is equal to this, the ranges [readOffset + sizeInBytes) and [writeOffset, writeOffset + sizeInBytes) must not overlap.');
        }
        if ((this._bufferTarget === WebGLConstants.WebGLConstants.ELEMENT_ARRAY_BUFFER && readBuffer._bufferTarget !== WebGLConstants.WebGLConstants.ELEMENT_ARRAY_BUFFER) ||
            (this._bufferTarget !== WebGLConstants.WebGLConstants.ELEMENT_ARRAY_BUFFER && readBuffer._bufferTarget === WebGLConstants.WebGLConstants.ELEMENT_ARRAY_BUFFER)) {
            throw new Check.DeveloperError('Can not copy an index buffer into another buffer type.');
        }
        //>>includeEnd('debug');

        var readTarget = WebGLConstants.WebGLConstants.COPY_READ_BUFFER;
        var writeTarget = WebGLConstants.WebGLConstants.COPY_WRITE_BUFFER;

        var gl = this._gl;
        gl.bindBuffer(writeTarget, this._buffer);
        gl.bindBuffer(readTarget, readBuffer._buffer);
        gl.copyBufferSubData(readTarget, writeTarget, readOffset, writeOffset, sizeInBytes);
        gl.bindBuffer(writeTarget, null);
        gl.bindBuffer(readTarget, null);
    };

    Buffer.prototype.getBufferData = function(arrayView, sourceOffset, destinationOffset, length) {
        sourceOffset = when.defaultValue(sourceOffset, 0);
        destinationOffset = when.defaultValue(destinationOffset, 0);

        //>>includeStart('debug', pragmas.debug);
        if (!this._webgl2) {
            throw new Check.DeveloperError('A WebGL 2 context is required.');
        }
        if (!when.defined(arrayView)) {
            throw new Check.DeveloperError('arrayView is required.');
        }

        var copyLength;
        var elementSize;
        var arrayLength = arrayView.byteLength;
        if (!when.defined(length)) {
            if (when.defined(arrayLength)) {
                copyLength = arrayLength - destinationOffset;
                elementSize = 1;
            } else {
                arrayLength = arrayView.length;
                copyLength = arrayLength - destinationOffset;
                elementSize = arrayView.BYTES_PER_ELEMENT;
            }
        } else {
            copyLength = length;
            if (when.defined(arrayLength)) {
                elementSize = 1;
            } else {
                arrayLength = arrayView.length;
                elementSize = arrayView.BYTES_PER_ELEMENT;
            }
        }

        if (destinationOffset < 0 || destinationOffset > arrayLength) {
            throw new Check.DeveloperError('destinationOffset must be greater than zero and less than the arrayView length.');
        }
        if (destinationOffset + copyLength > arrayLength) {
            throw new Check.DeveloperError('destinationOffset + length must be less than or equal to the arrayViewLength.');
        }
        if (sourceOffset < 0 || sourceOffset > this._sizeInBytes) {
            throw new Check.DeveloperError('sourceOffset must be greater than zero and less than the buffers size.');
        }
        if (sourceOffset + copyLength * elementSize > this._sizeInBytes) {
            throw new Check.DeveloperError('sourceOffset + length must be less than the buffers size.');
        }
        //>>includeEnd('debug');

        var gl = this._gl;
        var target = WebGLConstants.WebGLConstants.COPY_READ_BUFFER;
        gl.bindBuffer(target, this._buffer);
        gl.getBufferSubData(target, sourceOffset, arrayView, destinationOffset, length);
        gl.bindBuffer(target, null);
    };

    Buffer.prototype.isDestroyed = function() {
        return false;
    };

    Buffer.prototype.destroy = function() {
        this._gl.deleteBuffer(this._buffer);
        this.context.memorySize -= this.sizeInBytes;
        return destroyObject(this);
    };

    /**
     * @constructor
     */
    function meshProcessing() {}

    meshProcessing.computeNeighbors = function (a, k) {
        for (var c = a.length / 3, l = new Uint32Array(k + 1), g = new Uint32Array(k + 1), f = function (d, b) {
            d < b ? l[d + 1]++ : g[b + 1]++;
        }, b = 0; b < c; b++) {
            var e = a[3 * b],
                d = a[3 * b + 1],
                m = a[3 * b + 2];
            f(e, d);
            f(d, m);
            f(m, e);
        }
        for (b = d = e = 0; b < k; b++) m = l[b + 1],
            f = g[b + 1],
            l[b + 1] = e,
            g[b + 1] = d,
            e += m,
            d += f;
        for (var v = new Uint32Array(6 * c), w = l[k], f = function (d, b, f) {
            if (d < b) {
                var e = l[d + 1]++;
                v[2 * e] = b;
                v[2 * e + 1] = f;
            } else e = g[b + 1]++,
                v[2 * w + 2 * e] = d,
                v[2 * w + 2 * e + 1] = f;
        }, b = 0; b < c; b++) e = a[3 * b],
            d = a[3 * b + 1],
            m = a[3 * b + 2],
            f(e, d, b),
            f(d, m, b),
            f(m, e, b);
        e = function (d, b) {
            var f = 2 * d;
            d = b - d;
            for (b = 1; b < d; b++) {
                var e = v[f + 2 * b],
                    k = v[f + 2 * b + 1],
                    m = b - 1;
                for (m; 0 <= m && v[f + 2 * m] > e; m--) v[f + 2 * m + 2] = v[f + 2 * m],
                    v[f + 2 * m + 3] = v[f + 2 * m + 1];
                v[f + 2 * m + 2] = e;
                v[f + 2 * m + 3] = k;
            }
        };
        for (b = 0; b < k; b++) e(l[b], l[b + 1]),
            e(w + g[b], w + g[b + 1]);
        for (var q = new Int32Array(3 * c), u = function (d, b) {
            return d === a[3 * b] ? 0 : d === a[3 * b + 1] ? 1 : d === a[3 * b + 2] ? 2 : -1
        }, c = function (d, b) {
            d = u(d, b);
            q[3 * b + d] = -1;
        }, e = function (d, b, f, e) {
            d = u(d, b);
            q[3 * b + d] = e;
            f = u(f, e);
            q[3 * e + f] = b;
        }, b = 0; b < k; b++) {
            for (var d = l[b], m = l[b + 1], f = g[b], p = g[b + 1]; d < m && f < p;) {
                var F = v[2 * d],
                    G = v[2 * w + 2 * f];
                F === G ? (e(b, v[2 * d + 1], G, v[2 * w + 2 * f + 1]), d++, f++) : F < G ? (c(b, v[2 * d + 1]), d++) : (c(G, v[2 * w + 2 * f + 1]), f++);
            }
            for (; d < m;) c(b, v[2 * d + 1]),
                d++;
            for (; f < p;) G = v[2 * w + 2 * f],
                c(G, v[2 * w + 2 * f + 1]),
                f++;
        }
        return q
    };

    function nextHighestPowerOfTwo(d) {
        --d;
        for (var b = 1; 32 > b; b <<= 1) d |= d >> b;
        return d + 1
    }

    var g = null;
    meshProcessing.deduplicate = function (a, k, c, h, r) {
        void 0 === c && (c = 0);
        void 0 === h && (h = 0);
        void 0 === r && (r = a.byteLength / (4 * k));
        a = new Uint32Array(a, h, r * k);
        h = new Uint32Array(r);
        var f = Math.floor(1.1 * r) + 1;
        if (null == g || g.length < 2 * f) g = new Uint32Array(nextHighestPowerOfTwo(2 * f));
        for (var b = 0; b < 2 * f; b++) g[b] = 0;
        for (var e = 0, d = 0 !== c ? Math.ceil(7.84 * 1.96 / (c * c) * c * (1 - c)) : r, b = 0; b < r; b++) {
            if (b === d) {
                var m = 1 - e / b;
                if (m + 1.96 * Math.sqrt(m * (1 - m) / b) < c) return null;
                d *= 2;
            }
            for (var m = b * k, v, w = v = 0; w < k; w++) v = a[m + w] + v | 0,
                v = v + (v << 11) + (v >>> 2) | 0;
            v >>>= 0;
            for (var w = v % f, q = e; 0 !== g[2 * w + 1];) {
                if (g[2 * w] === v) {
                    var u = g[2 * w + 1] - 1,
                        p = u * k;
                    a: {
                        for (var F = 0; F < k; F++) if (a[m + F] !== a[p + F]) {
                            p = !1;
                            break a
                        }
                        p = !0;
                    }
                    if (p) {
                        q = h[u];
                        break
                    }
                }
                w++;
                w >= f && (w -= f);
            }
            q === e && (g[2 * w] = v, g[2 * w + 1] = b + 1, e++);
            h[b] = q;
        }
        if (0 !== c && 1 - e / r < c) return null;
        c = new Uint32Array(k * e);
        for (b = e = 0; b < r; b++) if (h[b] === e) {
            f = a;
            d = b * k;
            m = c;
            v = e * k;
            w = k;
            for (q = 0; q < w; q++) m[v + q] = f[d + q];
            e++;
        }
        return {
            buffer: c.buffer,
            indices: h,
            uniqueCount: e
        }
    };

    /**
     * @constructor
     */
    function edgePreprocessing() {
    }

    function acos(d) {
        return Math.acos(1 < d ? 1 : -1 > d ? -1 : d)
    }

    function deg2rad(d) {
        return d * Math.PI / 180
    }

    // 判断相邻的两个面是否构成一个edge的角度阈值，小于此值不生成edge
    var ANGLE_PLANAR = 4;
    // 判断相邻的两个面是否构成明显edge的角度阈值，大于此值生成regular edge
    var ANGLE_SIGNIFICANT_EDGE = 35;

    var anglePlanar = deg2rad(ANGLE_PLANAR);
    var angleSignificantEdge = deg2rad(ANGLE_SIGNIFICANT_EDGE);
    var cosAngleSignificantEdge = Math.cos(angleSignificantEdge);
    var cosAnglePlanar = Math.cos(anglePlanar);

    function directionFromTo(b, f, e) {
        var d = e.x - f.x,
            k = e.y - f.y;
        f = e.z - f.z;
        e = d * d + k * k + f * f;
        if (!e) return b.x = 0,
            b.y = 0,
            b.z = 0,
            b;
        e = 1 / Math.sqrt(e);
        b.x = d * e;
        b.y = k * e;
        b.z = f * e;
        return b;
    }

    var scratchEdge = {
        position0 : new Cartographic.Cartesian3(),
        position1 : new Cartographic.Cartesian3(),
        faceNormal0 : new Cartographic.Cartesian3(),
        faceNormal1 : new Cartographic.Cartesian3(),
        cosAngle: 0
    };

    var scratchOrtho = new Cartographic.Cartesian3();
    var scratchFwd =  new Cartographic.Cartesian3();

    function isSilhouetteEdge(edge, anglePlanar) {
        var angle = acos(edge.cosAngle);
        directionFromTo(scratchFwd, edge.position1, edge.position0);
        Cartographic.Cartesian3.cross(edge.faceNormal0, edge.faceNormal1, scratchOrtho);
        var a = 0 < Cartographic.Cartesian3.dot(scratchOrtho, scratchFwd) ? -1 : 1;
        return angle * a > anglePlanar;
    }

    function computEdgeInfosArray(meshData) {
        var faceCount = meshData.faces.length / 3;
        var faces = meshData.faces;
        var neighbors = meshData.neighbors;
        var totalEdgeCount = 0;
        var faceIdx = 0;
        for (faceIdx = 0; faceIdx < faceCount; faceIdx++){
            var neighborFace0Index = neighbors[3 * faceIdx + 0];
            var neighborFace1Index = neighbors[3 * faceIdx + 1];
            var neighborFace2Index = neighbors[3 * faceIdx + 2];
            var faceVertex0Index = faces[3 * faceIdx + 0];
            var faceVertex1Index = faces[3 * faceIdx + 1];
            var faceVertex2Index = faces[3 * faceIdx + 2];
            totalEdgeCount = totalEdgeCount + (-1 === neighborFace0Index || faceVertex0Index < faceVertex1Index ? 1 : 0);
            totalEdgeCount = totalEdgeCount + (-1 === neighborFace1Index || faceVertex1Index < faceVertex2Index ? 1 : 0);
            totalEdgeCount = totalEdgeCount + (-1 === neighborFace2Index || faceVertex2Index < faceVertex0Index ? 1 : 0);
        }
        var edgeInfosArray = new Int32Array(4 * totalEdgeCount);
        var edgeIndex = 0;
        for (faceIdx = 0; faceIdx < faceCount; faceIdx++) {
            var neighborFace0Index = neighbors[3 * faceIdx + 0];
            var neighborFace1Index = neighbors[3 * faceIdx + 1];
            var neighborFace2Index = neighbors[3 * faceIdx + 2];
            var faceVertex0Index = faces[3 * faceIdx + 0];
            var faceVertex1Index = faces[3 * faceIdx + 1];
            var faceVertex2Index = faces[3 * faceIdx + 2];
            if (-1 === neighborFace0Index || faceVertex0Index < faceVertex1Index){
                edgeInfosArray[edgeIndex++] = faceVertex0Index;
                edgeInfosArray[edgeIndex++] = faceVertex1Index;
                edgeInfosArray[edgeIndex++] = faceIdx;
                edgeInfosArray[edgeIndex++] = neighborFace0Index;
            }
            if (-1 === neighborFace1Index || faceVertex1Index < faceVertex2Index){
                edgeInfosArray[edgeIndex++] = faceVertex1Index;
                edgeInfosArray[edgeIndex++] = faceVertex2Index;
                edgeInfosArray[edgeIndex++] = faceIdx;
                edgeInfosArray[edgeIndex++] = neighborFace1Index;
            }
            if (-1 === neighborFace2Index || faceVertex2Index < faceVertex0Index){
                edgeInfosArray[edgeIndex++] = faceVertex2Index;
                edgeInfosArray[edgeIndex++] = faceVertex0Index;
                edgeInfosArray[edgeIndex++] = faceIdx;
                edgeInfosArray[edgeIndex++] = neighborFace2Index;
            }
        }
        return edgeInfosArray;
    }

    var scratchV0 = new Cartographic.Cartesian3();
    var scratchV1 = new Cartographic.Cartesian3();
    var scratchV2 = new Cartographic.Cartesian3();

    function NormalizeCartesian3(v){
        var g = v.x * v.x + v.y * v.y + v.z * v.z;
        if(g > 0){
            g = 1 / Math.sqrt(g);
            v.x *= g;
            v.y *= g;
            v.z *= g;
        }
    }

    function computeFaceNormalArray(meshData) {
        var faceCount = meshData.faces.length / 3;
        var vertices = meshData.vertices;
        var dim = meshData.dim;
        var faces = meshData.faces;
        var faceNormalArray = new Float32Array(3 * faceCount);
        for (var faceIdx = 0; faceIdx < faceCount; faceIdx++) {
            var vertex0Index = faces[3 * faceIdx + 0];
            var vertex1Index = faces[3 * faceIdx + 1];
            var vertex2Index = faces[3 * faceIdx + 2];

            scratchV0.x = vertices[dim * vertex0Index];
            scratchV0.y = vertices[dim * vertex0Index + 1];
            scratchV0.z = vertices[dim * vertex0Index + 2];

            scratchV1.x = vertices[dim * vertex1Index];
            scratchV1.y = vertices[dim * vertex1Index + 1];
            scratchV1.z = vertices[dim * vertex1Index + 2];

            scratchV2.x = vertices[dim * vertex2Index];
            scratchV2.y = vertices[dim * vertex2Index + 1];
            scratchV2.z = vertices[dim * vertex2Index + 2];

            Cartographic.Cartesian3.subtract(scratchV1, scratchV0, scratchV1);
            Cartographic.Cartesian3.subtract(scratchV2, scratchV0, scratchV2);
            Cartographic.Cartesian3.cross(scratchV1, scratchV2, scratchV0);
            NormalizeCartesian3(scratchV0);
            faceNormalArray[3 * faceIdx + 0] = scratchV0.x;
            faceNormalArray[3 * faceIdx + 1] = scratchV0.y;
            faceNormalArray[3 * faceIdx + 2] = scratchV0.z;
        }
        return faceNormalArray
    }

    function range(a, b) {
        if(0 === b){
            b = a;
            a = 0;
        }
        for (var d = Array(b - a), c = a; c < b; c++) d[c - a] = c;
        return d
    }

    edgePreprocessing.extractEdges = function (meshData) {
        var positionValues = meshData.vertices;
        var dim = meshData.dim;

        var edge = scratchEdge;
        var position0 = edge.position0;
        var position1 = edge.position1;
        var faceNormal0 = edge.faceNormal0;
        var faceNormal1 = edge.faceNormal1;
        var faceNormalArray = computeFaceNormalArray(meshData);
        var edgeInfosArray = computEdgeInfosArray(meshData);
        var edgeCount = edgeInfosArray.length / 4;
        // vec3 position0 vec3 position1 vec3 faceNormal0
        var regularBuffer = new Float32Array(9 * edgeCount);
        var regularWritePos = 0;
        // vec3 position0 vec3 position1 vec3 faceNormal0 vec3 faceNormal1
        var silhouetteBuffer = new Float32Array(12 * edgeCount);
        var silhouetteWritePos = 0;
        var totalEdgeLength = 0;
        var totalEdgeCount = 0;
        var sortedEdgeIndexArray = range(0, edgeCount);
        var edgeLengthArray = new Float32Array(edgeCount);
        edgeLengthArray.forEach(function (a, curIndex, thisArray) {
            var pos0Index = edgeInfosArray[4 * curIndex + 0];
            var pos1Index = edgeInfosArray[4 * curIndex + 1];
            position0.x = positionValues[pos0Index * dim];
            position0.y = positionValues[pos0Index * dim + 1];
            position0.z = positionValues[pos0Index * dim + 2];

            position1.x = positionValues[pos1Index * dim];
            position1.y = positionValues[pos1Index * dim + 1];
            position1.z = positionValues[pos1Index * dim + 2];

            thisArray[curIndex] = Cartographic.Cartesian3.distance(position0, position1);
        });
        sortedEdgeIndexArray.sort(function (a, b) {
            return edgeLengthArray[b] - edgeLengthArray[a]
        });
        var regularEdgeLengths = [];
        var silhouetteEdgeLengths = [];
        for (var J = 0; J < edgeCount; J++) {
            var edgeIndex = sortedEdgeIndexArray[J],
                edgeLength = edgeLengthArray[edgeIndex],
                position0Index = edgeInfosArray[4 * edgeIndex + 0],
                position1Index = edgeInfosArray[4 * edgeIndex + 1],
                neighborFaceIndex0 = edgeInfosArray[4 * edgeIndex + 2],
                neighborFaceIndex1 = edgeInfosArray[4 * edgeIndex + 3],
                hasOneNeighborFace = -1 === neighborFaceIndex1;

            position0.x = positionValues[position0Index * dim];
            position0.y = positionValues[position0Index * dim + 1];
            position0.z = positionValues[position0Index * dim + 2];

            position1.x = positionValues[position1Index * dim];
            position1.y = positionValues[position1Index * dim + 1];
            position1.z = positionValues[position1Index * dim + 2];

            if (hasOneNeighborFace){
                faceNormal0.x = faceNormalArray[3 * neighborFaceIndex0];
                faceNormal0.y = faceNormalArray[3 * neighborFaceIndex0 + 1];
                faceNormal0.z = faceNormalArray[3 * neighborFaceIndex0 + 2];
                faceNormal1.x = faceNormal0.x;
                faceNormal1.y = faceNormal0.y;
                faceNormal1.z = faceNormal0.z;
                edge.cosAngle =  Cartographic.Cartesian3.dot(faceNormal0, faceNormal1);
            }
            else{
                faceNormal0.x = faceNormalArray[3 * neighborFaceIndex0];
                faceNormal0.y = faceNormalArray[3 * neighborFaceIndex0 + 1];
                faceNormal0.z = faceNormalArray[3 * neighborFaceIndex0 + 2];

                faceNormal1.x = faceNormalArray[3 * neighborFaceIndex1];
                faceNormal1.y = faceNormalArray[3 * neighborFaceIndex1 + 1];
                faceNormal1.z = faceNormalArray[3 * neighborFaceIndex1 + 2];

                edge.cosAngle =  Cartographic.Cartesian3.dot(faceNormal0, faceNormal1);
                if(edge.cosAngle > cosAnglePlanar){
                    continue;
                }
            }

            totalEdgeLength += edgeLength;
            totalEdgeCount++;
            if(hasOneNeighborFace || edge.cosAngle < cosAngleSignificantEdge){
                regularBuffer[regularWritePos++] = edge.position0.x;
                regularBuffer[regularWritePos++] = edge.position0.y;
                regularBuffer[regularWritePos++] = edge.position0.z;

                regularBuffer[regularWritePos++] = edge.position1.x;
                regularBuffer[regularWritePos++] = edge.position1.y;
                regularBuffer[regularWritePos++] = edge.position1.z;

                regularBuffer[regularWritePos++] = edge.faceNormal0.x;
                regularBuffer[regularWritePos++] = edge.faceNormal0.y;
                regularBuffer[regularWritePos++] = edge.faceNormal0.z;

                regularEdgeLengths.push(edgeLength);
            }
            else{
                if(isSilhouetteEdge(edge, anglePlanar)){
                    silhouetteBuffer[silhouetteWritePos++] = edge.position0.x;
                    silhouetteBuffer[silhouetteWritePos++] = edge.position0.y;
                    silhouetteBuffer[silhouetteWritePos++] = edge.position0.z;

                    silhouetteBuffer[silhouetteWritePos++] = edge.position1.x;
                    silhouetteBuffer[silhouetteWritePos++] = edge.position1.y;
                    silhouetteBuffer[silhouetteWritePos++] = edge.position1.z;

                    silhouetteBuffer[silhouetteWritePos++] = edge.faceNormal0.x;
                    silhouetteBuffer[silhouetteWritePos++] = edge.faceNormal0.y;
                    silhouetteBuffer[silhouetteWritePos++] = edge.faceNormal0.z;

                    silhouetteBuffer[silhouetteWritePos++] = edge.faceNormal1.x;
                    silhouetteBuffer[silhouetteWritePos++] = edge.faceNormal1.y;
                    silhouetteBuffer[silhouetteWritePos++] = edge.faceNormal1.z;

                    silhouetteEdgeLengths.push(edgeLength);
                }
            }
        }

        regularBuffer = regularBuffer.slice(0, regularWritePos);
        silhouetteBuffer = silhouetteBuffer.slice(0, silhouetteWritePos);

        var averageEdgeLength = totalEdgeLength / totalEdgeCount;
        var regularEdgeCount = regularEdgeLengths.length;
        var silhouetteEdgeCount = silhouetteEdgeLengths.length;
        return {
            regular : {
                instancesData : regularBuffer,
                instanceCount : regularEdgeCount,
                edgeLength : regularEdgeCount * averageEdgeLength
            },
            silhouette : {
                instancesData : silhouetteBuffer,
                instanceCount : silhouetteEdgeCount,
                edgeLength : silhouetteEdgeCount * averageEdgeLength
            },
            averageEdgeLength: averageEdgeLength
        };
    };

    /**
     * @constructor
     */
    function S3MEdgeProcessor(edgeBufferWriters){
    }

    S3MEdgeProcessor.RegularInstanceStride = 9;//每个实例的步进长度
    S3MEdgeProcessor.createEdgeData = function(vertexPackage, arrIndexPackage, transferableObjects){
        if(arrIndexPackage.length == 0){
            return null;
        }

        var indexPackage = arrIndexPackage[0];
        var indices;
        if(indexPackage.indexType === 0){
            indices = new Uint16Array(indexPackage.indicesTypedArray.buffer, indexPackage.indicesTypedArray.byteOffset,
                indexPackage.indicesTypedArray.byteLength / 2);
        }
        else{
            indices = new Uint32Array(indexPackage.indicesTypedArray.buffer, indexPackage.indicesTypedArray.byteOffset,
                indexPackage.indicesTypedArray.byteLength / 4);
        }

        var skipDeduplicate = false;
        var edgeInformation = S3MEdgeProcessor.extractEdgeInformation(vertexPackage, skipDeduplicate, indices);
        var edgeData = edgePreprocessing.extractEdges(edgeInformation);
        if(when.defined(transferableObjects)){
            if(when.defined(edgeData.regular.instancesData)){
                transferableObjects.push(edgeData.regular.instancesData.buffer);
            }
            if(when.defined(edgeData.silhouette.instancesData)){
                transferableObjects.push(edgeData.silhouette.instancesData.buffer);
            }
        }
        return edgeData;
    };

    var scratchSidenessVertexBuffer = null;
    function createEdgeSidenessVertexBuffer(context){
        if(when.defined(scratchSidenessVertexBuffer)){
            return scratchSidenessVertexBuffer;
        }
        var typedArray = new Float32Array(8);
        var pos = 0;
        // sideness
        typedArray[pos++] = 0;
        typedArray[pos++] = 0;

        typedArray[pos++] = 0;
        typedArray[pos++] = 1;

        typedArray[pos++] = 1;
        typedArray[pos++] = 1;

        typedArray[pos++] = 1;
        typedArray[pos++] = 0;

        scratchSidenessVertexBuffer = Buffer.createVertexBuffer({
            context : context,
            typedArray : typedArray,
            usage : BufferUsage.STATIC_DRAW
        });
        scratchSidenessVertexBuffer.vertexArrayDestroyable = false;
        return scratchSidenessVertexBuffer;
    }

    function createEdgeIndexArray(){
        var indicesTypedArray = new Uint16Array(6);
        var pos = 0;
        indicesTypedArray[pos++] = 2;
        indicesTypedArray[pos++] = 1;
        indicesTypedArray[pos++] = 0;
        indicesTypedArray[pos++] = 3;
        indicesTypedArray[pos++] = 2;
        indicesTypedArray[pos++] = 0;
        return indicesTypedArray;
    }

    var scratchIndexBuffer = null;
    S3MEdgeProcessor.createIndexBuffer = function(context){
        if(when.defined(scratchIndexBuffer)){
            return scratchIndexBuffer;
        }

        scratchIndexBuffer = Buffer.createIndexBuffer({
            context : context,
            typedArray : createEdgeIndexArray(),
            usage : BufferUsage.STATIC_DRAW,
            indexDatatype : IndexDatatype.IndexDatatype.UNSIGNED_SHORT
        });
        scratchIndexBuffer.vertexArrayDestroyable = false;
        return scratchIndexBuffer;
    };

    S3MEdgeProcessor.createRegularEdgeAttributes = function(context, regular){
        if(!when.defined(regular.instancesData) || regular.instancesData.length == 0){
            return;
        }

        var attributeLocations = {};
        var attributes = [];
        regular.attributeLocations = attributeLocations;
        regular.attributes = attributes;

        var instanceBuffer = Buffer.createVertexBuffer({
            context : context,
            typedArray : regular.instancesData,
            usage : BufferUsage.STATIC_DRAW
        });

        regular.instancesData = null;

        var componentSizeInBytes = ComponentDatatype.ComponentDatatype.getSizeInBytes(ComponentDatatype.ComponentDatatype.FLOAT);

        var sidenessVertexBuffer = createEdgeSidenessVertexBuffer(context);
        var attIndex = 0;
        attributeLocations['aSideness'] = attIndex++;
        attributes.push({
            index: attributeLocations['aSideness'],
            vertexBuffer : sidenessVertexBuffer,
            componentsPerAttribute: 2,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: ComponentDatatype.ComponentDatatype.getSizeInBytes(ComponentDatatype.ComponentDatatype.FLOAT) * 2,
            normalize: false
        });

        var stride = S3MEdgeProcessor.RegularInstanceStride;//3 + 3 + 3  pos0 pos1 facenormal0

        var offset = 0;
        attributeLocations['aPosition0'] = attIndex++;
        attributes.push({
            index : attributeLocations['aPosition0'],
            vertexBuffer : instanceBuffer,
            componentsPerAttribute : 3,
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            normalize              : false,
            offsetInBytes          : componentSizeInBytes * offset,
            strideInBytes          :  componentSizeInBytes * stride,
            instanceDivisor        : 1
        });
        offset += 3;

        attributeLocations['aPosition1'] = attIndex++;
        attributes.push({
            index : attributeLocations['aPosition1'],
            vertexBuffer : instanceBuffer,
            componentsPerAttribute : 3,
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            normalize              : false,
            offsetInBytes          : componentSizeInBytes * offset,
            strideInBytes          : componentSizeInBytes * stride,
            instanceDivisor        : 1
        });
        offset += 3;

        attributeLocations['aNormal'] = attIndex++;
        attributes.push({
            index : attributeLocations['aNormal'],
            vertexBuffer : instanceBuffer,
            componentsPerAttribute : 3,
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            normalize              : true,
            offsetInBytes          : componentSizeInBytes * offset,
            strideInBytes          : componentSizeInBytes * stride,
            instanceDivisor        : 1
        });
        offset += 3;
    };

    S3MEdgeProcessor.createSilhouetteEdgeAttributes = function(context, silhouette){
        if(!when.defined(silhouette.instancesData) || silhouette.instancesData.length == 0){
            return;
        }

        var attributeLocations = {};
        var attributes = [];
        silhouette.attributeLocations = attributeLocations;
        silhouette.attributes = attributes;

        var instanceBuffer = Buffer.createVertexBuffer({
            context : context,
            typedArray : silhouette.instancesData,
            usage : BufferUsage.STATIC_DRAW
        });
        silhouette.instancesData = null;

        var componentSizeInBytes = ComponentDatatype.ComponentDatatype.getSizeInBytes(ComponentDatatype.ComponentDatatype.FLOAT);
        var attIndex = 0;
        attributeLocations['aSideness'] = attIndex++;
        attributes.push({
            index: attributeLocations['aSideness'],
            vertexBuffer : createEdgeSidenessVertexBuffer(context),
            componentsPerAttribute: 2,
            componentDatatype: ComponentDatatype.ComponentDatatype.FLOAT,
            offsetInBytes: 0,
            strideInBytes: componentSizeInBytes * 2,
            normalize: false
        });

        // pos0 pos1 facenormal0 facenormal1
        var stride = 3 + 3 + 3 + 3;

        var offset = 0;
        attributeLocations['aPosition0'] = attIndex++;
        attributes.push({
            index : attributeLocations['aPosition0'],
            vertexBuffer : instanceBuffer,
            componentsPerAttribute : 3,
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            normalize              : false,
            offsetInBytes          : componentSizeInBytes * offset,
            strideInBytes          :  componentSizeInBytes * stride,
            instanceDivisor        : 1
        });
        offset += 3;

        attributeLocations['aPosition1'] = attIndex++;
        attributes.push({
            index : attributeLocations['aPosition1'],
            vertexBuffer : instanceBuffer,
            componentsPerAttribute : 3,
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            normalize              : false,
            offsetInBytes          : componentSizeInBytes*offset,
            strideInBytes          : componentSizeInBytes*stride,
            instanceDivisor        : 1
        });
        offset += 3;

        attributeLocations['aNormalA'] = attIndex++;
        attributes.push({
            index : attributeLocations['aNormalA'],
            vertexBuffer : instanceBuffer,
            componentsPerAttribute : 3,
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            normalize              : true,
            offsetInBytes          : componentSizeInBytes * offset,
            strideInBytes          : componentSizeInBytes * stride,
            instanceDivisor        : 1
        });
        offset += 3;

        attributeLocations['aNormalB'] = attIndex++;
        attributes.push({
            index : attributeLocations['aNormalB'],
            vertexBuffer : instanceBuffer,
            componentsPerAttribute : 3,
            componentDatatype : ComponentDatatype.ComponentDatatype.FLOAT,
            normalize              : true,
            offsetInBytes          : componentSizeInBytes * offset,
            strideInBytes          : componentSizeInBytes * stride,
            instanceDivisor        : 1
        });
        offset += 3;
    };

    function getPosArrayForCompress$1(vertexPackage, posAttr){
        var nVertexDim = posAttr.componentsPerAttribute;
        var normConstant = vertexPackage.vertCompressConstant;
        var minVertex = new Cartographic.Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
        var compressVertexArray = new Uint16Array(posAttr.typedArray.buffer, posAttr.typedArray.byteOffset, posAttr.typedArray.byteLength / 2);
        var uncompressVertexArray = new Float32Array(vertexPackage.verticesCount * 3);
        var x, y, z;
        for(var t = 0; t < vertexPackage.verticesCount; t++){
            x = compressVertexArray[nVertexDim * t] * normConstant + minVertex.x;
            y = compressVertexArray[nVertexDim * t + 1] * normConstant + minVertex.y;
            z = compressVertexArray[nVertexDim * t + 2] * normConstant + minVertex.z;
            uncompressVertexArray[3 * t] = x;
            uncompressVertexArray[3 * t + 1] = y;
            uncompressVertexArray[3 * t + 2] = z;
        }
        return uncompressVertexArray;
    }

    S3MEdgeProcessor.extractEdgeInformation = function (vertexPackage, skipDeduplicate, faces) {
        var posAttrIndex = vertexPackage.attrLocation['aPosition'];
        var posAttr = vertexPackage.vertexAttributes[posAttrIndex];

        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var nVertexDim = posAttr.componentsPerAttribute;

        var vertices;
        if(isCompress){
            nVertexDim = 3;
            vertices = getPosArrayForCompress$1(vertexPackage, posAttr);
        }
        else{
            vertices = new Float32Array(posAttr.typedArray.buffer, posAttr.typedArray.byteOffset, posAttr.typedArray.byteLength / 4);
        }

        var verticesCount = vertices.length / nVertexDim;

        if (skipDeduplicate && faces){
            var neighbors = meshProcessing.computeNeighbors(faces, verticesCount);
            return {
                faces: faces,
                neighbors: neighbors,
                vertices: vertices,
                dim : nVertexDim
            };
        }
        var totalBuffer = posAttr.typedArray.buffer;
        var verticesBuffer;
        if(isCompress){
            verticesBuffer = vertices.buffer;
        }
        else{
            verticesBuffer = totalBuffer.slice(posAttr.typedArray.byteOffset, posAttr.typedArray.byteOffset + posAttr.typedArray.byteLength);
        }
        var newVerticesAndIndices = meshProcessing.deduplicate(verticesBuffer, nVertexDim);
        var newFaces = S3MEdgeProcessor.selectIndexData(newVerticesAndIndices.indices, faces);
        var newNeighbors = meshProcessing.computeNeighbors(newFaces, newVerticesAndIndices.uniqueCount);
        var newVertices = new Float32Array(newVerticesAndIndices.buffer);
        return {
            faces: newFaces,
            neighbors: newNeighbors,
            vertices: newVertices,
            dim : nVertexDim
        }
    };

    S3MEdgeProcessor.selectIndexData = function (indices, faces) {
        if (faces) {
            faces = faces.slice();
            for (var c = 0; c < faces.length; c++){
                faces[c] = indices[faces[c]];
            }
            return faces;
        }
        return indices;
    };

    var scratchV0$1 = new Cartographic.Cartesian3();
    var scratchV1$1 = new Cartographic.Cartesian3();
    var scratchV2$1 = new Cartographic.Cartesian3();
    var scratchV3 = new Cartographic.Cartesian3();
    var scratchN0 = new Cartographic.Cartesian3();
    var scratchN1 = new Cartographic.Cartesian3();
    var scratchN2 = new Cartographic.Cartesian3();
    var scratchN3 = new Cartographic.Cartesian3();

    S3MEdgeProcessor.createEdgeDataByIndices = function(vertexPackage, indexPackage){
        var posAttrIndex = vertexPackage.attrLocation['aPosition'];
        var posAttr = vertexPackage.vertexAttributes[posAttrIndex];
        var isCompress = when.defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        var nVertexDim = posAttr.componentsPerAttribute;

        var vertices;
        if(isCompress){
            nVertexDim = 3;
            vertices = getPosArrayForCompress$1(vertexPackage, posAttr);
        }
        else {
            vertices = new Float32Array(posAttr.typedArray.buffer, posAttr.typedArray.byteOffset, posAttr.typedArray.byteLength / 4);
        }

        var indices;
        if(indexPackage.indexType === 0){
            indices = new Uint16Array(indexPackage.indicesTypedArray.buffer, indexPackage.indicesTypedArray.byteOffset,
                indexPackage.indicesTypedArray.byteLength / 2);
        }
        else {
            indices = new Uint32Array(indexPackage.indicesTypedArray.buffer, indexPackage.indicesTypedArray.byteOffset,
                indexPackage.indicesTypedArray.byteLength / 4);
        }


        var regularBuffer = [];
        var silhouetteBuffer = [];
        var len = indices.length;
        var totalEdgeLength = 0;
        for(var i = 0,j = Math.floor(len / 4) * 4; i < j; i += 4){
            var i1 = indices[i];
            var i2 = indices[i + 1];
            var i3 = indices[i + 2];
            var i4 = indices[i + 3];

            scratchV0$1.x = vertices[nVertexDim * i1];
            scratchV0$1.y = vertices[nVertexDim * i1 + 1];
            scratchV0$1.z = vertices[nVertexDim * i1 + 2];

            scratchV1$1.x = vertices[nVertexDim * i2];
            scratchV1$1.y = vertices[nVertexDim * i2 + 1];
            scratchV1$1.z = vertices[nVertexDim * i2 + 2];

            scratchV2$1.x = vertices[nVertexDim * i3];
            scratchV2$1.y = vertices[nVertexDim * i3 + 1];
            scratchV2$1.z = vertices[nVertexDim * i3 + 2];

            scratchV3.x = vertices[nVertexDim * i4];
            scratchV3.y = vertices[nVertexDim * i4 + 1];
            scratchV3.z = vertices[nVertexDim * i4 + 2];

            if (Cartographic.Cartesian3.equals(scratchV1$1, scratchV2$1) ||
                Cartographic.Cartesian3.equals(scratchV1$1, scratchV3) ||
                Cartographic.Cartesian3.equals(scratchV1$1, scratchV0$1) ||
                Cartographic.Cartesian3.equals(scratchV2$1, scratchV0$1) ||
                Cartographic.Cartesian3.equals(scratchV3, scratchV0$1)
            ) {
                continue;
            }

            if(i3 === i4){
                Cartographic.Cartesian3.subtract(scratchV1$1, scratchV0$1, scratchN0);
                Cartographic.Cartesian3.subtract(scratchV2$1, scratchV0$1, scratchN1);
                Cartographic.Cartesian3.cross(scratchN0, scratchN1, scratchN0);
                if(Cartographic.Cartesian3.equals(scratchN0, Cartographic.Cartesian3.ZERO)){
                    continue;
                }
                Cartographic.Cartesian3.normalize(scratchN0, scratchN0);
                regularBuffer.push(scratchV0$1.x);
                regularBuffer.push(scratchV0$1.y);
                regularBuffer.push(scratchV0$1.z);
                regularBuffer.push(scratchV1$1.x);
                regularBuffer.push(scratchV1$1.y);
                regularBuffer.push(scratchV1$1.z);

                regularBuffer.push(scratchN0.x);
                regularBuffer.push(scratchN0.y);
                regularBuffer.push(scratchN0.z);
            }
            else{
                Cartographic.Cartesian3.subtract(scratchV1$1, scratchV0$1, scratchN0);
                Cartographic.Cartesian3.subtract(scratchV2$1, scratchV0$1, scratchN1);
                Cartographic.Cartesian3.cross(scratchN0, scratchN1, scratchN0);
                if(Cartographic.Cartesian3.equals(scratchN0, Cartographic.Cartesian3.ZERO)){
                    continue;
                }
                Cartographic.Cartesian3.normalize(scratchN0, scratchN0);

                Cartographic.Cartesian3.subtract(scratchV1$1, scratchV0$1, scratchN2);
                Cartographic.Cartesian3.subtract(scratchV3, scratchV0$1, scratchN3);
                Cartographic.Cartesian3.cross(scratchN2, scratchN3, scratchN2);
                if(Cartographic.Cartesian3.equals(scratchN2, Cartographic.Cartesian3.ZERO)){
                    continue;
                }
                Cartographic.Cartesian3.normalize(scratchN2, scratchN2);

                silhouetteBuffer.push(scratchV0$1.x);
                silhouetteBuffer.push(scratchV0$1.y);
                silhouetteBuffer.push(scratchV0$1.z);
                silhouetteBuffer.push(scratchV1$1.x);
                silhouetteBuffer.push(scratchV1$1.y);
                silhouetteBuffer.push(scratchV1$1.z);

                silhouetteBuffer.push(scratchN0.x);
                silhouetteBuffer.push(scratchN0.y);
                silhouetteBuffer.push(scratchN0.z);

                silhouetteBuffer.push(scratchN2.x);
                silhouetteBuffer.push(scratchN2.y);
                silhouetteBuffer.push(scratchN2.z);
            }

            var edgeLength = Cartographic.Cartesian3.distance(scratchV0$1, scratchV1$1);
            totalEdgeLength += edgeLength;
        }

        var totalEdgeCount = len / 4;
        var averageEdgeLength = totalEdgeLength / totalEdgeCount;
        var regularEdgeCount = regularBuffer.length / S3MEdgeProcessor.RegularInstanceStride;
        var silhouetteEdgeCount = silhouetteBuffer.length / 12;

        return {
            regular : {
                instancesData : new Float32Array(regularBuffer),
                instanceCount : regularEdgeCount,
                edgeLength : regularEdgeCount * averageEdgeLength
            },
            silhouette : {
                instancesData : new Float32Array(silhouetteBuffer),
                instanceCount : silhouetteEdgeCount,
                edgeLength : silhouetteEdgeCount
            },
            averageEdgeLength: averageEdgeLength
        };
    };

    /**
     * S3M纹理压缩类型
     * @export S3MCompressType
     */
    var S3MCompressType = {
        /**
         * 非压缩
         */
        encNONE : 0,
        /**
         * DXT压缩
         */
        enrS3TCDXTN : 14,
        /**
         * PVR压缩-IOS设备
         */
        enrPVRTPF_PVRTC2 : 19,
        /**
         * PVR压缩-IOS设备
         */
        enrPVRTPF_PVRTC : 20,
        /**
         * PVR压缩-IOS设备
         */
        enrPVRTPF_PVRTC_4bpp : 21,
        /**
         * ETC压缩-安卓设备
         */
        enrPVRTPF_ETC1 : 22
    };

    var S3MCompressType$1 = Object.freeze(S3MCompressType);

    exports.DXTTextureDecode = DXTTextureDecode;
    exports.S3MCompressType = S3MCompressType$1;
    exports.S3MEdgeProcessor = S3MEdgeProcessor;
    exports.S3MPixelFormat = S3MPixelFormat$1;
    exports.S3MVertexPackage = S3MVertexPackage;
    exports.VertexCompressOption = VertexCompressOption;
    exports.getStringFromTypedArray = getStringFromTypedArray;

});
