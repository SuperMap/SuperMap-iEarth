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
define(['./when-8d13db60', './Check-70bec281', './Math-61ede240', './Cartographic-f2a06374', './Cartesian2-16a61632', './BoundingSphere-d018a565', './Cartesian4-5af5bb24', './RuntimeError-ba10bc3e', './WebGLConstants-4c11ee5f', './ComponentDatatype-5862616f', './GeometryAttribute-1ba9a4f7', './PrimitiveType-97893bc7', './FeatureDetection-7bd32c34', './Transforms-04dd01bc', './buildModuleUrl-f330cb27', './GeometryAttributes-aacecde6', './AttributeCompression-c177f997', './GeometryPipeline-4dfb7307', './EncodedCartesian3-a07a0929', './IndexDatatype-9435b55f', './IntersectionTests-813bb943', './Plane-aa6c3ce5', './arrayFill-9766fb2e', './EllipseGeometryLibrary-3f524671', './GeometryInstance-e632d44a', './GeometryOffsetAttribute-999fc023', './VertexFormat-fe4db402', './EllipseGeometry-385ef6e3'], function (when, Check, _Math, Cartographic, Cartesian2, BoundingSphere, Cartesian4, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, PrimitiveType, FeatureDetection, Transforms, buildModuleUrl, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, arrayFill, EllipseGeometryLibrary, GeometryInstance, GeometryOffsetAttribute, VertexFormat, EllipseGeometry) { 'use strict';

    function createEllipseGeometry(ellipseGeometry, offset) {
        if (when.defined(offset)) {
            ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
        }
        ellipseGeometry._center = Cartographic.Cartesian3.clone(ellipseGeometry._center);
        ellipseGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
        return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
    }

    return createEllipseGeometry;

});
