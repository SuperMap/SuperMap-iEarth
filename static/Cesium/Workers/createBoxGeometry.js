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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-f2a06374', './Cartesian2-16a61632', './BoundingSphere-d018a565', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-773da12d', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-f77c92da', './buildModuleUrl-392763e2', './GeometryAttributes-aacecde6', './arrayFill-9766fb2e', './GeometryOffsetAttribute-999fc023', './VertexFormat-fe4db402', './BoxGeometry-7a5fc8d8'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, arrayFill, GeometryOffsetAttribute, VertexFormat, BoxGeometry) { 'use strict';

    function createBoxGeometry(boxGeometry, offset) {
        if (when.defined(offset)) {
            boxGeometry = BoxGeometry.BoxGeometry.unpack(boxGeometry, offset);
        }
        return BoxGeometry.BoxGeometry.createGeometry(boxGeometry);
    }

    return createBoxGeometry;

});
